output "kube_config" {
  value = azurerm_kubernetes_cluster.book_shop.kube_config

  sensitive = true
}


output "kube_config_raw" {
  value = azurerm_kubernetes_cluster.book_shop.kube_config_raw

  sensitive = true
}

