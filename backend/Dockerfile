FROM node:20-alpine

WORKDIR /app

# Copiamos los archivos de configuración de dependencias
COPY package*.json ./

# Instalamos TODAS las dependencias (necesarias para el build y ejecución de Nest)
RUN npm install

# Copiamos el resto del código del backend
COPY . .
RUN npx prisma generate  
# Compilamos el proyecto dentro del contenedor
RUN npm run build

EXPOSE 3000

# Ejecutamos la ruta que confirmamos que existe
CMD ["node", "dist/src/main"]
