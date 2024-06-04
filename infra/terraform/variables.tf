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