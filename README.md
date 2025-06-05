# Backend Express API

Este proyecto es el backend de una aplicación desarrollada con Express.js.

## Requisitos previos
- Node.js (v18 o superior recomendado)
- npm (v9 o superior)

## Instalación
1. Clona el repositorio:
   ```sh
   git clone git@github.com:unir-grupo6/backend.git
   cd backend
   ```
2. Instala las dependencias:
   ```sh
   npm install
   ```

## Configuración
1. Crea un archivo `.env` en la raíz del proyecto para definir variables de entorno. Ejemplo:
   ```env
   PORT=3000
   JWT_SECRET_KEY=your_jwt_secret
   JWT_EXPIRES_IN_UNIT=day
   JWT_EXPIRES_IN_AMOUNT=7
   BCRYPT_SALT_ROUNDS=8
   # Otras variables de entorno
   ```
   El archivo `.env` nunca debe subirse al repositorio, ya que puede contener información sensible. El archivo `.gitignore` ya está configurado para ignorarlo.
2. Puedes modificar el puerto cambiando la variable `PORT`.

## Scripts disponibles
- `npm start`: Inicia el servidor en modo producción.
- `npm run dev`: Inicia el servidor en modo desarrollo con recarga automática (requiere `nodemon`).
- `npm run lint`: Linting del código usando Biome.
- `npm run format`: Formatea el código usando Biome.

## Dependencias principales
- [express](https://www.npmjs.com/package/express)
- [cors](https://www.npmjs.com/package/cors)
- [dotenv](https://www.npmjs.com/package/dotenv)

## Estructura del proyecto
```
backend/
├── index.js           # Punto de entrada del servidor
├── src/
│   ├── app.js         # Configuración de la app Express
│   ├── controllers/   # Controladores (lógica de negocio)
│   ├── models/        # Modelos de datos
│   └── routes/        # Definición de rutas
├── package.json       # Dependencias y scripts
├── .env               # Variables de entorno
└── README.md          # Este archivo
```

## Ejecución
1. Asegúrate de tener el archivo `.env` configurado.
2. Inicia el servidor:
   ```sh
   npm run dev
   ```
   El servidor estará disponible en `http://localhost:3000` (o el puerto que definas).

## Documentación de la API
Consulta el archivo `api-endpoints.md` para ver los endpoints disponibles y sus detalles.