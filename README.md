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
 - Crea un archivo `.env` en la raíz del proyecto para definir variables de entorno. Ejemplo:
   ```env
   PORT=3000
   NODE_ENV=

   DB_HOST=localhost
   DB_USER=username
   DB_PASSWORD=password
   DB_PORT=3306
   DB_NAME=your_db_name

   JWT_SECRET_KEY=your_jwt_secret
   JWT_EXPIRES_IN_UNIT=hours
   JWT_EXPIRES_IN_AMOUNT=2

   JWT_RESET_SECRET_KEY=your_jwt_secret
   JWT_RESET_EXPIRES_IN_UNIT=minutes
   JWT_RESET_EXPIRES_IN_AMOUNT=15

   BCRYPT_SALT_ROUNDS=8

   FRONTEND_URL=http://localhost:3000

   GMAIL_APP_USER=your_gmail_user
   GMAIL_APP_PASSWORD=your_gmail_app_password
   ```

>[!TIP]
>Puedes copiar y renombrar el archivo `.env.example` incluido en el repositorio como punto de partida.

>[!CAUTION]
>El archivo `.env` nunca debe subirse al repositorio, ya que puede contener información sensible. El archivo `.gitignore` ya está configurado para ignorarlo.

## Scripts disponibles
- `npm start`: Inicia el servidor en modo producción.
- `npm run dev`: Inicia el servidor en modo desarrollo con recarga automática (requiere `nodemon`).
- `npm run lint`: Linting del código usando Biome.
- `npm run format`: Formatea el código usando Biome.

## Dependencias principales
- [express](https://www.npmjs.com/package/express)
- [cors](https://www.npmjs.com/package/cors)
- [dotenv](https://www.npmjs.com/package/dotenv)
- [mysql2](https://www.npmjs.com/package/mysql2)
- [bcryptjs](https://www.npmjs.com/package/bcryptjs)
- [jsonwebtoken](https://www.npmjs.com/package/jsonwebtoken)
- [nodemailer](https://www.npmjs.com/package/nodemailer)
- [dayjs](https://www.npmjs.com/package/dayjs)

## Estructura del proyecto
```
backend/
├── src/
│   ├── config/        # Configuración de base de datos y mailer
│   ├── controllers/   # Controladores (lógica de negocio)
│   ├── middlewares/   # Middlewares personalizados
│   ├── models/        # Modelos de datos
│   ├── routes/        # Definición de rutas
│   └── app.js         # Configuración de la app Express
├── .env               # Variables de entorno
├── package.json       # Dependencias y scripts
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