# --- ETAPA 1: Compilación ---
FROM node:20-alpine AS builder
WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# Inyectamos la variable para el build de Next.js
ENV NEXT_PUBLIC_API_URL=https://api.zhyra.online
ENV NODE_ENV=production

RUN npm run build

# --- ETAPA 2: Imagen ligera de producción ---
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
# Forzamos a Next.js standalone a escuchar en el puerto 3001
ENV PORT=3001
ENV HOSTNAME="0.0.0.0"

# Copiamos solo lo estrictamente necesario para que funcione
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

EXPOSE 3001

# Ejecutamos directamente con Node (sin depender de npm ni node_modules gigantes)
CMD ["node", "server.js"]
