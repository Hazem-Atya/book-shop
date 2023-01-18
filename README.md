
# Introduction and context
### What is this?
A book shop app built for my end of semester project of the DevOps minor.
This project aims to impement observability, automation and deployment principles using several technologies and microservices architecture.
### Technologies
* Languages and frameworks: NodeJs and express.
* Database: Atlas MongoDB
* Terraform 
* Kubernetes 
* Logging and tracing: Datadog 
* Metrics: Promtheus

# Project tree
```yaml
📦 
├─ .github
│  └─ workflows
│     └─ docker-hub.yaml        # worflow for building the docker images and pushing to docker hub
├─ .gitignore
├─ 01-terraform-infrastructure
│  ├─ 01-cluster-provisionning/   # First stack: terraform project for cluster creation
│  └─ 02-cluster-setup/          # Second stack: terraform project for cluster setup (creating namepsaces and installing several helm charts)
│     ├─ argocd-app-charts/      #  the helm charts for the argocd apps
├─ 02-charts # different helm charts for installing the deployments of our services
│  ├─ api-gateway-service
│  ├─ books-service
│  ├─ customers-service
│  └─ orders-service
├─ README.md
├─ api-gateway
├─ books
├─ customers
└─ orders

```
# Setup
## Requirements:
 * Terraform CLI 
 * kubectl: Kubernetes command line tool
 * Azure account
## Setup 

### First stack: provisionning an AKS cluster
* `cd 01-terraform-infrastructure/01-cluster-provisionning`
* `terraform init`
* `terraform apply`

### Setting up the cluster
* `cd 01-terraform-infrastructure/02-cluster-setup`
* `terraform init`
* `terraform apply`
The second stack will create the needed namespaces and install argocd, datadog, prometheus, it will also create the argocd applications for our 4 services.

# Project architecture 
![archi_devops (1)](https://user-images.githubusercontent.com/53778545/213315195-ad28eccf-01fc-4854-a3c0-23b43cf69320.jpg)


# Deployment and CI/CD
* Build using github actions, create docker images and pushing to docker hub.
* Deploy using argocd.
![image](https://user-images.githubusercontent.com/53778545/212965929-57d5fa73-7205-47b4-ad6a-181f91ea6f14.png)


# Observability
* logging using datadog
* ![image](https://user-images.githubusercontent.com/53778545/212966766-3db2123b-123b-4553-b20e-a8937801e051.png)

* traces with open telemetry and datadog
* metrics with prometheus (tracking number of requests and business metrics (new customers))
![image](https://user-images.githubusercontent.com/53778545/212967743-7d30b221-b0d7-4ad1-8f94-79adb24e2f03.png)





