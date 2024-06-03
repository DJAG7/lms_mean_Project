variable "region" {
  description = "The AWS region to deploy in"
  default     = "ap-south-1"
}

variable "cluster_name" {
  description = "The name of the EKS cluster"
  default     = "lms_cluster"
}

variable "cluster_version" {
  description = "The version of the EKS cluster"
  default     = "1.23"
}

variable "environment" {
  description = "Environment name"
  default     = "development"
}

variable "project" {
  description = "Project name"
  default     = "lms"
}

variable "main_ami" {
  description = "AMI ID for the main instances"
  default     = "ami-0c55b159cbfafe1f0"  # Replace with your desired AMI ID
}

variable "grafana_instance_type" {
  description = "EC2 instance Grafana"
  default     = "t2.micro"
}

variable "prometheus_instance_type" {
  description = "EC2 instance Prometheus"
  default     = "t2.micro"
}

variable "grafana_ami" {
  description = "AMI ID for the Grafana server"
  default     = "ami-0c55b159cbfafe1f0"  # Replace with your desired AMI ID
}

variable "prometheus_ami" {
  description = "AMI ID for the Prometheus server"
  default     = "ami-0c55b159cbfafe1f0"  # Replace with your desired AMI ID
}

