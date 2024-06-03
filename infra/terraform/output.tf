output "vpc_id" {
  description = "The ID of the VPC"
  value       = aws_vpc.lms_cluster.id
}

output "public_subnet_id" {
  description = "The ID of the public subnet"
  value       = aws_subnet.public.id
}

output "private_subnet_id" {
  description = "The ID of the private subnet"
  value       = aws_subnet.private.id
}

output "eks_cluster_id" {
  description = "The ID of the EKS cluster"
  value       = aws_eks_cluster.eks_cluster.id
}

output "eks_cluster_endpoint" {
  description = "The endpoint of the EKS cluster"
  value       = aws_eks_cluster.eks_cluster.endpoint
}

output "grafana_public_ip" {
  description = "The public IP of the Grafana instance"
  value       = aws_instance.grafana.public_ip
}

output "prometheus_public_ip" {
  description = "The public IP of the Prometheus instance"
  value       = aws_instance.prometheus.public_ip
}

output "grafana_security_group_id" {
  description = "The ID of the Grafana security group"
  value       = aws_security_group.grafana_lms_security_group.id
}

output "prometheus_security_group_id" {
  description = "The ID of the Prometheus security group"
  value       = aws_security_group.prometheus_lms_security_group.id
}
