terraform {
  required_version = "~>1.3.6"
  required_providers {
    azurerm = {
      # issuer of the provider 
      source  = "hashicorp/azurerm"
      version = "~>3.37.0"
    }
    kubernetes = {
      source  = "hashicorp/kubernetes"
      version = "~>2.16.1"
    }
    # helm = {
    #   source  = "hashicorp/helm"
    #   version = "~>2.8.0"
    # }
  }
}
provider "azurerm" {
  features {}
}
