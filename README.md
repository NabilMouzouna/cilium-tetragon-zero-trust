````markdown
# Zero Trust Kubernetes (0trust-4-k8s) - Setup Guide

## Prerequisites
- Windows 10/11 with WSL2 enabled
- Docker Desktop installed with WSL2 backend
- PowerShell or Windows Terminal

---

## 1. Setup WSL2 and Docker
- Installed WSL2 with Ubuntu:
  ```bash
  wsl --install
````

* Verified WSL2 installation:

  ```bash
  wsl -l -v
  ```
* Installed Docker Desktop, verified with:

  ```bash
  docker run hello-world
  ```

---

## 2. Build Docker Images Locally

* Backend image:

  ```bash
  docker build -t nublenews-backend:dev ./backend
  ```
* Frontend image:

  ```bash
  docker build -t nublenews-frontend:dev ./frontend
  ```

---

## 3. Install Kubernetes CLI and KIND

* Installed kubectl:

  ```powershell
  winget install Kubernetes.kubectl
  ```
* Installed KIND:

  ```powershell
  winget install Kubernetes.kind
  ```
* Restarted terminal to refresh PATH.

---

## 4. Create KIND Cluster with Port Mapping

* Created `kind-config.yaml`:

  ```yaml
  kind: Cluster
  apiVersion: kind.x-k8s.io/v1alpha4
  nodes:
    - role: control-plane
      extraPortMappings:
        - containerPort: 30080
          hostPort: 30080
          protocol: TCP
  ```
* Deleted existing cluster:

  ```powershell
  kind delete cluster --name zero-trust-k8s
  ```
* Created new cluster with config:

  ```powershell
  kind create cluster --name zero-trust-k8s --config kind-config.yaml
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

## 6. Deploy Kubernetes Manifests

* Apply namespace:

  ```bash
  kubectl apply -f namespace.yaml
  ```
* Apply backend deployment and service:

  ```bash
  kubectl apply -f backend.yaml
  ```
* Apply frontend deployment and service:

  ```bash
  kubectl apply -f frontend.yaml
  ```

---

## 7. Verify Deployment

* Check nodes and pods:

  ```bash
  kubectl get nodes
  kubectl get pods -n nublenews
  ```
* Access frontend at:

  ```
  http://localhost:30080
  ```

---

## Notes

* NodePort 30080 was exposed by explicit port mapping in KIND config.
* This setup runs Kubernetes cluster inside Docker containers on Windows.
* Next steps: install Cilium CNI and configure zero-trust policies.
