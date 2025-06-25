# Etapa de construcción
FROM node:20-alpine AS builder

WORKDIR /app

# Copiar archivos de dependencias
COPY package*.json ./
COPY tsconfig.json ./

# Instalar dependencias
RUN npm ci

# IMPORTANTE: Definir la variable ANTES de copiar el código y compilar
ENV NEXT_PUBLIC_API_URL="https://cmpappback.graymoss-4852b028.brazilsouth.azurecontainerapps.io"

# Copiar el resto del código fuente
COPY . .

# Construir la aplicación (ahora con la variable ENV disponible)
RUN npm run build

# Etapa de producción
FROM node:20-alpine AS runner

WORKDIR /app

# Configurar variables de entorno
ENV NODE_ENV=production
ENV PORT=8080
# Definir para referencia, aunque ya no tendrá efecto en el código compilado
ENV NEXT_PUBLIC_API_URL="https://cmpappback.graymoss-4852b028.brazilsouth.azurecontainerapps.io"

# Copiar archivos necesarios desde la etapa de construcción
COPY --from=builder /app/package.json ./
COPY --from=builder /app/next.config.ts ./
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

# Exponer el puerto
EXPOSE 8080

# Comando para iniciar la aplicación
CMD ["node", "server.js"]