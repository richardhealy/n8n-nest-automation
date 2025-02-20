module "rds" {
  source  = "terraform-aws-modules/rds/aws"
  version = "~> 5.0"

  identifier = "n8n-platform-db"

  engine               = "postgres"
  engine_version      = "14"
  instance_class      = "db.t3.medium"
  allocated_storage   = 20

  db_name  = "n8n_platform"
  username = "n8n_admin"
  port     = "5432"

  vpc_security_group_ids = [aws_security_group.rds.id]
  subnet_ids             = module.vpc.database_subnets

  backup_retention_period = 7
  multi_az               = true
} 