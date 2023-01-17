# book-shop



# Provisionning the AKS cluster 
* `cd 01-terraform-infrastructure/01-cluster-provisionning`
* `terraform init`
* `terraform output -raw kube_config_raw > ~/.kube/config ` :  save the kube config certificate needed to authenticate to the cluster.
* `terraform apply`


* Argo CD creates a passpord and stores it as a secret in the cluster.
* To get the password: `kubectl -n argocd get secret argocd-initial-admin-secret -o jsonpath="{.data.password}" | base64 -d; echo`
* Login to argocd using the `admin` for the username and the password fom the previous command.