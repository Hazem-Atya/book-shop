terraform {
  required_version = "~>1.3.6"
  required_providers {
    azurerm = {
      # issuer of the provider 
      source  = "hashicorp/azurerm"
      version = "~>3.37.0"
    }
  }

  backend "azurerm" {
    resource_group_name  = "hazem-sensitive-data"
    storage_account_name = "hazemaccount"
    container_name       = "infra-state"
    key                  = "cluster-provisionning-stack.json"
  }
}
provider "azurerm" {
  features {}
}
