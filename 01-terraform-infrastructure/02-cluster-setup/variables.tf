variable "environment" {
  description = "Environment name, can be dev or prod"
  type        = string
  validation {
    condition     = contains(["prod", "dev"], var.environment) # conains is a terrafomr function (see more about functions in the docs)
    error_message = "Valid values for environment are only 'dev' or 'prod"
  }
}


variable "namespace" {
  type        = string
  description = "Namespace to deploy to"
}

variable "githubtoken" {
  type        = string
  description = "token to access private github repositories"
  sensitive = true

} 
variable "githubusername" {
  type        = string
  description = "github username"
} 
