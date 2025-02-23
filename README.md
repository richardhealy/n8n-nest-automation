
```
docker compose --env-file .env.docker build --no-cache && docker compose --env-file .env.docker up -d
```
TODO
Infrastructure
- Complete Kubernetes configurations
  - Add resource limits
  - Configure auto-scaling
  - Set up health checks
- Set up monitoring and logging
  - Add Prometheus metrics
  - Configure ELK stack
- Implement backup strategy
- Add CI/CD pipeline


