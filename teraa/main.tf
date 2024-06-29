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

provider "aws" {
  region = "ap-south-1"  # Replace with your desired AWS region
}

# Fetch the availability zones
data "aws_availability_zones" "available" {}

locals {
  availability_zones = data.aws_availability_zones.available.names
}

# Use existing IAM roles for EKS Cluster and Node Group
data "aws_iam_role" "eks_cluster_role" {
  name = "eks-cluster-role"
}

data "aws_iam_role" "eks_node_group_role" {
  name = "eks-node-group-role"
}

# Attach the required IAM policies to the EKS role
resource "aws_iam_role_policy_attachment" "eks_cluster_AmazonEKSClusterPolicy" {
  policy_arn = "arn:aws:iam::aws:policy/AmazonEKSClusterPolicy"
  role       = data.aws_iam_role.eks_cluster_role.name
}

resource "aws_iam_role_policy_attachment" "eks_cluster_AmazonEKSServicePolicy" {
  policy_arn = "arn:aws:iam::aws:policy/AmazonEKSServicePolicy"
  role       = data.aws_iam_role.eks_cluster_role.name
}

# Create the VPC
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

# Create the EKS cluster
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

# Attach required IAM policies to the Node Group Role
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

# Create the EKS Node Group
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

output "cluster_endpoint" {
  description = "EKS cluster endpoint"
  value       = aws_eks_cluster.eks.endpoint
}

output "cluster_security_group_id" {
  description = "Security group ID of the EKS cluster"
  value       = aws_eks_cluster.eks.vpc_config[0].cluster_security_group_id
}
