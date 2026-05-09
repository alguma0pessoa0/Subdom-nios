# Backend Dockerfile
FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY prisma ./prisma
COPY src ./src

RUN npm run build && npm install --production

EXPOSE 5000

ENV NODE_ENV=production

CMD ["node", "dist/server.js"]
