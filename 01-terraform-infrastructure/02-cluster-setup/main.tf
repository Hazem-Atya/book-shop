
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
    name = var.namespace
  }
}



resource "helm_release" "argo" {

  name       = "argo-cd"
  repository = "https://argoproj.github.io/argo-helm"
  chart      = "argo-cd"
  namespace  = kubernetes_namespace.example.id
}


resource "helm_release" "argocd_apps" {
  name       = "argo-cd-apps"
  chart      = "./argocd-app-charts"
  set {
    name= "gitrepo.password"
    value = var.githubtoken
  }
  set {
    name= "gitrepo.username"
    value = var.githubusername
  }
}