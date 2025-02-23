FROM node:20-alpine as development

WORKDIR /app

# Install pnpm with npm instead
RUN npm install -g pnpm@8.15.3

# Copy workspace files
COPY pnpm-workspace.yaml pnpm-lock.yaml package.json ./

# Copy the frontend package
COPY packages/frontend packages/frontend/

# Install dependencies
RUN pnpm install

# Change to frontend directory
WORKDIR /app/packages/frontend

# Start development server
CMD ["pnpm", "dev"] 