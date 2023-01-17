terraform {
  required_providers {
    helm = {
      source  = "hashicorp/helm"
      version = "~>2.8.0"
    }
    kubernetes = {
      source  = "hashicorp/kubernetes"
      version = "~>2.16.1"
    }
  }
}



locals {
  kube_config =  data.terraform_remote_state.aks-cluster.outputs.kube_config.0
  host                   = local.kube_config.host
  username               = local.kube_config.username
  password               = local.kube_config.password
  client_certificate     = base64decode(local.kube_config.client_certificate)
  client_key             = base64decode(local.kube_config.client_key)
  cluster_ca_certificate = base64decode(local.kube_config.cluster_ca_certificate)
}

provider "kubernetes" {
  host                   = local.host
  username               = local.username
  password               = local.password
  client_certificate     = local.client_certificate
  client_key             = local.client_key
  cluster_ca_certificate = local.cluster_ca_certificate
}


provider "helm" {
  kubernetes {
    host                   = local.host
    username               = local.username
    password               = local.password
    client_certificate     = local.client_certificate
    client_key             = local.client_key
    cluster_ca_certificate = local.cluster_ca_certificate
  }
}
