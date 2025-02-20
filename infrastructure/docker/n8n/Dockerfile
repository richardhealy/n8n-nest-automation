FROM n8nio/n8n:latest

# Install additional dependencies if needed
USER root
RUN apt-get update && \
    apt-get install -y \
    postgresql-client

# Copy custom configurations
COPY configs/custom-nodes.json /home/node/.n8n/
COPY configs/workflow-templates /home/node/.n8n/workflows

USER node 