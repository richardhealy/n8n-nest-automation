resource "cloudflare_record" "api" {
  zone_id = var.cloudflare_zone_id
  name    = "api"
  value   = module.eks.cluster_endpoint
  type    = "CNAME"
  proxied = true
}

resource "cloudflare_record" "n8n" {
  zone_id = var.cloudflare_zone_id
  name    = "n8n"
  value   = module.eks.cluster_endpoint
  type    = "CNAME"
  proxied = true
} 