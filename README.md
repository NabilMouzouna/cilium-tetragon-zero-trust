## 🛡️ Zero Trust Kubernetes (Cilium, Tetragon (eBPF))
This guide documents the full journey of setting up a Kubernetes cluster with Cilium and Tetragon to enforce a multi-layered Zero Trust security posture.

-----

## Setup WSL2 and Docker



  * Installed WSL2 with Ubuntu:

      \`\`\`powershell

      wsl --install


<!-- end list -->


````

* Verified WSL2 installation:

  ```powershell

  wsl -l -v

  ```

* Installed Docker Desktop, verified with:

  ```powershell

  docker run hello-world

  ```


--- 

-----

## Load Docker Images and Deploy Application

  * Load images:
      ` powershell   kind load docker-image nublenews-backend:dev --name zero-trust-k8s   kind load docker-image nublenews-frontend:dev --name zero-trust-k8s    `

  * Deploy Application Manifests (Current Network Posture: Default Accept)

  ` powershell   kubectl apply -f manifests/namespace.yaml   kubectl apply -f manifests/backend.yaml   kubectl apply -f manifests/frontend.yaml    `

-----

 * **Install Cilium CNI and Hubble (PowerShell):**


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

* **Verify CNI Installation:** Wait until the node is Ready.

    ```powershell

    kubectl wait --for=condition=Ready nodes --all --timeout=300s

    ```

----
--- 
 ## Install Cilium Tetragon for Runtime Visibility


This installs the agent that monitors application behavior at the kernel level using eBPF.


* **Install Tetragon Agent (PowerShell):**


    ```powershell

    helm repo update

    helm install tetragon cilium/tetragon --version 1.6.0 -n kube-system

    kubectl rollout status -n kube-system ds/tetragon -w

    ```


* **Install `tetra` CLI (Manual Download Recommended):**

    * Manually download `tetra-windows-amd64.tar.gz` from the [Cilium Tetragon releases page](https://github.com/cilium/tetragon/releases).

    * Extract the `tetra.exe` binary.

    * Move `tetra.exe` to a directory on your PATH (e.g., `C:\tetragon`).

    * **Restart PowerShell** to load the updated PATH.


* **Verify Runtime Visibility (Successful Connection Check):**

    1.  **Terminal 1 (Port Forward):** Set up the port bridge (using port 54500 to avoid conflicts):

        ```powershell

        kubectl port-forward tetragon-d4k46 -n kube-system 54500:54321

        ```

    2.  **Terminal 2 (Monitor):** Stream events successfully:

        ```powershell

        C:\tetragon\tetra.exe getevents -n nublenews --server-address 127.0.0.1:54500

        ```

    3.  **Terminal 3 (Executor):** Generate test events:

        ```powershell

        $POD_NAME = (kubectl get pods -n nublenews -l app=frontend -o jsonpath='{.items[0].metadata.name}')

        kubectl exec -n nublenews $POD_NAME -- cat /etc/hosts

        ```

        *(Verification: Events appeared in Terminal 2)*


--- 
-----

## 7\. Zero Trust Network Enforcement (L3, L4, & L7)

**Goal:** Demonstrate the security risk of **Default Accept**, and then enforce network Least Privilege using L3, L4, and L7 policies.

### A. Demonstrate Security Risk (Default Accept)

1.  **Deploy Attacker Pod (using `nicolaka/netshoot` for DNS reliability):**
    ```powershell
    # Apply attacker.yaml
    kubectl apply -f manifests/attacker.yaml
    kubectl wait --for=condition=Ready pod/attacker -n nublenews --timeout=30s
    ```
2.  **Verify successful attack (Default Accept):**
      * *Debugging Note:* The backend service port was found to be **3001**, not 8080. The backend pod IP was found to be `10.244.0.162`.
    <!-- end list -->
    ```powershell
    # Prove the connection is open
    kubectl exec -n nublenews attacker -- nc -v -w 3 10.244.0.162 3001
    # Prove data can be exfiltrated
    kubectl exec -n nublenews attacker -- curl 10.244.0.162:3001
    # Result: SUCCESS (Vulnerability Confirmed)
    ```

### B. Enforce Zero Trust (L3/L4/L7 Ingress)

  * **Policy:** `allow-l7-ingress.yaml` (CiliumNetworkPolicy)

    ```yaml
    # allow-l7-ingress.yaml (Enforces L3, L4, and L7)
    apiVersion: "cilium.io/v2"
    kind: CiliumNetworkPolicy
    metadata:
      name: allow-l7-frontend-to-backend
      namespace: nublenews
    spec:
      endpointSelector:
        matchLabels:
          app: backend
      ingress:
        - fromEndpoints:
            - matchLabels:
                app: frontend
          toPorts:
            - ports:
                - port: "3001"
                  protocol: TCP
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
    # Re-running the attack now fails (hangs/timeouts) because the attacker
    # pod's label ('app: attacker') is not whitelisted.
    kubectl exec -n nublenews attacker -- curl 10.244.0.162:3001
    # Result: FAIL (Zero Trust L3/L4 Enforcement Confirmed)
    ```

### C. Final Network Posture

  * **Ingress (Inbound):** Fully secured with L3, L4, and L7 policies. Only the `frontend` can talk to the `backend` on TCP port 3001, and only for `GET /news` requests.

-----

## 8\. Conclusion and Next Steps (Optional)

You have achieved the core objectives of this project: setting up the Zero Trust platform and enforcing a multi-layered policy between critical application components.

### Final Verification

  * Check the frontend at: `http://localhost:30080` (Still works\!)

### Completed Zero Trust Layers

  * **Network Segmentation (Ingress):** Complete (L3/L4/L7)
  * **Security Visibility:** Complete (`tetra` working)

### Further Zero Trust Steps (Outside Core Project Scope)

  * **Network Egress Lockdown:** Apply a policy to block all outbound traffic from the `nublenews` namespace except for DNS to CoreDNS (`kube-system`).
  * **Runtime Enforcement:** Create a Tetragon `TracingPolicy` to block unexpected binaries (like `/bin/bash` or `nc`) from executing inside the `frontend` or `backend` containers (using the kernel-level control you already established).
