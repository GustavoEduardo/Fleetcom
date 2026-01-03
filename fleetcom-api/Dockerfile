FROM node:22-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# Prisma precisa do schema na build
COPY prisma ./prisma

RUN npx prisma generate
RUN npm run build


FROM node:22-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install --omit=dev

COPY --from=build /app/dist ./dist

# Copia Prisma
COPY --from=build /app/prisma ./prisma

# Copia client gerado
COPY --from=build /app/node_modules/.prisma ./node_modules/.prisma

# Arquivos estáticos
COPY --from=build /app/public ./public

EXPOSE 3000

# Aplica migrations e inicia API
CMD ["sh", "-c", "npx prisma migrate deploy && node dist/main.js"]
