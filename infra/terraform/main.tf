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

# Create Private Subnet
resource "aws_subnet" "private" {
  vpc_id            = aws_vpc.lms_cluster.id
  cidr_block        = "10.0.2.0/24"
  availability_zone = "ap-south-1b"
  tags = {
    Name = "private-subnet"
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
    subnet_ids = [
      aws_subnet.public.id,
      aws_subnet.private.id
    ]
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

# Define AWS Security Group
resource "aws_security_group" "main" {
  name        = "main-security-group"
  vpc_id      = aws_vpc.lms_cluster.id

  // Define your security group rules here
  // For example:
  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

# Create Application Load Balancer (ALB)
resource "aws_lb" "main" {
  name               = "main-alb"
  internal           = false
  load_balancer_type = "application"
  subnets            = [aws_subnet.public.id]
  security_groups    = [aws_security_group.main.id]  # Reference the security group defined above

  // Define other ALB configurations here
}

# ALB Listener Configuration
resource "aws_lb_listener" "http" {
  load_balancer_arn = aws_lb.main.arn
  port              = 80
  protocol          = "HTTP"

  default_action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.main.arn
  }
}


# Define Launch Template
resource "aws_launch_template" "main" {
  name_prefix   = "main-launch-template-"
  image_id      = var.main_ami
  instance_type = "t2.micro"

  // Define other configurations as needed
}

# AutoScaling Group
resource "aws_autoscaling_group" "main" {
  desired_capacity    = 1
  max_size            = 3
  min_size            = 1
  vpc_zone_identifier = [aws_subnet.public.id]

  launch_template {
    id      = aws_launch_template.main.id
    version = "$Latest"
  }

  // Attach the ALB to the ASG
  target_group_arns = [aws_lb_target_group.main.arn]

  // Define other configurations for the ASG
}

# Define Target Group for ALB
resource "aws_lb_target_group" "main" {
  name     = "main-target-group"
  port     = 80
  protocol = "HTTP"
  vpc_id   = aws_vpc.lms_cluster.id

  // Define health check settings and other configurations as needed
}


# IAM Role for Prometheus
resource "aws_iam_role" "prometheus_role" {
  name = "prometheus_role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Principal = {
          Service = "ec2.amazonaws.com"
        }
        Action = "sts:AssumeRole"
      }
    ]
  })
}

# Attach EC2 Read-Only Policy to Prometheus Role
resource "aws_iam_role_policy_attachment" "prometheus_ec2_readonly_policy" {
  role       = aws_iam_role.prometheus_role.name
  policy_arn = "arn:aws:iam::aws:policy/AmazonEC2ReadOnlyAccess"
}

# Create Instance Profile for Prometheus
resource "aws_iam_instance_profile" "prometheus_instance_profile" {
  name = "prometheus_instance_profile"
  role = aws_iam_role.prometheus_role.name
}

# Security Group for Prometheus
resource "aws_security_group" "prometheus_lms_security_group" {
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

# Security Group for Grafana
resource "aws_security_group" "grafana_lms_security_group" {
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

# Prometheus Instance
resource "aws_instance" "prometheus" {
  ami                         = var.prometheus_ami
  instance_type               = var.prometheus_instance_type
  subnet_id                   = aws_subnet.public.id
  associate_public_ip_address = true
  iam_instance_profile        = aws_iam_instance_profile.prometheus_instance_profile.name
  security_groups             = [aws_security_group.prometheus_lms_security_group.id]

  user_data = <<-EOF
              #!/bin/bash
              sudo yum update -y
              sudo yum install -y wget git
              cd /tmp
              wget https://github.com/prometheus/prometheus/releases/download/v2.26.0/prometheus-2.26.0.linux-amd64.tar.gz
              tar xvf prometheus-2.26.0.linux-amd64.tar.gz
              cd prometheus-2.26.0.linux-amd64
              sudo mv prometheus /usr/local/bin/
              sudo mv promtool /usr/local/bin/
              sudo mkdir -p /etc/prometheus
              sudo git clone -b grafanapromdev https://github.com/ankuronlyme/lms_mean_project.git
              sudo mv lms_mean_project/grafanaprometheusfiles/prometheus.yml /etc/prometheus/prometheus.yml

              # Replace placeholders in prometheus.yml
              sudo sed -i 's/YOUR REGION/${var.region}/g' /etc/prometheus/prometheus.yml
              sudo sed -i 's/YOUR_PROMETHEUS_ROLE_ARN/${aws_iam_role.prometheus_role.arn}/g' /etc/prometheus/prometheus.yml
              
              sudo /usr/local/bin/prometheus --config.file=/etc/prometheus/prometheus.yml &
              EOF

  tags = {
    Name = "Prometheus"
  }
}

# Grafana Instance
resource "aws_instance" "grafana" {
  ami                         = var.grafana_ami
  instance_type               = var.grafana_instance_type
  subnet_id                   = aws_subnet.public.id
  associate_public_ip_address = true
  security_groups             = [aws_security_group.grafana_lms_security_group.id]

  user_data = <<-EOF
              #!/bin/bash
              sudo yum update -y
              sudo yum install -y wget
              cd /tmp
              wget https://dl.grafana.com/oss/release/grafana-7.4.0-1.x86_64.rpm
              sudo yum localinstall grafana-7.4.0-1.x86_64.rpm -y
              sudo service grafana-server start
              EOF

  tags = {
    Name = "Grafana"
  }
}

