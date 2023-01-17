
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




resource "helm_release" "ingress_nginx" {
  name       = "ingress-nginx"
  repository = "https://kubernetes.github.io/ingress-nginx"
  chart      = "ingress-nginx"
  namespace  = kubernetes_namespace.nginx_basic.id
  set {
    name  = "controller.service.annotations.service.beta.kubernetes.io/azure-load-balancer-health-probe-request-path"
    value = "/healthz"
  }
}


resource "helm_release" "prometheus" {
  name       = "book-shop-prometheus"
  repository = "https://prometheus-community.github.io/helm-charts"
  chart      = "prometheus"
}

resource "helm_release" "datadog" {
  name       = "book-shop-datadog"
  repository = "https://helm.datadoghq.com"
  chart      = "datadog"
  set {
    name  = "datadog.site"
    value = "datadoghq.com"
  }
  set {
    name  = "datadog.kubelet.tlsVerify"
    value = false
  }
  set {
    name  = "datadog.logs.enabled"
    value = true
  }
    set {
    name  = "datadog.logs.containerCollectAll"
    value = true
  }
    set {
    name  = "datadog.apiKey"
    value = "3a45549934797bcb8a647a4a9ff5324ad7a540b6"
  }
}


resource "helm_release" "argocd_apps" {
  depends_on = [
    helm_release.argo,
    helm_release.ingress_nginx,
    helm_release.prometheus,
    helm_release.datadog
  ]
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
