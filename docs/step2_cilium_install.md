# Step 2: Install Cilium on Your Kubernetes Cluster

In this step, you will install Cilium, a powerful networking, observability, and security layer for Kubernetes, on your cluster. Cilium uses eBPF to provide high-performance networking and security policies.

## Prerequisites

- A running Kubernetes cluster set up as per Step 1.
- `kubectl` configured to interact with your cluster.
- `helm` installed on your local machine.

## Step 2.1: Add the Cilium Helm Repository

First, add the official Cilium Helm repository to your Helm client:

```bash
helm repo add cilium https://helm.cilium.io/
helm repo update
```

## Step 2.2: Install Cilium CLI (Optional but Recommended)

The Cilium CLI helps manage and troubleshoot Cilium installations.

To install the Cilium CLI:

```bash
curl -L --remote-name-all https://github.com/cilium/cilium-cli/releases/latest/download/cilium-linux-amd64.tar.gz{,.sha256sum}
sha256sum --check cilium-linux-amd64.tar.gz.sha256sum
sudo tar xzvfC cilium-linux-amd64.tar.gz /usr/local/bin
rm cilium-linux-amd64.tar.gz{,.sha256sum}
```

For other platforms, refer to the [Cilium CLI installation guide](https://docs.cilium.io/en/stable/gettingstarted/cli/).

Verify installation:

```bash
cilium version
```

## Step 2.3: Install Cilium Using Helm

You can install Cilium using Helm with default settings or customize as needed.

Run the following command to install Cilium in the `kube-system` namespace:

```bash
helm install cilium cilium/cilium --namespace kube-system
```

If you want to customize the installation, for example, to enable Hubble (Cilium's observability platform), you can use:

```bash
helm install cilium cilium/cilium --namespace kube-system \
  --set hubble.enabled=true \
  --set hubble.metrics.enabled="{dns,drop,tcp,flow,port-distribution,icmp,http}"
```

## Step 2.4: Verify the Installation

Check that the Cilium pods are running:

```bash
kubectl -n kube-system get pods -l k8s-app=cilium
```

You should see all pods in the `Running` state.

You can also check the Cilium status using the CLI:

```bash
cilium status
```

## Step 2.5: Enable Hubble (Optional)

If you enabled Hubble during installation, you can port-forward the Hubble UI to your local machine:

```bash
kubectl port-forward -n kube-system svc/hubble-ui 12000:80
```

Then open your browser to `http://localhost:12000` to visualize network flows.

## Troubleshooting

- If Cilium pods are not starting, check their logs:

  ```bash
  kubectl -n kube-system logs -l k8s-app=cilium
  ```

- Ensure your Kubernetes nodes support eBPF by verifying the kernel version and configuration.

## Next Steps

With Cilium installed, your Kubernetes cluster now has advanced networking and security capabilities. Proceed to Step 3 to configure 0-Trust policies using Cilium.
