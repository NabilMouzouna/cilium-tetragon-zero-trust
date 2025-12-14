## 🛡️ Zero Trust Kubernetes (0trust-4-k8s) - Setup Guide

This guide details the steps to set up a local Kubernetes cluster using KIND, install the Cilium CNI, and enforce a Zero Trust network and runtime security posture using Cilium and Tetragon.

-----

## 1\. Setup WSL2 and Docker

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

## 2. Install Kubernetes CLI and Tools (kubectl, KIND, Helm)
* Installed `kubectl`:
  ```powershell
  winget install Kubernetes.kubectl
  ```
* Installed `KIND`:
  ```powershell
  winget install Kubernetes.kind
  ```
* Installed `Helm` (Required for Cilium/Tetragon):
  ```powershell
  winget install Helm.Helm
  ```
* Restarted terminal to refresh PATH.

---

## 3. Build Docker Images Locally
* Backend image:
  ```powershell
  docker build -t nublenews-backend:dev ./apps/backend
  ```
* Frontend image:
  ```powershell
  docker build -t nublenews-frontend:dev ./apps/frontend
  ```

---

## 4. Create KIND Cluster and Install Cilium CNI

* **Recreate `kind-config.yaml` to disable default CNI:**

  ```yaml
  kind: Cluster
  apiVersion: kind.x-k8s.io/v1alpha4
  nodes:
    - role: control-plane
      extraPortMappings:
        - containerPort: 30080
          hostPort: 30080
          protocol: TCP
  networking:
    disableDefaultCNI: true # CRITICAL for CNI installation
  ```
* Deleted existing cluster:
  ```powershell
  kind delete cluster --name zero-trust-k8s
  ```
* Created new cluster with config:
  ```powershell
  kind create cluster --name zero-trust-k8s --config kind-config.yaml
  ```

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

---

## 5. Load Docker Images and Deploy Application

* Load images:
  ```powershell
  kind load docker-image nublenews-backend:dev --name zero-trust-k8s
  kind load docker-image nublenews-frontend:dev --name zero-trust-k8s
  ```

* Deploy Application Manifests (Current Network Posture: Default Accept)

  ```powershell
  kubectl apply -f manifests/namespace.yaml
  kubectl apply -f manifests/backend.yaml
  kubectl apply -f manifests/frontend.yaml
  ```

---

## 6. Install Cilium Tetragon for Runtime Visibility

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

## 7. Final Verification (Current Status)
* **Application Access:** The application is running and accessible: `http://localhost:30080`
* **Network Posture:** Default Accept (Network is currently unsecured).

---

## Next Step: Enforce Network Zero Trust

The next step is to lock down the network by applying policies that enforce Least Privilege, as the current environment is wide open.

**We will apply the Network Policies now.**