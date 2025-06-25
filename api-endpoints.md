# API Endpoints

## Users

### Registration
- **Method**: POST
- **URL**: /api/users/register
- **Headers**: Content-Type: application/json
- **Body**: 
  - `nombre` (string, required)
  - `apellidos` (string, required)
  - `nombre` (string, required)
  - `apellidos` (string, required)
  - `email` (string, required)
  - `password` (string, required)
  - `sexo` (string, required)
- **Response**: The created user object
- **Possible errors**:
  - **400 Bad Request**: `{ "message": "Failed to update reset token" }` — There was a problem updating the reset token (rare, internal error).
  - **403 Forbidden**: `{ "message": "Email already exists" }` — The email is already registered in the system.
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
  - `password` (string, required): The new password to set
- **Response**: On success:
  ```json
  { "message": "Password updated successfully" }
  ```
- **Possible errors**:
  - **400 Bad Request**: `{ "message": "Password is required" }` — The password field is missing.
  - **401 Unauthorized**: `{ "message": "Authorization header is required" }` — The Authorization header is missing.
  - **401 Unauthorized**: `{ "message": "Invalid token" }` — The provided token is invalid or expired.
  - **403 Forbidden**: `{ "message": "User not found" }` — The user associated with the token does not exist.
  - **500 Internal Server Error**: `{ "message": "Error updating password" }` — There was a problem updating the password in the database.
  - **404 Not Found**: `{ "message": "Not found" }` — The endpoint does not exist.
  - **500 Internal Server Error**: `{ "message": "<error message>" }` — An unexpected server error occurred.

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
  - **403 Forbidden**: `{ "message": "Reset token and new password are required" }` — The reset token or new password was not provided.
  - **403 Forbidden**: `{ "message": "User not found" }` — No user is associated with the provided reset token.
  - **403 Forbidden**: `{ "message": "<jwt error message>" }` — The reset token is invalid or expired.
  - **400 Bad Request**: `{ "message": "Failed to reset password" }` — There was a problem updating the password in the database.
  - **404 Not Found**: `{ "message": "Not found" }` — The endpoint does not exist.
  - **500 Internal Server Error**: `{ "message": "<error message>" }` — An unexpected server error occurred.

### Get logged-in user information
- **Method**: GET
- **URL**: /api/users
- **Headers**: Authorization: `{token}`
- **Body**: ---
- **Response**: The logged-in user object
- **Possible errors**:
  - **401 Unauthorized**: `{ "message": "Authorization header is required" }` — The Authorization header is missing.
  - **401 Unauthorized**: `{ "message": "Invalid token" }` — The provided token is invalid or expired.
  - **403 Forbidden**: `{ "message": "User not found" }` — The user associated with the token does not exist.
  - **404 Not Found**: `{ "message": "Not found" }` — The endpoint does not exist.
  - **500 Internal Server Error**: `{ "message": "Internal server error" }` — An unexpected server error occurred.


### Get logged-in user's routines (paginated)
- **Method**: GET
- **URL**: /api/users/routines?page=1&limit=10&active=true
- **Headers**: Authorization: `{token}`
- **Body**: ---
- **Query Parameters**:
  - `page` (number, optional): Page number of the results. Default: 1.
  - `limit` (number, optional): Maximum number of routines per page. Default: 5.
  - `active` (boolean, optional): If `true`, only returns active routines (for the current date). If `false` or not specified, returns all routines for the user. Default: `false`.
- **Response**: User object with the routines belonging to the authenticated user (paginated, optionally only active routines)
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
- **URL**: /api/users/routines/{routineId}
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
- **URL**: /api/users/routines/{userRoutineId}/save
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

### Delete a user routine
- **Method**: DELETE
- **URL**: /api/users/routines/{userRoutineId}
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



## Basic Gets

### Get all methods
- **Method**: GET
- **URL**: /api/methods
- **Headers**: None
- **Response**: An array with all the methods
- **Possible errors**:
  - **500 Internal Server Error**: `{ "message": "Error retrieving methods" }` — An unexpected server error occurred.

### Get method by ID
- **Method**: GET
- **URL**: /api/methods/{id}
- **Headers**: None
- **Response**: The method object with the specified ID
- **Possible errors**:
  - **400 Bad Request**: `{ "message": "Invalid ID" }` — The ID is not valid.
  - **404 Not Found**: `{ "message": "Method not found" }` — The method does not exist.
  - **500 Internal Server Error**: `{ "message": "Internal server error" }` — An unexpected server error occurred.

### Get all difficulties
- **Method**: GET
- **URL**: /api/difficulties
- **Headers**: None
- **Response**: An array with all the difficulties
- **Possible errors**:
  - **500 Internal Server Error**: `{ "message": "Error retrieving difficulties" }` — An unexpected server error occurred.

### Get difficulty by ID
- **Method**: GET
- **URL**: /api/difficulties/{id}
- **Headers**: None
- **Response**: The difficulty object with the specified ID
- **Possible errors**:
  - **400 Bad Request**: `{ "message": "Invalid ID" }` — The ID is not valid.
  - **404 Not Found**: `{ "message": "Difficulty not found" }` — The difficulty does not exist.
  - **500 Internal Server Error**: `{ "message": "Internal server error" }` — An unexpected server error occurred.

### Get all muscle groups
- **Method**: GET
- **URL**: /api/muscle-groups
- **Headers**: None
- **Response**: An array with all the muscle groups
- **Possible errors**:
  - **500 Internal Server Error**: `{ "message": "Error retrieving muscle groups" }` — An unexpected server error occurred.

### Get muscle group by ID
- **Method**: GET
- **URL**: /api/muscle-groups/{id}
- **Headers**: None
- **Response**: The muscle group object with the specified ID
- **Possible errors**:
  - **400 Bad Request**: `{ "message": "Invalid ID" }` — The ID is not valid.
  - **404 Not Found**: `{ "message": "Muscle group not found" }` — The muscle group does not exist.
  - **500 Internal Server Error**: `{ "message": "Internal server error" }` — An unexpected server error occurred.