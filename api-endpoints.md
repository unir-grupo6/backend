# API Endpoints

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
  - `fecha_nacimiento` (string, required, format: YYYY-MM-DD): New birth date
  - `peso` (number, optional): New weight
  - `altura` (number, optional): New height
- **Response**: On success, returns the updated user object
- **Possible errors**:
  - **401 Unauthorized**: `{ "message": "Authorization header is required" }` — The Authorization header is missing.
  - **401 Unauthorized**: `{ "message": "Invalid token" }` — The provided token is invalid or expired.
  - **403 Forbidden**: `{ "message": "User not found" }` — The user associated with the token does not exist.
  - **400 Bad Request**: `{ "message": "Nombre, apellidos, email, and fecha_nacimiento are required" }` — One or more required fields are missing in the request body.
  - **400 Bad Request**: `{ "message": "Peso must be a number" }` — The value for `peso` is not a number.
  - **400 Bad Request**: `{ "message": "Altura must be a number" }` — The value for `altura` is not a number.
  - **400 Bad Request**: `{ "message": "Fecha de nacimiento must be a valid date" }` — The value for `fecha_nacimiento` is not a valid date.
  - **400 Bad Request**: `{ "message": "Failed to update user data" }` — There was a problem updating the user data in the database.
  - **400 Bad Request**: `{ "message": "Failed to update user metrics" }` — There was a problem updating the user metrics in the database.
  - **400 Bad Request**: `{ "message": "Failed to insert new user metrics" }` — There was a problem inserting new user metrics in the database.
  - **403 Forbidden**: `{ "message": "Email already exists" }` — The new email is already registered in the system.
  - **404 Not Found**: `{ "message": "Not found" }` — The endpoint does not exist.
  - **500 Internal Server Error**: `{ "message": "Error updating user" }` — There was a problem updating the user in the database.
  - **500 Internal Server Error**: `{ "message": "<error message>" }` — An unexpected server error occurred.
- **Notes**: All fields except `peso` and `altura` are required. The response always returns the updated user object. If `peso` and/or `altura` are provided, user metrics are updated or inserted for the current day. All validations are applied to the provided fields.

### Registration
- **Method**: POST
- **URL**: /api/users/register
- **Headers**: Content-Type: application/json
- **Body**: 
  - `nombre` (string, required)
  - `apellidos` (string, required)
  - `email` (string, required)
  - `password` (string, required)
  - `sexo` (number, required)
    - 1: Hombre
    - 2: Mujer
    - 3: Otro / Prefiero no responder
  - `fecha_nacimiento` (string, required, format: YYYY-MM-DD)
  - `peso` (number, required)
  - `altura` (number, required)
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
- **Headers**: reset-token: <token>, Content-Type: application/json
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
- **URL**: /api/methods/{id}
- **Headers**: None
- **Response**: The method object with the specified ID
- **Possible errors**:
  - **400 Bad Request**: `{ "message": "Invalid ID" }` — The ID is not valid.
  - **404 Not Found**: `{ "message": "Method not found" }` — The method does not exist.
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
- **URL**: /api/difficulties/{id}
- **Headers**: None
- **Response**: The difficulty object with the specified ID
- **Possible errors**:
  - **400 Bad Request**: `{ "message": "Invalid ID" }` — The ID is not valid.
  - **404 Not Found**: `{ "message": "Difficulty not found" }` — The difficulty does not exist.
  - **500 Internal Server Error**: `{ "message": "Internal server error" }` — An unexpected server error occurred.

## Muscle groups

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
- **URL**: /api/goals/{id}
- **Headers**: None
- **Response**: The goal object with the specified ID
- **Possible errors**:
  - **400 Bad Request**: `{ "message": "Invalid ID" }` — The ID is not valid.
  - **404 Not Found**: `{ "message": "Goal not found" }` — The goal does not exist.
  - **500 Internal Server Error**: `{ "message": "Internal server error" }` — An unexpected server error occurred.

    ## Exercises

    ### Get all exercises
    - **Method**: GET
    - **URL**: /api/exercises
    - **Headers**: None
    - **Response**: An array with all the exercises
    - **Possible errors**:
      - **500 Internal Server Error**: `{ "message": "Error retrieving exercises" }` — An unexpected server error occurred.

      ### Get exercises by muscle group and difficulty
      - **Method**: GET
      - **URL**: /api/exercises/filter?grupos_musculares_id=?&dificultad_id=?
      - **Headers**: None
      - **Query Parameters**:
        - `grupos_musculares_id` (int, required): The ID of the muscle group
        - `dificultad_id` (int, required): The ID of the difficulty
      - **Response**: An array with the exercises matching the specified muscle group and difficulty
      - **Possible errors**:
        - **400 Bad Request**: `{ "message": "muscleGroupId and difficultyId are required" }` — One or both query parameters are missing.
        - **404 Not Found**: `{ "message": "No exercises found for the given criteria" }` — No exercises match the given criteria.
        - **500 Internal Server Error**: `{ "message": "Internal server error" }` — An unexpected server error occurred.