# Etapa de construcción
FROM node:20-alpine AS builder

WORKDIR /app

# Copiar archivos de dependencias
COPY package*.json ./
COPY tsconfig.json ./

# Instalar dependencias
RUN npm ci

# Copiar el resto del código fuente
COPY . .

# Construir la aplicación
RUN npm run build

# Etapa de producción
FROM node:20-alpine AS runner

WORKDIR /app

# Configurar variables de entorno
ENV NODE_ENV=production
ENV PORT=8080
# Apuntar al host local (tu máquina) usando host.docker.internal
ENV NEXT_PUBLIC_API_URL="http://host.docker.internal:4000"

# Copiar archivos necesarios desde la etapa de construcción
COPY --from=builder /app/package.json ./
# Asegúrate de que este archivo exista, o cambia la extensión según corresponda
COPY --from=builder /app/next.config.ts ./  
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

# Exponer el puerto que Azure Container Apps espera
EXPOSE 8080

# Comando para iniciar la aplicación
CMD ["node", "server.js"]