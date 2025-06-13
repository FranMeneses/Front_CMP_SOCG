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
# La URL del backend se pasará como variable de entorno en tiempo de ejecución
ENV NEXT_PUBLIC_API_URL=""

# Copiar archivos necesarios desde la etapa de construcción
COPY --from=builder /app/next.config.ts ./
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

# Exponer el puerto que Azure Container Apps espera
EXPOSE 8080

# Comando para iniciar la aplicación
CMD ["node", "server.js"] 