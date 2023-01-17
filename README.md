# book-shop

## Introduction and context
### What is this?
End of semester project of the DevOps minor.
This project aims to impement observability,automation and deployment principles using several technologies.
### Technologies
* NodeJs for development
* Terraform 
* Kubernetes 
* Datadog 


# Setup
## Requirements:
 * Terraform 
 * kubectl 
 * azure account
## Setup 

### First stack: provisionning an AKS cluster
* `cd 01-terraform-infrastructure/01-cluster-provisionning`
* `terraform init`
* `terraform apply`

### Setting up the cluster
* `cd 01-terraform-infrastructure/02-cluster-setup`
* `terraform init`
* `terraform apply`
The second stack will create the needed namespaces and install argocd, datadog, prometheus.

# Project architecture 
![Untitled Diagram (1)](https://user-images.githubusercontent.com/53778545/212965790-2a988703-b14c-4953-8131-f020b8955ba8.jpg)


# Automation
I used terraform with two stacks, the first stack for 


# Deployment and CI/CD
* Build using github actions
* Deploy using argocd
![image](https://user-images.githubusercontent.com/53778545/212965929-57d5fa73-7205-47b4-ad6a-181f91ea6f14.png)


# Observability
* logging using datadog
* ![image](https://user-images.githubusercontent.com/53778545/212966766-3db2123b-123b-4553-b20e-a8937801e051.png)

* traces with open telemetry and datadog
* metrics with prometheus (tracking number of requests and business metrics (new customers))
![image](https://user-images.githubusercontent.com/53778545/212967743-7d30b221-b0d7-4ad1-8f94-79adb24e2f03.png)




-------------------

* Argo CD creates a password and stores it as a secret in the cluster.
* To get the password: `kubectl -n argocd get secret argocd-initial-admin-secret -o jsonpath="{.data.password}" | base64 -d; echo`
* `$ kubectl port-forward -n argocd svc/argo-cd-argocd-server 7500:80`, then open `http://localhost:7500` in the browser.
* Login to using the `admin` for the username and the password fom the previous command.



