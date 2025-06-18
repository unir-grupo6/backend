# API Endpoints

## Users

### Get all users
- **Method**: GET
- **URL**: /api/users
- **Headers**: Authorization: <token>
- **Body**: ---
- **Response**: An array with all the users
- **Possible errors**:
  - **401 Unauthorized**: `{ "message": "Authorization header is required" }` — The Authorization header is missing.
  - **401 Unauthorized**: `{ "message": "Invalid token" }` — The provided token is invalid or expired.
  - **403 Forbidden**: `{ "message": "User not found" }` — The user associated with the token does not exist.
  - **404 Not Found**: `{ "message": "Not found" }` — The endpoint does not exist.
  - **500 Internal Server Error**: `{ "message": "<error message>" }` — An unexpected server error occurred.

### Registration
- **Method**: POST
- **URL**: /api/users/register
- **Headers**: Content-Type: application/json
- **Body**: 
  - `username` (string, required)
  - `email` (string, required)
  - `password` (string, required)
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