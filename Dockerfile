# Build Stage
FROM node:22-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Production Stage for Google Cloud Run
FROM node:22-alpine
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=8080

COPY package*.json ./
RUN npm ci --omit=dev

COPY --from=builder /app/dist ./dist
COPY server ./server
COPY src/utils ./src/utils

EXPOSE 8080
CMD ["node", "server/index.js"]
