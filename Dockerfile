# Production Dockerfile for Une Formule Nuxt 4 Application
FROM node:20-alpine AS base

WORKDIR /app

# Enable pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

# Install dependencies
COPY package.json pnpm-lock.yaml* ./
RUN pnpm install --frozen-lockfile || pnpm install

# Copy source files
COPY . .

# Build production Nuxt/Nitro server
ENV NODE_ENV=production
RUN pnpm run build

# Production Runner Stage
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000
ENV HOST=0.0.0.0

COPY --from=base /app/.output ./.output
COPY --from=base /app/package.json ./package.json

EXPOSE 3000

CMD ["node", ".output/server/index.mjs"]
