FROM node:18-alpine

WORKDIR /app

# Copiar archivos de dependencias
COPY package*.json ./

# Instalar dependencias
RUN npm install

# Copiar el resto del código
COPY . .

# Compilar TypeScript
RUN npm run build

# Exponer puerto
EXPOSE 4000

# Comando para ejecutar el seed y luego la aplicación
CMD ["sh", "-c", "node dist/utils/seed.js && node dist/index.js"]