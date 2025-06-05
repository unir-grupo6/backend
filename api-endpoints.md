# API Endpoints

## Users

### Get all users
- **Method**: GET
- **URL**: /api/users
- **Headers**: Authorization
- **Body**: ---
- **Response**: An array with all the users

### Registration
- **Method**: POST
- **URL**: /api/users/register
- **Headers**: ---
- **Body**: name, email, password
- **Response**: The created user object

### Login
- **Method**: POST
- **URL**: /api/users/login
- **Headers**: ---
- **Body**: email, password
- **Response**: The access token for the application