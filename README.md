# Prueba Técnica - Aplicación Full Stack

Este proyecto es una aplicación full stack que consta de un backend desarrollado con Node.js, Express y MongoDB, y un frontend desarrollado con React y Vite.

## Características

- Autenticación de usuarios (registro e inicio de sesión)
- Gestión de usuarios
- Interfaz de usuario moderna con React y Tailwind CSS
- API RESTful con Express
- Base de datos MongoDB
- Tests unitarios y de integración

## Requisitos previos

- [Node.js](https://nodejs.org/) (v18 o superior)
- [Docker](https://www.docker.com/) y [Docker Compose](https://docs.docker.com/compose/) (para despliegue con contenedores)
- [MongoDB](https://www.mongodb.com/) (solo para desarrollo local sin Docker)

## Estructura del proyecto

El proyecto está dividido en dos partes principales:

- `back/`: Contiene el código del backend (API REST con Express)
- `front/`: Contiene el código del frontend (Aplicación React con Vite)

## Configuración de variables de entorno

### Backend

Crea un archivo `.env` en la carpeta `back/` con las siguientes variables:

```
PORT=4000
MONGO_URI=mongodb://localhost:27017/pruebatecnica
JWT_SECRET=tu_clave_secreta
```

### Frontend

Crea un archivo `.env` en la carpeta `front/` con las siguientes variables:

```
VITE_API_URL=http://localhost:4000
```

## Despliegue con Docker

La forma más sencilla de ejecutar la aplicación es utilizando Docker Compose:

1. Asegúrate de tener Docker y Docker Compose instalados
2. Clona este repositorio
3. Ejecuta el siguiente comando en la raíz del proyecto:

```bash
docker-compose up -d
```

Esto iniciará tres contenedores:
- MongoDB en el puerto 27017
- Backend en el puerto 4000
- Frontend en el puerto 80

Puedes acceder a la aplicación en tu navegador: http://localhost

## Desarrollo local

### Backend

1. Navega a la carpeta `back/`:
```bash
cd back
```

2. Instala las dependencias:
```bash
npm install
```

3. Inicia el servidor en modo desarrollo:
```bash
npm run dev
```

El servidor estará disponible en http://localhost:4000

### Frontend

1. Navega a la carpeta `front/`:
```bash
cd front
```

2. Instala las dependencias:
```bash
npm install
```

3. Inicia el servidor de desarrollo:
```bash
npm run dev
```

La aplicación estará disponible en http://localhost:5173

## Pruebas

### Backend

```bash
cd back
npm test
```

### Frontend

```bash
cd front
npm test
```

## Construcción para producción

### Backend

```bash
cd back
npm run build
```

### Frontend

```bash
cd front
npm run build
```

## Tecnologías utilizadas

### Backend
- Node.js
- Express
- MongoDB con Mongoose
- TypeScript
- JWT para autenticación
- Jest para pruebas

### Frontend
- React
- TypeScript
- Vite
- React Query
- React Router
- Tailwind CSS
- Formik y Yup para validación de formularios
- Jest y Testing Library para pruebas