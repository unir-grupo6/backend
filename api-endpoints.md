# API Endpoints

## Index

- [API Endpoints](#api-endpoints)
  - [Index](#index)
  - [Users](#users)
    - [Get logged-in user information](#get-logged-in-user-information)
    - [Update logged-in user information](#update-logged-in-user-information)
    - [Registration](#registration)
    - [Login](#login)
    - [Update password for the logged-in user](#update-password-for-the-logged-in-user)
    - [Forgot Password](#forgot-password)
    - [Reset Password](#reset-password)
  - [User Routines](#user-routines)
    - [Get logged-in user's routines (paginated)](#get-logged-in-users-routines-paginated)
    - [Get a specific routine of the logged-in user](#get-a-specific-routine-of-the-logged-in-user)
    - [Save a user routine](#save-a-user-routine)
    - [Create a new user routine from an existing routine](#create-a-new-user-routine-from-an-existing-routine)
    - [Delete a user routine](#delete-a-user-routine)
    - [Update a user routine](#update-a-user-routine)
    - [Add exercise to a user routine](#add-exercise-to-a-user-routine)
    - [Remove exercise from a user routine](#remove-exercise-from-a-user-routine)
    - [Update an exercise in a user routine](#update-an-exercise-in-a-user-routine)
    - [Generate PDF for a user routine](#generate-pdf-for-a-user-routine)
  - [Muscle Groups](#muscle-groups)
    - [Get all muscle groups](#get-all-muscle-groups)
    - [Get muscle group by ID](#get-muscle-group-by-id)
  - [Difficulties](#difficulties)
    - [Get all difficulties](#get-all-difficulties)
    - [Get difficulty by ID](#get-difficulty-by-id)
  - [Methods](#methods)
    - [Get all methods](#get-all-methods)
    - [Get method by ID](#get-method-by-id)
  - [Goals](#goals)
    - [Get all goals](#get-all-goals)
    - [Get goal by ID](#get-goal-by-id)
  - [Routines](#routines)
    - [Get shared routines (excluding those of the logged-in user)](#get-shared-routines-excluding-those-of-the-logged-in-user)
    - [Get all routines](#get-all-routines)
    - [Get routine by ID](#get-routine-by-id)
    - [Get routines by goals, difficulty and method](#get-routines-by-goals-difficulty-and-method)
  - [Exercises](#exercises)
    - [Get all exercises](#get-all-exercises)
    - [Get exercises by muscle group and difficulty](#get-exercises-by-muscle-group-and-difficulty)
  - [Autogenerate Routines](#autogenerate-routines)
    - [Generate routine automatically for the logged-in user](#generate-routine-automatically-for-the-logged-in-user)



## Users

### Get logged-in user information
- **Method**: GET
- **URL**: /api/users
- **Headers**: Authorization: `{token}`
- **Body**: None
- **Response**: Logged-in user object
- **Possible errors**:
  - **401 Unauthorized**: `{ "message": "Authorization header is required" }` — The Authorization header is missing.
  - **401 Unauthorized**: `{ "message": "Invalid token" }` — The provided token is invalid or expired.
  - **403 Forbidden**: `{ "message": "User not found" }` — The user associated with the token does not exist.
  - **404 Not Found**: `{ "message": "Not found" }` — The endpoint does not exist.
  - **500 Internal Server Error**: `{ "message": "<error message>" }` — An unexpected server error occurred.

### Update logged-in user information
- **Method**: PUT
- **URL**: /api/users/update
- **Headers**: Authorization: `{token}`, Content-Type: application/json
- **Body**:
  - `nombre` (string, required): New first name
  - `apellidos` (string, required): New last name
  - `email` (string, required): New email address
  - `fecha_nacimiento` (string, required, format: DD-MM-YYYY): New birth date
  - `sexo` (number, required): New gender (1 (Hombre), 2 (Mujer) or 3 (Otro))
  - `objetivo_id` (number, optional): New goal ID
  - `peso` (number, optional): New weight (must be a number if provided)
  - `altura` (number, optional): New height (must be a number if provided)
- **Response**: On success, returns the updated user object
- **Possible errors**:
  - **401 Unauthorized**: `{ "message": "Authorization header is required" }` — The Authorization header is missing.
  - **401 Unauthorized**: `{ "message": "Invalid token" }` — The provided token is invalid or expired.
  - **403 Forbidden**: `{ "message": "User not found" }` — The user associated with the token does not exist.
  - **400 Bad Request**: `{ "message": "Nombre, apellidos, email, and fecha_nacimiento are required" }` — One or more required fields are missing in the request body.
  - **400 Bad Request**: `{ "message": "Peso must be a number" }` — The value for `peso` is not a number.
  - **400 Bad Request**: `{ "message": "Altura must be a number" }` — The value for `altura` is not a number.
  - **400 Bad Request**: `{ "message": "Fecha de nacimiento must be a valid date" }` — The value for `fecha_nacimiento` is not a valid date.
  - **400 Bad Request**: `{ "message": "Objetivo ID must be a number" }` — The value for `objetivo_id` is not a number.
  - **400 Bad Request**: `{ "message": "Invalid objetivo_id" }` — The value for `objetivo_id` does not exist.
  - **400 Bad Request**: `{ "message": "Failed to update user objective" }` — There was a problem updating the user objective in the database.
  - **400 Bad Request**: `{ "message": "Failed to update user data" }` — There was a problem updating the user data in the database.
  - **400 Bad Request**: `{ "message": "Failed to update user metrics" }` — There was a problem updating the user metrics in the database.
  - **400 Bad Request**: `{ "message": "Failed to insert new user metrics" }` — There was a problem inserting new user metrics in the database.
  - **403 Forbidden**: `{ "message": "Email already exists" }` — The new email is already registered in the system.
  - **404 Not Found**: `{ "message": "Not found" }` — The endpoint does not exist.
  - **500 Internal Server Error**: `{ "message": "Error updating user" }` — There was a problem updating the user in the database.
  - **500 Internal Server Error**: `{ "message": "<error message>" }` — An unexpected server error occurred.

>[!NOTE]
>All fields except `peso`, `altura` y `objetivo_id` are required. The response always returns the updated user object. If `peso` and/or `altura` are provided, user metrics are updated or inserted for the current day. All validations are applied to the provided fields.

### Registration
- **Method**: POST
- **URL**: /api/users/register
- **Headers**: Content-Type: application/json
- **Body**: 
  - `nombre` (string, required)
  - `apellidos` (string, required)
  - `email` (string, required)
  - `password` (string, required)
  - `fecha_nacimiento` (string, required, format: DD-MM-YYYY)
  - `sexo` (number, required): Gender (1 (Hombre), 2 (Mujer) or 3 (Otro))
  - `peso` (number, required)
  - `altura` (number, required)
  - `objetivo_id` (number, required)
- **Response**: The created user object
- **Possible errors**:
  - **400 Bad Request**: `{ "message": "Nombre, apellidos, email, password, fecha_nacimiento, peso, altura and objetivo_id are required" }` — One or more required fields are missing in the request body.
  - **400 Bad Request**: `{ "message": "Nombre, apellidos, and email must be strings" }` — One or more of these fields are not strings.
  - **400 Bad Request**: `{ "message": "Peso must be a number" }` — The value for `peso` is not a number.
  - **400 Bad Request**: `{ "message": "Altura must be a number" }` — The value for `altura` is not a number.
  - **400 Bad Request**: `{ "message": "Fecha de nacimiento must be a valid date" }` — The value for `fecha_nacimiento` is not a valid date.
  - **400 Bad Request**: `{ "message": "Objetivo ID must be a number" }` — The value for `objetivo_id` is not a number.
  - **400 Bad Request**: `{ "message": "Invalid objetivo_id" }` — The value for `objetivo_id` does not exist.
  - **400 Bad Request**: `{ "message": "Password is required." }` — The password field is missing (middleware).
  - **400 Bad Request**: `{ "message": "Password must be a string." }` — The password is not a string (middleware).
  - **400 Bad Request**: `{ "message": "Password cannot be empty." }` — The password is an empty string (middleware).
  - **400 Bad Request**: `{ "message": "Password must be at least 8 characters long." }` — The password does not meet the minimum length (middleware).
  - **400 Bad Request**: `{ "message": "Password must contain at least one uppercase letter." }` — The password does not have an uppercase letter (middleware).
  - **400 Bad Request**: `{ "message": "Password must contain at least one lowercase letter." }` — The password does not have a lowercase letter (middleware).
  - **400 Bad Request**: `{ "message": "Password must contain at least one number." }` — The password does not have a number (middleware).
  - **400 Bad Request**: `{ "message": "Password must contain at least one special character." }` — The password does not have a special character (middleware).
  - **403 Forbidden**: `{ "message": "Email already exists" }` — The email is already registered in the system.
  - **400 Bad Request**: `{ "message": "Failed to register user" }` — There was a problem inserting the user in the database.
  - **400 Bad Request**: `{ "message": "Failed to register user metrics" }` — There was a problem inserting user metrics in the database.
  - **400 Bad Request**: `{ "message": "Failed to register user objective" }` — There was a problem inserting the user objective in the database.
  - **400 Bad Request**: `{ "message": "Failed to retrieve new user" }` — There was a problem retrieving the new user after registration.
  - **404 Not Found**: `{ "message": "Not found" }` — The endpoint does not exist.
  - **500 Internal Server Error**: `{ "message": "<error message>" }` — An unexpected server error occurred.

### Login
- **Method**: POST
- **URL**: /api/users/login
- **Headers**: Content-Type: application/json
- **Body**: 
  - `email` (string, required)
  - `password` (string, required)
- **Response**: On success:
  ```json
  {
    "message": "Login successful",
    "token": "<jwt_token>"
  }
  ```
- **Possible errors**:
  - **400 Bad Request**: `{ "message": "Failed to update reset token" }` — Internal error (rare, usually not triggered by user input).
  - **401 Unauthorized**: `{ "message": "Error in email and/or password" }` — The email or password is incorrect.
  - **404 Not Found**: `{ "message": "Not found" }` — The endpoint does not exist.
  - **500 Internal Server Error**: `{ "message": "<error message>" }` — An unexpected server error occurred.

### Update password for the logged-in user
- **Method**: PUT
- **URL**: /api/users/update-password
- **Headers**: Authorization: `{token}`, Content-Type: application/json
- **Body**:
  - `oldPassword` (string, required): The current password of the user
  - `password` (string, required): The new password to set
- **Response**: On success:
  ```json
  { "message": "Password updated successfully" }
  ```
- **Possible errors**:
  - **400 Bad Request**: `{ "message": "Old password and new password are required" }` — One or both required fields are missing in the request body.
  - **400 Bad Request**: `{ "message": "Old password and new password must be strings" }` — One or both fields are not strings.
  - **400 Bad Request**: `{ "message": "Password is required." }` — The new password is missing (middleware).
  - **400 Bad Request**: `{ "message": "Password must be a string." }` — The new password is not a string (middleware).
  - **400 Bad Request**: `{ "message": "Password cannot be empty." }` — The new password is an empty string (middleware).
  - **400 Bad Request**: `{ "message": "Password must be at least 8 characters long." }` — The new password does not meet the minimum length (middleware).
  - **400 Bad Request**: `{ "message": "Password must contain at least one uppercase letter." }` — The new password does not have an uppercase letter (middleware).
  - **400 Bad Request**: `{ "message": "Password must contain at least one lowercase letter." }` — The new password does not have a lowercase letter (middleware).
  - **400 Bad Request**: `{ "message": "Password must contain at least one number." }` — The new password does not have a number (middleware).
  - **400 Bad Request**: `{ "message": "Password must contain at least one special character." }` — The new password does not have a special character (middleware).
  - **401 Unauthorized**: `{ "message": "Authorization header is required" }` — The Authorization header is missing.
  - **401 Unauthorized**: `{ "message": "Error in email and/or password" }` — The current password is incorrect.
  - **500 Internal Server Error**: `{ "message": "Error validating password" }` — There was a problem validating the password.
  - **500 Internal Server Error**: `{ "message": "Error updating password" }` — There was a problem updating the password in the database.

### Forgot Password
- **Method**: PUT
- **URL**: /api/users/forgot-password
- **Headers**: Content-Type: application/json
- **Body**: 
  - `email` (string, required)
- **Response**: On success:
  ```json
  {
    "message": "Password reset link sent to your email",
    "verificationLink": "<reset_link>"
  }
  ```
- **Possible errors**:
  - **400 Bad Request**: `{ "message": "Email is required" }` — The email field was not provided in the request body.
  - **403 Forbidden**: `{ "message": "User not found" }` — No user exists with the provided email.
  - **404 Not Found**: `{ "message": "Not found" }` — The endpoint does not exist.
  - **500 Internal Server Error**: `{ "message": "Failed to send verification email" }` — There was a problem sending the reset email.
  - **500 Internal Server Error**: `{ "message": "Failed to update reset token" }` — There was a problem updating the reset token in the database.

### Reset Password
- **Method**: PUT
- **URL**: /api/users/reset-password
- **Headers**: reset-token: `{token}`, Content-Type: application/json
- **Body**: 
  - `newPassword` (string, required)
- **Response**: On success:
  ```json
  { "message": "Password reset successfully" }
  ```
- **Possible errors**:
  - **400 Bad Request**: `{ "message": "Password is required." }` — The new password is missing (middleware).
  - **400 Bad Request**: `{ "message": "Password must be a string." }` — The new password is not a string (middleware).
  - **400 Bad Request**: `{ "message": "Password cannot be empty." }` — The new password is an empty string (middleware).
  - **400 Bad Request**: `{ "message": "Password must be at least 8 characters long." }` — The new password does not meet the minimum length (middleware).
  - **400 Bad Request**: `{ "message": "Password must contain at least one uppercase letter." }` — The new password does not have an uppercase letter (middleware).
  - **400 Bad Request**: `{ "message": "Password must contain at least one lowercase letter." }` — The new password does not have a lowercase letter (middleware).
  - **400 Bad Request**: `{ "message": "Password must contain at least one number." }` — The new password does not have a number (middleware).
  - **400 Bad Request**: `{ "message": "Password must contain at least one special character." }` — The new password does not have a special character (middleware).
  - **403 Forbidden**: `{ "message": "Reset token and new password are required" }` — The reset token or new password was not provided.
  - **403 Forbidden**: `{ "message": "User not found" }` — No user is associated with the provided reset token.
  - **403 Forbidden**: `{ "message": "<jwt error message>" }` — The reset token is invalid or expired.
  - **400 Bad Request**: `{ "message": "Failed to reset password" }` — There was a problem updating the password in the database.
  - **404 Not Found**: `{ "message": "Not found" }` — The endpoint does not exist.
  - **500 Internal Server Error**: `{ "message": "<error message>" }` — An unexpected server error occurred.

## User Routines

### Get logged-in user's routines (paginated)
- **Method**: GET
- **URL**: /api/user-routines?page=1&limit=10&active=true
- **Headers**: Authorization: `{token}`
- **Body**: ---
- **Query Parameters**:
  - `page` (number, optional): Page number of the results. Default: 1.
  - `limit` (number, optional): Maximum number of routines per page. Default: 5.
  - `active` (boolean, optional): If `true`, only returns active routines (for the current date). If `false` or not specified, returns all routines for the user. Default: `false`.
- **Response**: User object with the routines belonging to the authenticated user (paginated, optionally only active routines). The response also includes:
  - `total_routines`: total number of routines matching the query
  - `current_page`: current page number
  - `total_pages`: total number of pages
- **Notes**: This endpoint returns only the routines of the user identified by the JWT token provided in the Authorization header. It does not return routines for other users.
- **Possible errors**:
  - **401 Unauthorized**: `{ "message": "Authorization header is required" }` — The Authorization header is missing.
  - **401 Unauthorized**: `{ "message": "Invalid token" }` — The provided token is invalid or expired.
  - **403 Forbidden**: `{ "message": "User not found" }` — The user associated with the token does not exist.
  - **404 Not Found**: `{ "message": "No routines found for this user" }` — The user has no routines.
  - **404 Not Found**: `{ "message": "Not found" }` — The endpoint does not exist.
  - **500 Internal Server Error**: `{ "message": "<error message>" }` — An unexpected server error occurred.

### Get a specific routine of the logged-in user
- **Method**: GET
- **URL**: /api/user-routines/`{routineId}`
- **Headers**: Authorization: `{token}`
- **Body**: ---
- **Response**: Routine object belonging to the authenticated user with the specified routineId
- **Possible errors**:
  - **401 Unauthorized**: `{ "message": "Authorization header is required" }` — The Authorization header is missing.
  - **401 Unauthorized**: `{ "message": "Invalid token" }` — The provided token is invalid or expired.
  - **403 Forbidden**: `{ "message": "User not found" }` — The user associated with the token does not exist.
  - **404 Not Found**: `{ "message": "Routine not found" }` — The routine does not exist or does not belong to the user.
  - **500 Internal Server Error**: `{ "message": "<error message>" }` — An unexpected server error occurred.

### Save a user routine
- **Method**: POST
- **URL**: /api/user-routines/`{userRoutineId}`/save
- **Headers**: Authorization: `{token}`
- **Body**: ---
- **Response**: On success, returns the full saved routine object (including exercises) assigned to the logged-in user, for example:
  ```json
  {
    "rutina_id": 123,
    "nombre": "Routine name",
    "fecha_inicio_rutina": "24-06-2025",
    "fecha_fin_rutina": "30-06-2025",
    "dia": 1,
    "rutina_compartida": false,
    "rutina_activa": true,
    "observaciones": "...",
    "sexo": "M",
    "nivel": "Intermedio",
    "metodo_nombre": "Fullbody",
    "tiempo_aerobicos": 10,
    "tiempo_anaerobicos": 20,
    "descanso": 60,
    "metodo_observaciones": "...",
    "ejercicios": [
      {
        "orden": 1,
        "nombre": "Press banca",
        "tipo": "Pecho",
        "step_1": "...",
        "step_2": "...",
        "grupos_musculares": "Pectoral",
        "series": 4,
        "repeticiones": 10,
        "comentario": "..."
      }
      // ...
    ]
  }
  ```
- **Possible errors**:
  - **403 Forbidden**: `{ "message": "Authorization header is required" }` — The Authorization header is missing.
  - **403 Forbidden**: `{ "message": "Invalid token" }` — The provided token is invalid or expired.
  - **403 Forbidden**: `{ "message": "User not found" }` — The user associated with the token does not exist.
  - **404 Not Found**: `{ "message": "No routines found for the specified ID." }` — The routine does not exist or does not belong to the user.
  - **404 Not Found**: `{ "message": "No exercises found for the specified routine." }` — The routine does not have exercises to copy.
  - **500 Internal Server Error**: `{ "message": "Error saving user routine" }` — There was a problem saving the routine.
  - **500 Internal Server Error**: `{ "message": "Error generating user routine" }` — There was a problem generating the user routine.
  - **500 Internal Server Error**: `{ "message": "Error saving exercise for the routine" }` — There was un error saving an exercise for the routine.
  - **404 Not Found**: `{ "message": "Saved routine not found" }` — The saved routine could not be retrieved after saving.

### Create a new user routine from an existing routine
- **Method**: POST
- **URL**: /api/user-routines/
- **Headers**: Authorization: `{token}`
- **Body**:
  - `id_rutina` (number, required): The ID of the routine to copy and assign to the user
- **Response**: On success, returns the full saved user routine object (including exercises) assigned to the logged-in user, for example:
  ```json
  {
    "rutina_id": 123,
    "nombre": "Routine name",
    "fecha_inicio_rutina": "24-06-2025",
    "fecha_fin_rutina": "30-06-2025",
    "dia": 1,
    "rutina_compartida": false,
    "rutina_activa": true,
    "observaciones": "...",
    "nivel": "Intermedio",
    "metodo_nombre": "Fullbody",
    "tiempo_aerobicos": 10,
    "tiempo_anaerobicos": 20,
    "descanso": 60,
    "metodo_observaciones": "...",
    "ejercicios": [
      {
        "orden": 1,
        "nombre": "Press banca",
        "tipo": "Pecho",
        "step_1": "...",
        "step_2": "...",
        "grupos_musculares": "Pectoral",
        "series": 4,
        "repeticiones": 10,
        "comentario": "..."
      }
      // ...
    ]
  }
  ```
- **Possible errors**:
  - **403 Forbidden**: `{ "message": "Authorization header is required" }` — The Authorization header is missing.
  - **403 Forbidden**: `{ "message": "Invalid token" }` — The provided token is invalid or expired.
  - **403 Forbidden**: `{ "message": "User not found" }` — The user associated with the token does not exist.
  - **400 Bad Request**: `{ "message": "rutina_id is required" }` — The routine ID is missing in the request body.
  - **404 Not Found**: `{ "message": "Routine not found" }` — The specified routine does not exist.
  - **500 Internal Server Error**: `{ "message": "Error saving user routine" }` — There was a problem saving the user routine.
  - **500 Internal Server Error**: `{ "message": "Error generating user routine" }` — There was a problem generating the user routine.
  - **404 Not Found**: `{ "message": "No exercises found for the specified routine." }` — The routine does not have exercises to copy.
  - **500 Internal Server Error**: `{ "message": "Error saving exercise for the routine" }` — There was a problem saving an exercise for the routine.
  - **404 Not Found**: `{ "message": "Saved routine not found" }` — The saved routine could not be retrieved after saving.
  - **500 Internal Server Error**: `{ "message": "Error formatting routine with exercises" }` — There was a problem formatting the saved routine.
  - **500 Internal Server Error**: `{ "message": "Error saving new user routine" }` — An unexpected error occurred while saving the new user routine.

### Delete a user routine
- **Method**: DELETE
- **URL**: /api/user-routines/`{userRoutineId}`
- **Headers**: Authorization: `{token}`
- **Body**: ---
- **Response**: On success:
  ```json
  { "message": "Routine deleted successfully" }
  ```
- **Possible errors**:
  - **403 Forbidden**: `{ "message": "Authorization header is required" }` — The Authorization header is missing.
  - **403 Forbidden**: `{ "message": "Invalid token" }` — The provided token is invalid or expired.
  - **403 Forbidden**: `{ "message": "User not found" }` — The user associated with the token does not exist.
  - **404 Not Found**: `{ "message": "No routines found for the user." }` — The routine does not exist or does not belong to the user.
  - **500 Internal Server Error**: `{ "message": "Error deleting user routine" }` — There was a problem deleting the routine.

### Update a user routine
- **Method**: PATCH
- **URL**: /api/user-routines/`{userRoutineId}`
- **Headers**: Authorization: `{token}`
- **Body**:
  - `fecha_inicio_rutina` (string, nullable, formato `DD-MM-YYYY`)
  - `fecha_fin_rutina` (string, nullable, formato `DD-MM-YYYY`)
  - `rutina_compartida` (boolean, nullable)
  - `dia` (number, nullable): New value for the day of the routine
  - (At least one of these fields must be present)
- **Response**: On success, returns the updated routine object (including exercises)
- **Possible errors**:
  - **403 Forbidden**: `{ "message": "Authorization header is required" }` — The Authorization header is missing.
  - **403 Forbidden**: `{ "message": "Invalid token" }` — The provided token is invalid or expired.
  - **403 Forbidden**: `{ "message": "User not found" }` — The user associated with the token does not exist.
  - **400 Bad Request**: `{ "message": "Both start and end dates are required in case one is provided" }` — Only one of the dates was provided.
  - **400 Bad Request**: `{ "message": "Invalid date format or non-existent date" }` — The date is not in `DD-MM-YYYY` format or is not una fecha real.
  - **400 Bad Request**: `{ "message": "Start date cannot be after end date" }` — The start date is after the end date.
  - **400 Bad Request**: `{ "message": "Invalid value for rutina_compartida, must be a boolean" }` — The value for `rutina_compartida` is not boolean.
  - **400 Bad Request**: `{ "message": "Invalid value for dia, must be a number between 1 and 7" }` — The value for `dia` is not a number between 1 and 7.
  - **400 Bad Request**: `{ "message": "No fields to update" }` — No valid fields were provided in the request body.
  - **404 Not Found**: `{ "message": "No routines found for the specified user." }` — The routine does not exist or does not belong to the user.
  - **404 Not Found**: `{ "message": "Updated routine not found" }` — The routine could not be retrieved after updating.
  - **500 Internal Server Error**: `{ "message": "Error updating user routine" }` — There was a problem updating the routine.
  - **500 Internal Server Error**: `{ "message": "Error formatting routine with exercises" }` — There was a problem formatting the updated routine.

### Add exercise to a user routine
- **Method**: POST
- **URL**: /api/user-routines/`{userRoutineId}`/exercises
- **Headers**: Authorization: `{token}`
- **Body**:
  - `ejercicio_id` (number, required): Exercise ID to add
- **Response**: On success, returns the updated routine object (including exercises)
- **Possible errors**:
  - **403 Forbidden**: `{ "message": "Authorization header is required" }` — The Authorization header is missing.
  - **403 Forbidden**: `{ "message": "Invalid token" }` — The provided token is invalid or expired.
  - **403 Forbidden**: `{ "message": "User not found" }` — The user associated with the token does not exist.
  - **400 Bad Request**: `{ "message": "ejercicio_id is required" }` — The exercise ID is missing in the request body.
  - **404 Not Found**: `{ "message": "No routines found for the specified user." }` — The routine does not exist or does not belong to the user.
  - **404 Not Found**: `{ "message": "Exercise not found" }` — The exercise does not exist.
  - **500 Internal Server Error**: `{ "message": "Error saving exercise for the routine" }` — There was a problem adding the exercise to the routine.
  - **404 Not Found**: `{ "message": "Updated routine not found" }` — The routine could not be retrieved after adding the exercise.
  - **500 Internal Server Error**: `{ "message": "Error formatting routine with exercises" }` — There was a problem formatting the updated routine.

### Remove exercise from a user routine
- **Method**: DELETE
- **URL**: /api/user-routines/`{userRoutineId}`/exercises/`{exerciseId}`
- **Headers**: Authorization: `{token}`
- **Body**: ---
- **Response**: On success, returns the updated routine object (including exercises) with the new order:
  ```json
  {
    "rutina_id": 123,
    "nombre": "Routine name",
    "ejercicios": [
      {
        "orden": 1,
        "nombre": "Press banca",
        // ...other fields...
      },
      {
        "orden": 2,
        "nombre": "Sentadilla",
        // ...other fields...
      }
      // ...
    ]
    // ...other routine fields
  }
  ```
- **Notes**: After removing an exercise, the `orden` field of the remaining exercises is updated to maintain a continuous ascending order, preserving the previous sequence. For example, if there are exercises with `orden` 1, 2, and 3, and the one with `orden` 2 is removed, the one with `orden` 3 becomes `orden` 2.
- **Possible errors**:
  - **403 Forbidden**: `{ "message": "Authorization header is required" }` — The Authorization header is missing.
  - **403 Forbidden**: `{ "message": "Invalid token" }` — The provided token is invalid or expired.
  - **403 Forbidden**: `{ "message": "User not found" }` — The user associated with the token does not exist.
  - **404 Not Found**: `{ "message": "No routines found for the specified user." }` — The routine does not exist or does not belong to the user.
  - **404 Not Found**: `{ "message": "Exercise not found in routine" }` — The exercise does not exist in the routine.
  - **500 Internal Server Error**: `{ "message": "Error removing exercise from routine" }` — There was a problem removing the exercise.

### Update an exercise in a user routine
- **Method**: PATCH
- **URL**: /api/user-routines/`{userRoutineId}`/exercises/`{exerciseId}`
- **Headers**: Authorization: `{token}`
- **Body**:
  - `series` (number, optional): New number of sets for the exercise (must be a positive number)
  - `repeticiones` (number, optional): New number of repetitions for the exercise (must be a positive number)
  - `orden` (number, optional): New order for the exercise in the routine (must be a positive number and not already assigned to another exercise in the routine)
  - `comentario` (string, optional): New comment for the exercise
  - (At least one of these fields must be present)
- **Response**: On success, returns the updated routine object (including exercises with their updated order and fields):
  ```json
  {
    "rutina_id": 123,
    "nombre": "Routine name",        // ...other fields...
    "ejercicios": [
      {
        "orden": 1,
        "nombre": "Press banca",
        "series": 4,
        "repeticiones": 10,
        "comentario": "..."        // ...other fields...
      },
      {
        "orden": 2,
        "nombre": "Sentadilla",
        "series": 3,
        "repeticiones": 12,
        "comentario": "..."        // ...other fields...
      }
      // ...
    ]
    // ...other routine fields
  }
  ```
- **Possible errors**:
  - **403 Forbidden**: `{ "message": "Authorization header is required" }` — The Authorization header is missing.
  - **403 Forbidden**: `{ "message": "Invalid token" }` — The provided token is invalid or expired.
  - **403 Forbidden**: `{ "message": "User not found" }` — The user associated with the token does not exist.
  - **400 Bad Request**: `{ "message": "At least one field is required to update" }` — No valid fields were provided in the request body.
  - **400 Bad Request**: `{ "message": "Invalid value for series, must be a positive number" }` — The value for `series` is not a positive number.
  - **400 Bad Request**: `{ "message": "Invalid value for repeticiones, must be a positive number" }` — The value for `repeticiones` is not a positive number.
  - **400 Bad Request**: `{ "message": "Invalid value for orden, must be a positive number" }` — The value for `orden` is not a positive number.
  - **400 Bad Request**: `{ "message": "The order number is already assigned to another exercise in the routine." }` — The value for `orden` is already used by another exercise in the routine.
  - **400 Bad Request**: `{ "message": "Invalid value for comentario, must be a string" }` — The value for `comentario` is not a string.
  - **404 Not Found**: `{ "message": "No routines found for the specified user." }` — The routine does not exist or does not belong to the user.
  - **404 Not Found**: `{ "message": "Exercise not found in the specified routine" }` — The exercise does not exist in the routine.
  - **404 Not Found**: `{ "message": "No exercises found for the specified routine." }` — The exercise to update was not found in the routine.
  - **404 Not Found**: `{ "message": "Updated routine not found" }` — The routine could not be retrieved after updating.
  - **500 Internal Server Error**: `{ "message": "Error updating user routine exercise" }` — There was a problem updating the exercise.
  - **500 Internal Server Error**: `{ "message": "Error formatting routine with exercises" }` — There was a problem formatting the updated routine.

>[!NOTE]
>You can update one or more fields. If the `orden` is updated, it must not conflict with another exercise's order in the same routine. When the `orden` is changed, the rest of the exercises are automatically reordered to maintain a continuous ascending order, preserving the intended sequence. The response always returns the full updated routine with all exercises and their current order and fields.

### Generate PDF for a user routine
- **Method**: GET
- **URL**: /api/user-routines/generate/`{userRoutineId}`
- **Headers**: Authorization: `{token}`
- **Body**: ---
- **Response**: On success, returns a PDF file containing the details of the specified user routine. The response headers include:
  - `Content-Type: application/pdf`
  - `Content-Disposition: attachment; filename="user_routine.pdf"`
- **Possible errors**:
  - **401 Unauthorized**: `{ "message": "Authorization header is required" }` — The Authorization header is missing.
  - **401 Unauthorized**: `{ "message": "Invalid token" }` — The provided token is invalid or expired.
  - **403 Forbidden**: `{ "message": "User not found" }` — The user associated with the token does not exist.
  - **404 Not Found**: `{ "message": "Routine not found for the the specified user" }` — The routine does not exist or does not belong to the user.
  - **404 Not Found**: `{ "message": "No exercises found for the specified routine." }` — The routine does not have exercises to export.
  - **500 Internal Server Error**: `{ "message": "Error generating PDF" }` — There was a problem generating the PDF file.
  - **500 Internal Server Error**: `{ "message": "<error message>" }` — An unexpected server error occurred.

> [!NOTE]
> This endpoint generates and returns a PDF with the details of the specified user routine, including exercises and routine metadata. The PDF is formatted with bold labels and normal values for clarity.

## Muscle Groups

### Get all muscle groups
- **Method**: GET
- **URL**: /api/muscle-groups
- **Headers**: None
- **Response**: An array with all the muscle groups
- **Possible errors**:
  - **500 Internal Server Error**: `{ "message": "Error retrieving muscle groups" }` — An unexpected server error occurred.

### Get muscle group by ID
- **Method**: GET
- **URL**: /api/muscle-groups/`{id}`
- **Headers**: None
- **Response**: The muscle group object with the specified ID
- **Possible errors**:
  - **400 Bad Request**: `{ "message": "Invalid ID" }` — The ID is not valid.
  - **404 Not Found**: `{ "message": "Muscle group not found" }` — The muscle group does not exist.
  - **500 Internal Server Error**: `{ "message": "Internal server error" }` — An unexpected server error occurred.

## Difficulties

### Get all difficulties
- **Method**: GET
- **URL**: /api/difficulties
- **Headers**: None
- **Response**: An array with all the difficulties
- **Possible errors**:
  - **500 Internal Server Error**: `{ "message": "Error retrieving difficulties" }` — An unexpected server error occurred.

### Get difficulty by ID
- **Method**: GET
- **URL**: /api/difficulties/`{id}`
- **Headers**: None
- **Response**: The difficulty object with the specified ID
- **Possible errors**:
  - **400 Bad Request**: `{ "message": "Invalid ID" }` — The ID is not valid.
  - **404 Not Found**: `{ "message": "Difficulty not found" }` — The difficulty does not exist.
  - **500 Internal Server Error**: `{ "message": "Internal server error" }` — An unexpected server error occurred.

## Methods

### Get all methods
- **Method**: GET
- **URL**: /api/methods
- **Headers**: None
- **Response**: An array with all the methods
- **Possible errors**:
  - **500 Internal Server Error**: `{ "message": "Error retrieving methods" }` — An unexpected server error occurred.

### Get method by ID
- **Method**: GET
- **URL**: /api/methods/`{id}`
- **Headers**: None
- **Response**: The method object with the specified ID
- **Possible errors**:
  - **400 Bad Request**: `{ "message": "Invalid ID" }` — The ID is not valid.
  - **404 Not Found**: `{ "message": "Method not found" }` — The method does not exist.
  - **500 Internal Server Error**: `{ "message": "Internal server error" }` — An unexpected server error occurred.

## Goals

### Get all goals
- **Method**: GET
- **URL**: /api/goals
- **Headers**: None
- **Response**: An array with all the goals
- **Possible errors**:
  - **500 Internal Server Error**: `{ "message": "Error retrieving goals" }` — An unexpected server error occurred.

### Get goal by ID
- **Method**: GET
- **URL**: /api/goals/`{id}`
- **Headers**: None
- **Response**: The goal object with the specified ID
- **Possible errors**:
  - **400 Bad Request**: `{ "message": "Invalid ID" }` — The ID is not valid.
  - **404 Not Found**: `{ "message": "Goal not found" }` — The goal does not exist.
  - **500 Internal Server Error**: `{ "message": "Internal server error" }` — An unexpected server error occurred.

## Routines

### Get shared routines (excluding those of the logged-in user)
- **Method**: GET
- **URL**: /api/routines/shared?page=1&limit=5
- **Headers**: Authorization: `{token}`
- **Query Parameters**:
  - `page` (number, optional): Page number of the results. Default: 1.
  - `limit` (number, optional): Maximum number of routines per page. Default: 5.
- **Response**: An array of shared routines (not created by the logged-in user), paginated. Each routine has the same structure as in the other routines endpoints, for example:
  ```json
  [
    {
      "rutina_id": 123,
      "nombre": "Routine name",
      "fecha_inicio_rutina": "24-06-2025",
      "fecha_fin_rutina": "30-06-2025",
      "dia": 1,
      "rutina_compartida": true,
      "observaciones": "...",
      "nivel": "Intermedio",
      "metodo_nombre": "Fullbody",
      "tiempo_aerobicos": 10,
      "tiempo_anaerobicos": 20,
      "descanso": 60,
      "metodo_observaciones": "...",
      "ejercicios": [
        {
          "orden": 1,
          "nombre": "Press banca",
          "tipo": "Pecho",
          "step_1": "...",
          "step_2": "...",
          "grupos_musculares": "Pectoral",
          "series": 4,
          "repeticiones": 10,
          "comentario": "..."
        }
        // ...
      ]
    }
    // ...
  ]
  ```
- **Possible errors**:
  - **401 Unauthorized**: `{ "message": "Authorization header is required" }` — The Authorization header is missing.
  - **401 Unauthorized**: `{ "message": "Invalid token" }` — The provided token is invalid or expired.
  - **403 Forbidden**: `{ "message": "User not found" }` — The user associated with the token does not exist.
  - **404 Not Found**: `{ "message": "No shared routines found" }` — No shared routines were found.
  - **500 Internal Server Error**: `{ "message": "Error formatting routine with exercises" }` — There was a problem formatting a routine with its exercises.
  - **500 Internal Server Error**: `{ "message": "<error message>" }` — An unexpected server error occurred.

### Get all routines
- **Method**: GET
- **URL**: /api/routines
- **Headers**: Authorization: `{token}`
- **Response**: An array with all the routines
- **Possible errors**:
  - **401 Unauthorized**: `{ "message": "Authorization header is required" }` — The Authorization header is missing.
  - **401 Unauthorized**: `{ "message": "Invalid token" }` — The provided token is invalid or expired.
  - **500 Internal Server Error**: `{ "message": "Internal server error" }` — An unexpected server error occurred.

### Get routine by ID
- **Method**: GET
- **URL**: /api/routines/rutina/`{id}`
- **Headers**: Authorization: `{token}`
- **Response**: The routine object with the specified ID, including its associated exercises
- **Possible errors**:
  - **401 Unauthorized**: `{ "message": "Authorization header is required" }` — The Authorization header is missing.
  - **401 Unauthorized**: `{ "message": "Invalid token" }` — The provided token is invalid or expired.
  - **404 Not Found**: `{ "message": "Routine not found" }` — The routine does not exist.
  - **500 Internal Server Error**: `{ "message": "Internal server error" }` — An unexpected server error occurred.

### Get routines by goals, difficulty and method
- **Method**: GET
- **URL**: /api/routines/filter?objetivos_id=`{id}`&dificultad_id=`{id}`&metodos_id=`{id}`
- **Headers**: Authorization: `{token}`
- **Query Parameters**:
  - `objetivos_id` (int): The ID of the goal
  - `dificultad_id` (int): The ID of the difficulty
  - `metodos_id` (int): The ID of the method
  - **Response**: An array with the routines matching the specified filters, each including their associated exercises
- **Possible errors**:
  - **401 Unauthorized**: `{ "message": "Authorization header is required" }` — The Authorization header is missing.
  - **401 Unauthorized**: `{ "message": "Invalid token" }` — The provided token is invalid or expired.
  - **404 Not Found**: `{ "message": "No routines found for the given criteria" }` — No routines match the given criteria.
  - **500 Internal Server Error**: `{ "message": "Internal server error" }` — An unexpected server error occurred.

  

## Exercises

### Get all exercises
- **Method**: GET
- **URL**: /api/exercises
- **Headers**: Authorization: `{token}`
- **Response**: An array with all the exercises
- **Possible errors**:
  - **401 Unauthorized**: `{ "message": "Authorization header is required" }` — The Authorization header is missing.
  - **401 Unauthorized**: `{ "message": "Invalid token" }` — The provided token is invalid or expired.
  - **500 Internal Server Error**: `{ "message": "Internal server error" }` — An unexpected server error occurred.

### Get exercises by muscle group and difficulty
- **Method**: GET
- **URL**: /api/exercises/filter?grupos_musculares_id=`{id}`&dificultad_id=`{id}`
- **Headers**: Authorization: `{token}`
- **Query Parameters**:
  - `grupos_musculares_id` (int): The ID of the muscle group
  - `dificultad_id` (int): The ID of the difficulty
- **Response**: An array with the exercises matching the specified muscle group and difficulty
- **Possible errors**:
  - **401 Unauthorized**: `{ "message": "Authorization header is required" }` — The Authorization header is missing.
  - **401 Unauthorized**: `{ "message": "Invalid token" }` — The provided token is invalid or expired.
  - **404 Not Found**: `{ "message": "No exercises found for the given criteria" }` — No exercises match the given criteria.
  - **500 Internal Server Error**: `{ "message": "Internal server error" }` — An unexpected server error occurred.

## Autogenerate Routines

### Generate routine automatically for the logged-in user
- **Method**: POST
- **URL**: /api/autogenerate
- **Headers**: Authorization: `{token}`
- **Body**: None
- **Response**: On success, returns a complete routine object automatically generated for the user based on their objectives and routine history, for example:
  ```json
  {
    "rutina_id": 123,
    "nombre": "Routine name",
    "rutina_observaciones": "Generated routine observations",
    "realizada": 0,
    "metodo": "Fullbody",
    "objetivo": "Strength",
    "dificultad": "Principiante",
    "tiempo_aerobicos": 10,
    "tiempo_anaerobicos": 20,
    "metodo_observaciones": "Method specific observations",
    "descanso": 60,
    "objetivos_id": 1,
    "dificultad_id": 2,
    "metodos_id": 1,
    "ejercicios": [
      {
        "nombre": "Press banca",
        "series": 4,
        "repeticiones": 8,
        "dia": 1,
        "comentario": "Focus on proper form",
        "orden": 1
      },
      {
        "nombre": "Sentadilla",
        "series": 3,
        "repeticiones": 12,
        "dia": 1,
        "comentario": "Control the descent",
        "orden": 2
      }
      // ...more exercises
    ]
  }
  ```
- **Notes**: This endpoint automatically generates a personalized routine for the logged-in user based on:
  - User's defined objectives
  - Previously completed routines
  - Previously suggested routines
  - Available routines that match the user's goals
  
  The system ensures that the suggested routine hasn't been previously assigned to the user. If no suitable routine is found, an error is returned.
- **Possible errors**:
  - **401 Unauthorized**: `{ "message": "Authorization header is required" }` — The Authorization header is missing.
  - **401 Unauthorized**: `{ "message": "Invalid token" }` — The provided token is invalid or expired.
  - **403 Forbidden**: `{ "message": "User not found" }` — The user associated with the token does not exist.
  - **400 Bad Request**: `{ "message": " The user has no defined objectives" }` — The user has no defined objectives.  
  - **500 Internal Server Error**: `{ "message": "Internal server error" }` — An unexpected server error occurred.
