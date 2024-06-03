provider "aws" {
  region = var.region
}

# Create VPC
resource "aws_vpc" "lms_cluster" {
  cidr_block = "10.0.0.0/16"
  tags = {
    Name = "lms_cluster"
  }
}

# Create Public Subnet
resource "aws_subnet" "public" {
  vpc_id                  = aws_vpc.lms_cluster.id
  cidr_block              = "10.0.1.0/24"
  map_public_ip_on_launch = true
  availability_zone       = "ap-south-1a"
  tags = {
    Name = "public-subnet"
  }
}

# Create Internet Gateway
resource "aws_internet_gateway" "lms_cluster_gw" {
  vpc_id = aws_vpc.lms_cluster.id
  tags = {
    Name = "lms_cluster-gw"
  }
}

# Create Route Table
resource "aws_route_table" "public" {
  vpc_id = aws_vpc.lms_cluster.id

  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.lms_cluster_gw.id
  }
  tags = {
    Name = "public-route-table"
  }
}

# Associate Route Table with Public Subnet
resource "aws_route_table_association" "public_subnet" {
  subnet_id      = aws_subnet.public.id
  route_table_id = aws_route_table.public.id
}

# Create EKS Cluster
resource "aws_eks_cluster" "eks_cluster" {
  name     = var.cluster_name
  role_arn = aws_iam_role.eks_cluster_role.arn
  version  = var.cluster_version

  vpc_config {
    subnet_ids = [aws_subnet.public.id]
  }

  tags = {
    Environment = var.environment
    Project     = var.project
  }
}

# IAM Role for EKS Cluster
resource "aws_iam_role" "eks_cluster_role" {
  name               = "eks_cluster_role"
  assume_role_policy = data.aws_iam_policy_document.eks_cluster_policy.json
}

# Policy for EKS Cluster IAM Role
data "aws_iam_policy_document" "eks_cluster_policy" {
  statement {
    actions = ["sts:AssumeRole"]

    principals {
      type        = "Service"
      identifiers = ["eks.amazonaws.com"]
    }
  }
}

# Attach AmazonEKSWorkerNodePolicy to EKS Cluster IAM Role
resource "aws_iam_role_policy_attachment" "eks_worker_node_policy_attachment" {
  role       = aws_iam_role.eks_cluster_role.name
  policy_arn = "arn:aws:iam::aws:policy/AmazonEKSWorkerNodePolicy"
}

# Attach AmazonEKSClusterPolicy to EKS Cluster IAM Role
resource "aws_iam_role_policy_attachment" "eks_cluster_policy_attachment" {
  role       = aws_iam_role.eks_cluster_role.name
  policy_arn = "arn:aws:iam::aws:policy/AmazonEKSClusterPolicy"
}

# Create Launch Template for ASG
resource "aws_launch_template" "main" {
  name_prefix   = "main-launch-template-"
  image_id      = var.main_ami
  instance_type = var.main_instance_type

  network_interfaces {
    associate_public_ip_address = true
    subnet_id                   = aws_subnet.public.id
  }

  tag_specifications {
    resource_type = "instance"
    tags = {
      Name = "main-instance"
    }
  }

  user_data = <<-EOF
              #!/bin/bash
              # Add your user data script here
              EOF
}

# AutoScaling Group
resource "aws_autoscaling_group" "main" {
  desired_capacity     = 1
  max_size             = 3
  min_size             = 1
  vpc_zone_identifier  = [aws_subnet.public.id]
  launch_template {
    id      = aws_launch_template.main.id
    version = "$Latest"
  }

  tag {
    key                 = "Name"
    value               = "main-instance"
    propagate_at_launch = true
  }

  lifecycle {
    create_before_destroy = true
  }
}

# Check for existing security group for Prometheus
data "aws_security_group" "prometheus_lms_security_group" {
  filter {
    name   = "group-name"
    values = ["prometheus_lms_security_group"]
  }
}

resource "aws_security_group" "prometheus_lms_security_group" {
  count = length(data.aws_security_group.prometheus_lms_security_group.id) == 0 ? 1 : 0
  vpc_id = aws_vpc.lms_cluster.id

  ingress {
    from_port   = 9090
    to_port     = 9090
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "prometheus_lms_security_group"
  }
}

# Check for existing security group for Grafana
data "aws_security_group" "grafana_lms_security_group" {
  filter {
    name   = "group-name"
    values = ["grafana_lms_security_group"]
  }
}

resource "aws_security_group" "grafana_lms_security_group" {
  count = length(data.aws_security_group.grafana_lms_security_group.id) == 0 ? 1 : 0
  vpc_id = aws_vpc.lms_cluster.id

  ingress {
    from_port   = 3000
    to_port     = 3000
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "grafana_lms_security_group"
  }
}

# EC2 instance for Prometheus
resource "aws_instance" "prometheus" {
  ami           = var.prometheus_ami
  instance_type = var.prometheus_instance_type
  subnet_id     = aws_subnet.public.id
  security_groups = length(data.aws_security_group.prometheus_lms_security_group.ids) > 0 
  ? [data.aws_security_group.prometheus_lms_security_group.ids[0]]
  : [aws_security_group.prometheus_lms_security_group.id]

  user_data = <<-EOF
              #!/bin/bash
              sudo yum update -y
              sudo yum install -y wget
              wget https://github.com/prometheus/prometheus/releases/download/v2.26.0/prometheus-2.26.0.linux-amd64.tar.gz
              tar xvf prometheus-2.26.0.linux-amd64.tar.gz
              cd prometheus-2.26.0.linux-amd64
              ./prometheus --config.file=prometheus.yml &
              EOF

  tags = {
    Name = "Prometheus"
  }
}

# EC2 instance for Grafana
resource "aws_instance" "grafana" {
  ami           = var.grafana_ami
  instance_type = var.grafana_instance_type
  subnet_id     = aws_subnet.public.id
  security_groups = length(data.aws_security_group.grafana_lms_security_group.ids) > 0 
  ? [data.aws_security_group.grafana_lms_security_group.ids[0]]
  : [aws_security_group.grafana_lms_security_group.id]

  user_data = <<-EOF
              #!/bin/bash
              sudo yum update -y
              sudo yum install -y wget
              wget https://dl.grafana.com/oss/release/grafana-7.5.1-1.x86_64.rpm
              sudo yum localinstall grafana-7.5.1-1.x86_64.rpm -y
              sudo systemctl start grafana-server
              sudo systemctl enable grafana-server
              EOF

  tags = {
    Name = "Grafana"
  }
}
