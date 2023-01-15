# book-shop



# Provisionning the AKS cluster 
* `cd 01-cluster-provisionning`
* `terraform init`
* `terraform output -raw kube_config > ~/.kube/config ` :  save the kube config certificate needed to authenticate to the cluster.
* `terraform apply`

* 