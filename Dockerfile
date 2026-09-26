# Multi-stage build for Persona Learner & Scenario Bot
FROM node:22-alpine AS builder

WORKDIR /app

# Install dependencies
COPY package*.json .npmrc* ./
RUN npm install --legacy-peer-deps

# Copy application source
COPY . .

# Build Vite client SPA and bundle server.ts into dist/server.cjs
RUN npm run build

# Production runtime stage
FROM node:22-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000

# Copy built assets and package config
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules

EXPOSE 3000

CMD ["node", "dist/server.cjs"]
