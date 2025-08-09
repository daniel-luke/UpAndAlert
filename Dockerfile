# Dockerfile

# 1. Build stage (with build tools for native modules)
FROM node:20-alpine AS builder

WORKDIR /app

# Install build dependencies for sqlite3
RUN apk add --no-cache python3 make g++

# Install dependencies
COPY package*.json ./
RUN npm ci

# Copy source code
COPY . .

# Build the Nuxt app
RUN npm run build

# 2. Production stage (minimal)
FROM node:20-alpine AS production

WORKDIR /app

# Copy built output and node_modules
COPY --from=builder /app/.output ./.output
COPY --from=builder /app/server/utils/migrations ./server/utils/migrations

# Remove build tools (not needed in production)
RUN apk del python3 make g++ || true

EXPOSE 3000

CMD ["node", ".output/server/index.mjs"]
