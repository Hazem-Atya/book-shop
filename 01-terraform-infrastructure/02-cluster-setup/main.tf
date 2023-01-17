
data "terraform_remote_state" "aks-cluster" {
  backend = "azurerm"
  config = {
    resource_group_name  = "hazem-sensitive-data"
    storage_account_name = "hazemaccount"
    container_name       = "infra-state"
    key                  = "cluster-provisionning-stack.json"

  }
}




resource "kubernetes_namespace" "example" {
  metadata {
    labels = {
      environment = "var.environment"
    }
    name = var.argocd_namespace
  }
}

resource "kubernetes_namespace" "nginx_basic" {
  metadata {
    labels = {
      environment = "var.environment"
    }
    name = var.nginx_namespace
  }
}



resource "helm_release" "argo" {

  name       = "argo-cd"
  repository = "https://argoproj.github.io/argo-helm"
  chart      = "argo-cd"
  namespace  = kubernetes_namespace.example.id
}


resource "helm_release" "argocd_apps" {
  name  = "argo-cd-apps"
  chart = "./argocd-app-charts"
  set {
    name  = "gitrepo.password"
    value = var.githubtoken
  }
  set {
    name  = "gitrepo.username"
    value = var.githubusername
  }
}

resource "helm_release" "ingress-nginx" {
  name       = "argo-cd-apps"
  repository = "https://kubernetes.github.io/ingress-nginx"
  chart      = "ingress-nginx"
  namespace  = kubernetes_namespace.nginx_basic.id
  set {
    name  = "controller.service.annotations.service.beta.kubernetes.io/azure-load-balancer-health-probe-request-path"
    value = "/healthz"
  }
}

