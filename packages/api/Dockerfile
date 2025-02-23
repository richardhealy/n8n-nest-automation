FROM node:20-alpine as development

WORKDIR /app

# Install pnpm with npm instead
RUN npm install -g pnpm@8.15.3

# Copy workspace files
COPY pnpm-workspace.yaml pnpm-lock.yaml package.json ./

# Copy the api package
COPY packages/api packages/api/

# Install dependencies
RUN pnpm install

# Change to api directory and run build
WORKDIR /app/packages/api

# Generate Prisma client
RUN pnpm prisma generate

CMD ["pnpm", "dev"] 