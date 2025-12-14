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
* **New:** Installed `Helm` (Required for Cilium):

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
> *(Assuming your code directories are under `apps` based on your folder structure.)*

---

## 4. Create KIND Cluster and Install Cilium CNI

This step recreates the cluster to disable the default CNI, allowing Cilium to be installed.

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

## 5. Load Docker Images into KIND Cluster

* Load backend image:

  ```powershell
  kind load docker-image nublenews-backend:dev --name zero-trust-k8s
  ```
* Load frontend image:

  ```powershell
  kind load docker-image nublenews-frontend:dev --name zero-trust-k8s
  ```

---

## 6. Deploy Kubernetes Manifests and Zero Trust Policies

The application is deployed, and then a strict set of Network Policies is applied to enforce a default deny posture.

* Apply namespace:

  ```powershell
  kubectl apply -f manifests/namespace.yaml
  ```
* Apply backend deployment and service:

  ```powershell
  kubectl apply -f manifests/backend.yaml
  ```
* Apply frontend deployment and service:

  ```powershell
  kubectl apply -f manifests/frontend.yaml
  ```

### Enforce Zero Trust

* **Apply Default Deny Policy:** (File: `manifests/deny-all-policy.yaml`)
  ```powershell
  kubectl apply -f manifests/deny-all-policy.yaml
  ```

* **Apply Ingress Whitelist (Frontend -> Backend):** (File: `manifests/allow-app-ingress.yaml`)
  ```powershell
  kubectl apply -f manifests/allow-app-ingress.yaml
  ```

* **Apply Egress Whitelist (Allow DNS Lookups):** (File: `manifests/allow-dns-egress.yaml`)
  ```powershell
  kubectl apply -f manifests/allow-dns-egress.yaml
  ```

---

## 7. Final Verification

* Check nodes and pods:

  ```powershell
  kubectl get nodes
  kubectl get pods -n nublenews
  ```
* Access frontend at:

  ```
  http://localhost:30080
  ```

---

## Next Steps

* **Verify Flows with Hubble:** Install the Hubble CLI to observe and confirm that only the whitelisted traffic (Frontend to Backend, Pods to DNS) is permitted.
* **Tetragon Installation:** Install Cilium's companion security observability agent, Tetragon, for runtime enforcement and visibility.

Would you like to proceed with installing the **Hubble CLI** to confirm your Zero Trust policies are working as intended?