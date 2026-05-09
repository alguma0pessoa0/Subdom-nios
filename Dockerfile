# Backend
FROM node:20-alpine AS backend-builder
WORKDIR /app

COPY server/package*.json ./
RUN npm install

COPY server/prisma ./prisma
COPY server/src ./src

RUN npm run build

# Frontend
FROM node:20-alpine AS frontend-builder
WORKDIR /app

COPY client/package*.json ./
RUN npm install

COPY client . .
RUN npm run build

# Production
FROM node:20-alpine
WORKDIR /app

# Install production dependencies for backend
COPY server/package*.json ./
RUN npm install --production

COPY --from=backend-builder /app/dist ./dist
COPY --from=backend-builder /app/prisma ./prisma
COPY --from=frontend-builder /app/.next ./.next
COPY --from=frontend-builder /app/public ./public

EXPOSE 5000 3000

ENV NODE_ENV=production

CMD ["node", "dist/server.js"]
