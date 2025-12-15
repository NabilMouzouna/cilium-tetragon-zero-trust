## 🛡️ Zero Trust Kubernetes (Cilium, Tetragon (eBPF))

This guide documents the full journey of setting up a Kubernetes cluster with **Cilium** and **Tetragon** to enforce a multi-layered Zero Trust security posture. The core security principle leveraged here is **eBPF (extended Berkeley Packet Filter)** for high-performance network and runtime enforcement.

-----

## 1\. Local Development Environment Setup

This section covers the prerequisite setup for Windows/WSL2 and Docker, required to run a local Kubernetes cluster using `kind`.

### 1.1 Install and Verify WSL2

```powershell
wsl --install
```

  * **Verified WSL2 installation:**
    ```powershell
    wsl -l -v
    ```

### 1.2 Install and Verify Docker

  * Install **Docker Desktop**.
  * **Verified Docker installation:**
    ```powershell
    docker run hello-world
    ```

-----

## 2\. Application Deployment (Default Accept Posture)

We load the application images and deploy the manifests to a new namespace. At this stage, all network traffic is *allowed by default*.

### 2.1 Load Docker Images into `kind`

Load the application images into the `zero-trust-k8s` cluster:

```powershell
kind load docker-image nublenews-backend:dev --name zero-trust-k8s
kind load docker-image nublenews-frontend:dev --name zero-trust-k8s
```

### 2.2 Deploy Application Manifests

The current network posture is **Default Accept**.

```powershell
kubectl apply -f manifests/namespace.yaml
kubectl apply -f manifests/backend.yaml
kubectl apply -f manifests/frontend.yaml
```

-----

## 3\. Install Cilium CNI and Hubble

Cilium is the Container Network Interface (CNI) that provides high-performance networking and network policy enforcement using eBPF. Hubble provides visibility into the network flows.

### 3.1 Install Cilium CNI and Hubble (PowerShell)

```powershell
helm repo add cilium https://helm.cilium.io/
helm repo update
helm install cilium cilium/cilium --version 1.18.4 `
  --namespace kube-system `
  --set image.pullPolicy=IfNotPresent `
  --set ipam.mode=kubernetes `
  --set hubble.enabled=true `
  --set hubble.relay.enabled=true `
  --set hubble.ui.enabled=true `
  --set kubeProxyReplacement=true `
  --skip-crds
```

### 3.2 Verify CNI Installation

Wait until the node is Ready (may take a few minutes):

```powershell
kubectl wait --for=condition=Ready nodes --all --timeout=300s
```

-----

## 4\. Install Cilium Tetragon for Runtime Visibility

Tetragon is the component that uses eBPF to monitor application behavior at the kernel level, providing deep runtime visibility.

### 4.1 Install Tetragon Agent (PowerShell)

```powershell
helm repo update
helm install tetragon cilium/tetragon --version 1.6.0 -n kube-system
kubectl rollout status -n kube-system ds/tetragon -w
```

### 4.2 Install `tetra` CLI

The `tetra` CLI is used to stream events from the Tetragon agent.

1.  Manually download `tetra-windows-amd64.tar.gz` from the [Cilium Tetragon releases page](https://github.com/cilium/tetragon/releases).
2.  Extract the `tetra.exe` binary.
3.  Move `tetra.exe` to a directory on your PATH (e.g., `C:\tetragon`).
4.  **Restart PowerShell** to load the updated PATH.

### 4.3 Verify Runtime Visibility

This check confirms that the Tetragon agent is capturing kernel-level events.

1.  **Terminal 1 (Port Forward):** Set up the port bridge (using port 54500 to avoid conflicts):
    ```powershell
    kubectl port-forward tetragon-d4k46 -n kube-system 54500:54321
    ```
2.  **Terminal 2 (Monitor):** Stream events:
    ```powershell
    C:\tetragon\tetra.exe getevents -n nublenews --server-address 127.0.0.1:54500
    ```
3.  **Terminal 3 (Executor):** Generate test events:
    ```powershell
    $POD_NAME = (kubectl get pods -n nublenews -l app=frontend -o jsonpath='{.items[0].metadata.name}')
    kubectl exec -n nublenews $POD_NAME -- cat /etc/hosts
    ```
    > *Verification: Events should appear in Terminal 2.*

-----

## 5\. Zero Trust Network Enforcement (L3, L4, & L7)

The goal is to move from **Default Accept** to **Least Privilege** by enforcing a multi-layered policy.

### 5.1 A. Demonstrate Security Risk (Default Accept)

First, we prove that the default posture is vulnerable.

1.  **Deploy Attacker Pod:**
    ```powershell
    kubectl apply -f manifests/attacker.yaml
    kubectl wait --for=condition=Ready pod/attacker -n nublenews --timeout=30s
    ```
2.  **Verify successful attack:** The attacker successfully connects and exfiltrates data from the backend.
    > *Debugging Note: The backend pod IP was found to be `10.244.0.162` on TCP port `3001`.*
    ```powershell
    # Prove data can be exfiltrated
    kubectl exec -n nublenews attacker -- curl 10.244.0.162:3001
    # Result: SUCCESS (Vulnerability Confirmed)
    ```

### 5.2 B. Enforce Zero Trust (L3/L4/L7 Ingress)

We apply a **CiliumNetworkPolicy** to restrict access to the backend service.

  * **Policy (`allow-l7-ingress.yaml`):** This policy enforces:

      * **L3/L4:** Only the `frontend` pod (`matchLabels: app: frontend`) can talk to the `backend` on TCP port `3001`.
      * **L7 (Application):** The connection is further restricted to only `GET /news` HTTP requests.

    <!-- end list -->

    ```yaml
    # Policy Snippet
    apiVersion: "cilium.io/v2"
    kind: CiliumNetworkPolicy
    # ...
    spec:
      endpointSelector:
        matchLabels:
          app: backend
      ingress:
        - fromEndpoints:
            - matchLabels:
                app: frontend # <-- L3/L4 Enforcement (Source)
          toPorts:
            - ports:
                - port: "3001"
                  protocol: TCP # <-- L4 Enforcement (Port/Protocol)
              rules:
                http: # <-- L7 Enforcement
                  - method: "GET"
                    path: "/news"
    ```

  * **Apply the L7 Policy:**

    ```powershell
    kubectl apply -f manifests/allow-l7-ingress.yaml
    ```

  * **Verify successful defense:**

    ```powershell
    # Re-running the attack now FAILS because the attacker pod's label ('app: attacker') is not whitelisted.
    kubectl exec -n nublenews attacker -- curl 10.244.0.162:3001
    # Result: FAIL (Zero Trust L3/L4 Enforcement Confirmed)
    ```

### 5.3 C. Final Network Posture

| Component | Security Layer | Status | Description |
| :--- | :--- | :--- | :--- |
| **Ingress (Inbound)** | L3, L4, L7 | **Complete** | Only the `frontend` can talk to the `backend` on TCP port 3001, and only for `GET /news` requests. |
| **Security Visibility** | Runtime/Kernel | **Complete** | Tetragon is running and capturing kernel-level events via `tetra` CLI. |

-----

## 6\. Conclusion and Next Steps

You have successfully achieved the core objectives of this project: setting up the Zero Trust platform and enforcing a multi-layered policy between critical application components.

### Final Verification

  * Check the frontend at: `http://localhost:30080` (Should still work for legitimate traffic).

### Further Zero Trust Steps (Outside Core Project Scope)

  * **Network Egress Lockdown:** Apply a policy to block all outbound traffic from the `nublenews` namespace except for necessary services (e.g., DNS to CoreDNS in `kube-system`).
  * **Runtime Enforcement:** Create a Tetragon `TracingPolicy` to block unexpected binaries (like `/bin/bash` or `nc`) from executing inside the `frontend` or `backend` containers, leveraging the kernel-level control established in Section 4.