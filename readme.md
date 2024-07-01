

# Backend Setup

## Cloning the Repository into local system

## Install Dependencies

    command: npm install

## Configure Environment Variables

- Create a .env file in the root with the following variables:

    - PORT=3001
    - Mongo_URL=mongodb+srv://{username}:{password}@ankurcluster.h2znnvu.mongodb.net/{database}
    - GITHUB_CLIENT_SECRET=clientpassword

## Run Server

    command: node server.js


- Access the backend on http://localhost:3001.

![alt text](./screenshots/image-1.png)


## Docker Setup for Backend

```Dockerfile

FROM node:18
WORKDIR /app
COPY package.json .
RUN npm install
COPY . .
EXPOSE 3001
CMD ["node", "server.js"]

```

## Build and Push Docker Image

    command: docker build -t lms-backend:latest .
    command: docker tag lms-backend:latest ankuronlyme/capstone_backend:v1
    command: docker push ankuronlyme/capstone_backend:v1

![alt text](./screenshots/image-2.png)


## Run Docker Container

    command: docker run -dp 3001:3001 \-e "PORT=3001" \-e "MONGO_URL=mongodb+srv://TravelMemory:Travel@ankurcluster.h2znnvu.mongodb.net/Travel" \-e "GITHUB_CLIENT_SECRET=clientpassword" \ankuronlyme/capstone_backend:v1

![alt text](./screenshots/image-3.png)



# Frontend Setup

## Cloning the Repository into local system

## Install Angular CLI

    command: npm install -g @angular/cli

## Install Dependencies and Start Development Server

    command: npm install --force
             source ./modify_quill_editor.sh
             npm start

## Build Angular Application

    command: ng build --prod

 - Check the build output in the dist directory.

## Docker Setup for Frontend

```Dockerfile

# Use a Node.js image as the Build Stage
FROM node:18 AS build

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json and install dependencies
COPY package*.json ./

# Installation of all dependencies
RUN npm install --force
RUN npm install -g @angular/cli

# Install dos2unix to convert line endings
RUN apt-get update && apt-get install -y dos2unix

# Copy the script into the Docker image
COPY modify_quill_editor.sh .

# Convert line endings to Unix format to remove carriage return characters
RUN dos2unix modify_quill_editor.sh

# Make the script executable
RUN chmod +x modify_quill_editor.sh

# Execute the script
RUN ./modify_quill_editor.sh

# Copy the rest of the application code
COPY . .

# Build the Angular application
RUN npm run build --prod

# Use a lightweight web server to serve the frontend and deployment Process
FROM nginx:alpine

COPY --from=build /app/dist/lms-front-ang /usr/share/nginx/html

# Expose the port on which the frontend will run
EXPOSE 80

# Start the web server
CMD [ "nginx", "-g", "daemon off;" ]

```

    
## Build and Push Docker Image

    command: docker build -t lms-frontend:latest .
             docker tag lms-frontend:latest ankuronlyme/capstone_frontend:v1
             docker push ankuronlyme/capstone_frontend:v1

![alt text](./screenshots/image-4.png)

## Run Docker Container

    command: docker run -dp 4200:80 ankuronlyme/capstone_frontend:v1


## Compiler Setup

- Installation of Compiler

    •	wget https://github.com/judge0/judge0/releases/download/v1.13.0/judge0-v1.13.0.zip
    •	unzip judge0-v1.13.0.zip
    •	cd judge0-v1.13.0
    •	sudo docker-compose up -d db redis
    •	sleep 10s
    •	sudo docker-compose up -d
    •	sleep 5s

- Configuring server and nginx with certbot.

    •	sudo apt-get update -y
    •	curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg
    •	echo "deb [arch=amd64 signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
    •	sudo apt-get install apt-transport-https ca-certificates curl gnupg lsb-release -y
    •	sudo apt-get update -y
    •	sudo apt-get install docker-ce docker-ce-cli containerd.io -y
    •	sudo usermod -aG docker $USER
    •	sudo apt-get install docker-compose -y
    •	sudo apt-get install nginx -y
    •	sudo apt install snapd -y
    •	sudo snap install --classic certbot
    •	sudo ln -s /snap/bin/certbot /usr/bin/certbot
    •	sudo certbot --nginx
    •	sudo apt install unzip -y

- Compiler is succesfully setupin local machine.

![alt text](./screenshots/image-5.png)'


# After Setup of frontend, backend and compiler now start writing the kubenetes files for frontend, backned and compiler.
 - Write Kubernetes Manifests for Compiler:
    •	Configmap.yaml
    •	storageclass.yaml
    •	postgres-secret.yaml
    •	postgres-pv.yaml
    •	postgres-pvc.yaml
    •	judge0-db-deployment.yaml
    •	postgres-service.yaml
    •	redis-pv.yaml
    •	redis-pvc.yaml
    •	judge0-redis-deployment.yaml
    •	redis-service.yaml
    •	compiler_service.yaml
    •	judge0-server-deployment.yaml
    •	judge0-workers-deployment.yaml


 - Important configuration required in compiler for correct excution:

    - Compiler
        - postgres-secret.yaml file inside 

```yaml
  REDIS_PASSWORD: <YOUR_REDIS_PASSWORD>
  POSTGRES_PASSWORD: <YOUR_POSTGRES_PASSWORD>
```

 - Write Kubernetes Manifests for Backend:

        backend-secret.yaml
        backend_deployment.yaml
        backend_service.yaml

 - Important Configuration required in backend for excutation

       - In Backend need to setup secrets
           - backend-secret.yaml file need to add the below credentials
```yaml

    PORT: <YOUR_CONTAINER_PORT_NUMBER>
    JWT_TOKEN_SECRET: <YOUR_JWT_TOKEN>
    AWS_REGION: <YOUR_AWS_REGION>
    AWS_ACCESS_KEY_ID: <YOUR_AWS_ACCESS_KEY_ID>
    AWS_SECRET_ACCESS_KEY: <YOUR_AWS_SECRET_ACCESS_KEY>
    AWS_BUCKET_NAME: <YOUR_AWS_S3_BUCKET_NAME>
    GITHUB_CLIENT_ID: <YOUR_GIT_CLIENT_ID>
    GITHUB_CLIENT_SECRET: <YOUR_GIT_CLIENT_SECRET>

```
   - deployment.yaml file need to add below points
```yaml

    name: MONGO_URL
    value: "mongodb+srv://<USERNAME>:<PASSWORD>@sparrow.hcgs1ob.mongodb.net/<database>"
    name: COMPILER_URL
    value: "YOUR_COMPILER_URL"
```


 - Write Kubernetes Manifests for Frontend:

        frontend_deployment.yaml
        frontend_service.yaml


#  Write Terraform Files:

o	Install Terraform
o	Terraform Configuration:
•	Create file for Terraform configuration: main.tf to manage AWS resources.
Main.tf:

This file sets up your AWS infrastructure using Terraform. Here's what each part does:

- Terraform Configuration:
    - Providers and Terraform Block: Specifies required providers (random and aws) with versions and Terraform minimum version.

terraform {
  required_providers {
    random = {
      source  = "hashicorp/random"
      version = "3.1.0"  # Specify the version of random provider required
    }

    aws = {
      source  = "hashicorp/aws"
      version = ">= 2.0.0"
    }
  }

  required_version = ">= 1.1"
}

- AWS Provider Configuration: Configures the AWS provider with the specified region (ap-south-1).

    provider "aws" {
        region = "ap-south-1"  # Replace with your desired AWS region
    }

- Fetch Availability Zones: Fetches availability zones in the configured region.

    data "aws_availability_zones" "available" {}

- Local Variables: Stores availability zone names fetched from aws_availability_zones data source.

    locals {
        availability_zones = data.aws_availability_zones.available.names
    }

- IAM Roles: Fetches existing IAM roles (eks-cluster-role and eks-node-group-role) for EKS.

    data "aws_iam_role" "eks_cluster_role" {
        name = "eks-cluster-role"
    }

    data "aws_iam_role" "eks_node_group_role" {
        name = "eks-node-group-role"
    }

- IAM Role Policy Attachments: Attaches required IAM policies 
(AmazonEKSClusterPolicy, AmazonEKSServicePolicy, AmazonEKSWorkerNodePolicy, AmazonEKS_CNI_Policy, AmazonEC2ContainerRegistryReadOnly) to their respective roles.

    resource "aws_iam_role_policy_attachment" "eks_cluster_AmazonEKSClusterPolicy" {
        policy_arn = "arn:aws:iam::aws:policy/AmazonEKSClusterPolicy"
        role       = data.aws_iam_role.eks_cluster_role.name
    }

    resource "aws_iam_role_policy_attachment" "eks_cluster_AmazonEKSServicePolicy" {
        policy_arn = "arn:aws:iam::aws:policy/AmazonEKSServicePolicy"
        role       = data.aws_iam_role.eks_cluster_role.name
    }

    resource "aws_iam_role_policy_attachment" "eks_node_AmazonEKSWorkerNodePolicy" {
        policy_arn = "arn:aws:iam::aws:policy/AmazonEKSWorkerNodePolicy"
        role       = data.aws_iam_role.eks_node_group_role.name
    }

    resource "aws_iam_role_policy_attachment" "eks_node_AmazonEKS_CNI_Policy" {
        policy_arn = "arn:aws:iam::aws:policy/AmazonEKS_CNI_Policy"
        role       = data.aws_iam_role.eks_node_group_role.name
    }

    resource "aws_iam_role_policy_attachment" "eks_node_AmazonEC2ContainerRegistryReadOnly" {
        policy_arn = "arn:aws:iam::aws:policy/AmazonEC2ContainerRegistryReadOnly"
        role       = data.aws_iam_role.eks_node_group_role.name
    }

- VPC and Subnets:
    •	Creates a VPC (eks-vpc) with CIDR block 10.0.0.0/16.
    •	Creates three public subnets (eks-public-subnet-${count.index}) across different availability zones.

    resource "aws_vpc" "main" {
        cidr_block = "10.0.0.0/16"

    tags = {
        Name = "eks-vpc"
     }
    }

    resource "aws_subnet" "public" {
        count = 3

        vpc_id     = aws_vpc.main.id
        cidr_block = cidrsubnet(aws_vpc.main.cidr_block, 8, count.index)
        availability_zone = element(local.availability_zones, count.index)
        map_public_ip_on_launch = true

    tags = {
        Name = "eks-public-subnet-${count.index}"
     }
    }

- Internet Gateway and Route Table:
    •	Creates an Internet Gateway (eks-gateway) and associates it with the VPC.
    •	Creates a public route table (eks-public-route-table) with a default route to the Internet Gateway.
    •	Associates each public subnet with the public route table.

    resource "aws_internet_gateway" "gw" {
        vpc_id = aws_vpc.main.id

        tags = {
        Name = "eks-gateway"
        }
    }

    resource "aws_route_table" "public" {
        vpc_id = aws_vpc.main.id

        route {
        cidr_block = "0.0.0.0/0"
        gateway_id = aws_internet_gateway.gw.id
    }

    tags = {
        Name = "eks-public-route-table"
     }
    }

    resource "aws_route_table_association" "public" {
        count          = length(aws_subnet.public[*].id)
        subnet_id      = element(aws_subnet.public[*].id, count.index)
        route_table_id = aws_route_table.public.id
    }

- EKS Cluster:
    •	Creates an EKS cluster (capstone_cluster) with the specified IAM role (eks-cluster-role) and VPC configuration.
    •	Depends on IAM policy attachments for the cluster role.

    resource "aws_eks_cluster" "eks" {
        name     = "capstone_cluster"
        role_arn = data.aws_iam_role.eks_cluster_role.arn

    vpc_config {
        subnet_ids = aws_subnet.public[*].id
    }

    depends_on = [
        aws_iam_role_policy_attachment.eks_cluster_AmazonEKSClusterPolicy,
        aws_iam_role_policy_attachment.eks_cluster_AmazonEKSServicePolicy,
     ]
    }


- EKS Node Group:
    •	Creates an EKS node group (lms-node-group) within the EKS cluster.
    •	Specifies node group configurations like instance types (t3a.large), disk size, and scaling settings (desired_size, max_size, min_size).
    •	Depends on IAM policy attachments for the node group role.


    resource "aws_eks_node_group" "node_group" {
        cluster_name    = aws_eks_cluster.eks.name
        node_group_name = "lms-node-group"
        node_role_arn   = data.aws_iam_role.eks_node_group_role.arn
        subnet_ids      = aws_subnet.public[*].id

    scaling_config {
        desired_size = 4
        max_size     = 7
        min_size     = 4
    }

    instance_types = ["t3a.large"]
        disk_size      = 60

    depends_on = [
        aws_iam_role_policy_attachment.eks_node_AmazonEKSWorkerNodePolicy,
        aws_iam_role_policy_attachment.eks_node_AmazonEKS_CNI_Policy,
        aws_iam_role_policy_attachment.eks_node_AmazonEC2ContainerRegistryReadOnly,
        ]   
    }

- Outputs:
    •	Provides outputs for the EKS cluster endpoint (cluster_endpoint) and security group ID (cluster_security_group_id).

    output "cluster_endpoint" {
        description = "EKS cluster endpoint"
        value       = aws_eks_cluster.eks.endpoint
    }

    output "cluster_security_group_id" {
        description = "Security group ID of the EKS cluster"
        value       = aws_eks_cluster.eks.vpc_config[0].cluster_security_group_id
    }

- After write the whole code time to excute the terraform code on local machine:

    command: terraform init

![alt text](./screenshots/image-6.png)


    command: terraform validate

![alt text](./screenshots/image-7.png)


    command: terraform plan

![alt text](./screenshots/image-8.png)


    command: terraform apply

![alt text](./screenshots/image-9.png)











































