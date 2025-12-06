# Step 1: Cluster Setup Guide

This guide will walk you through the process of setting up a Kubernetes cluster suitable for deploying the 0-Trust for Kubernetes (0trust-4-k8s) solution.

## Prerequisites

- A minimum of one Linux machine (physical or virtual) with at least 2 CPUs and 4GB RAM.
- Ubuntu 20.04 LTS or later is recommended.
- Access to the internet for downloading necessary packages.
- Root or sudo privileges on the machine.

## Step 1: Update System Packages

First, update your package lists and upgrade installed packages to the latest versions:

```bash
sudo apt-get update && sudo apt-get upgrade -y
```

## Step 2: Disable Swap

Kubernetes requires swap to be disabled to function properly.

```bash
sudo swapoff -a
```

To permanently disable swap, edit the `/etc/fstab` file and comment out any swap entries:

```bash
sudo sed -i '/ swap / s/^\(.*\)$/#\1/g' /etc/fstab
```

## Step 3: Install Docker

Kubernetes needs a container runtime. Docker is a common choice.

1. Install Docker dependencies:

```bash
sudo apt-get install -y apt-transport-https ca-certificates curl software-properties-common
```

2. Add Docker’s official GPG key:

```bash
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -
```

3. Add Docker repository:

```bash
sudo add-apt-repository "deb [arch=amd64] https://download.docker.com/linux/ubuntu focal stable"
```

4. Install Docker Engine:

```bash
sudo apt-get update
sudo apt-get install -y docker-ce docker-ce-cli containerd.io
```

5. Start and enable Docker service:

```bash
sudo systemctl enable docker
sudo systemctl start docker
```

## Step 4: Install Kubernetes Components

Install `kubeadm`, `kubelet`, and `kubectl`.

1. Add Kubernetes apt repository:

```bash
curl -s https://packages.cloud.google.com/apt/doc/apt-key.gpg | sudo apt-key add -
sudo apt-add-repository "deb http://apt.kubernetes.io/ kubernetes-xenial main"
```

2. Install the components:

```bash
sudo apt-get update
sudo apt-get install -y kubelet kubeadm kubectl
sudo apt-mark hold kubelet kubeadm kubectl
```

## Step 5: Initialize the Kubernetes Cluster

Run the following command to initialize the cluster. Replace `<pod-network-cidr>` with the CIDR range for your pod network (e.g., `10.244.0.0/16` for Flannel or `10.244.0.0/16` for Cilium).

```bash
sudo kubeadm init --pod-network-cidr=10.244.0.0/16
```

After the initialization completes, configure your user to access the cluster:

```bash
mkdir -p $HOME/.kube
sudo cp -i /etc/kubernetes/admin.conf $HOME/.kube/config
sudo chown $(id -u):$(id -g) $HOME/.kube/config
```

## Step 6: Allow Scheduling Pods on the Master Node (Optional)

If you have a single-node cluster and want to schedule pods on the master node, run:

```bash
kubectl taint nodes --all node-role.kubernetes.io/master-
```

## Step 7: Verify the Cluster Status

Check that all components are running:

```bash
kubectl get nodes
kubectl get pods --all-namespaces
```

You should see your node in the `Ready` state.

---

You have successfully set up a Kubernetes cluster. Proceed to Step 2 to install Cilium as the CNI plugin.

# End of Step 1 Guide
