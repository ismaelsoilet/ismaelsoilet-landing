# syntax=docker/dockerfile:1.7

# ── Build Stage ──
FROM node:22-alpine AS builder
WORKDIR /app

# Install pnpm matching packageManager version
RUN npm install -g pnpm@11.5.2

# Copy workspaces and configs
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml tsconfig.json astro.config.mjs ./
RUN pnpm install --frozen-lockfile

# Copy codebase and compile
COPY . .
RUN pnpm build

# ── Runtime Stage ──
FROM nginx:1.27-alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD wget --quiet --tries=1 --spider http://127.0.0.1/ || exit 1
