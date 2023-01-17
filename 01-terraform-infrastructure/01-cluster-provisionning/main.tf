
resource "azurerm_resource_group" "book_shop_group" {
  name     = "book-shop-group"
  location = "West Europe"
}

resource "azurerm_kubernetes_cluster" "book_shop" {
  name                = "book-shop-aks"
  location            = azurerm_resource_group.book_shop_group.location
  resource_group_name = azurerm_resource_group.book_shop_group.name
  dns_prefix          = "bookshopaks1"
  sku_tier            = "Free"

  default_node_pool {
    name       = "default"
    node_count = 1
    vm_size    = "Standard_D2_v2"
  }

  identity {
    type = "SystemAssigned"
  }

  tags = {
    Environment = "Development"
  }
}

