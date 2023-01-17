# book-shop



# Provisionning the AKS cluster 
* `cd 01-terraform-infrastructure/01-cluster-provisionning`
* `terraform init`
* `terraform apply`
* `terraform output -raw kube_config_raw > ~/.kube/config ` :  save the kube config certificate needed to authenticate to the cluster.


* Argo CD creates a passpord and stores it as a secret in the cluster.
* To get the password: `kubectl -n argocd get secret argocd-initial-admin-secret -o jsonpath="{.data.password}" | base64 -d; echo`
* `$ kubectl port-forward -n argocd svc/argo-cd-argocd-server 7500:80`, then open `http://localhost:7500` in the browser.
* Login to using the `admin` for the username and the password fom the previous command.



* argocd, ingress controller kolhom yetsabou mel terraform
* aamalt depends on fil terraform, fil block li yasna3 apps, lzm yetesna3 baad ingress controller w ba3d matetsab il argocd
* token taa repo hatitou variable fi terraform weli hya bid'ha tetaada ka value bch yasna3 beha secrets

### README STRUCTURE :
* introduction and context (7ot links lil projects lo5rin)
* Setup
* Project tree + explication ilkol folder
