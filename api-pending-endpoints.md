# API Endpoints to create

## Índice
- Catálogo de ejercicios
  - [Recuperar todos los ejercicios](#recuperar-todos-los-ejercicios)
  - [Recuperar ejercicio por ID](#recuperar-ejercicio-por-id)
- Rutinas & rutinas_ejercicios
  - [Recuperar todas las rutinas](#recuperar-todas-las-rutinas)
  - [Recuperar rutina por ID](#recuperar-rutina-por-id)
  - [Recuperar rutinas con ejercicios](#recuperar-rutinas-con-ejercicios)
  - [Recuperar rutinas con ejercicios por ID](#recuperar-rutinas-con-ejercicios-por-id)
  - [Actualizar los datos generales de una rutina](#actualizar-los-datos-generales-de-una-rutina)
  - [Añadir nueva rutina](#añadir-nueva-rutina)
  - [Añadir nuevos ejercicios a una rutina](#añadir-nuevos-ejercicios-a-una-rutina)
- Rutinas & usuarios
  - [Crear rutina para un usuario](#crear-rutina-para-un-usuario)
  - [Añadir ejercicios a la rutina de un usuario](#añadir-ejercicios-a-la-rutina-de-un-usuario)
- Objetivos
  - [Recuperar todos los objetivos](#recuperar-todos-los-objetivos)
- Métodos
  - [Recuperar todos los métodos](#recuperar-todos-los-métodos)
- Dificultad
  - [Recuperar todas las dificultades](#recuperar-todas-las-dificultades)
- Grupos musculares
  - [Recuperar todos los grupos musculares](#recuperar-todos-los-grupos-musculares)

## Catálogo de ejercicios

### Recuperar todos los ejercicios
- **Description**: Recuperar todos los ejercicios
- **Method**: GET
- **URL**: /api/exercises
- **Headers**: Authorization: {token}
- **Body**: ---

### Recuperar ejercicio por ID
- **Description**: Recuperar un ejercicio concreto por su ID
- **Method**: GET
- **URL**: /api/exercises/{ejercicioId}
- **Headers**: Authorization: {token}
- **Body**: ---

### Obtener ejercicios relacionados con un objetivo
- **Description**: Lista todos los ejercicios asociados indirectamente a un objetivo, a través de las rutinas y métodos de entrenamiento.
- **Method**: GET
- **URL**: /api/exercises/goal/{goalId}
- **Headers**: Authorization: {token}
- **Body**: ---


## Rutinas & rutinas_ejercicios

### Recuperar todas las rutinas
- **Description**: Recuperar todas las rutinas (sin los ejercicios, solo datos generales). Consulta a la tabla `rutinas`
- **Method**: GET
- **URL**: /api/routines/
- **Headers**: Authorization: {token}
- **Body**: ---

### Recuperar rutina por ID
- **Description**: Recuperar una rutina concreta por su ID (sin los ejercicios, solo datos generales). Consulta a la tabla `rutinas`
- **Method**: GET
- **URL**: /api/routines/{rutinaId}
- **Headers**: Authorization: {token}
- **Body**: ---

### Recuperar rutinas con ejercicios
- **Description**: Recuperar todas las rutinas con sus ejercicios. Consulta a la tabla `rutinas` con `rutina_ejercicios`
- **Method**: GET
- **URL**: /api/routines/exercises/
- **Headers**: Authorization: {token}
- **Body**: ---

### Obtener rutinas asociadas a un objetivo
- **Description**: Devuelve todas las rutinas diseñadas para alcanzar un objetivo específico.
- **Method**: GET
- **URL**: /api/routines/goal/{goalId}
- **Headers**: Authorization: {token}
- **Body**: ---

### Recuperar rutinas con ejercicios por ID
- **Description**: Recuperar una rutina con sus ejercicios por su ID. Consulta a la tabla `rutinas` con `rutina_ejercicios`
- **Method**: GET
- **URL**: /api/routines/{routineId}/exercises
- **Headers**: Authorization: {token}
- **Body**: ---

### Actualizar los datos generales de una rutina
- **Description**: Actualizar los datos genrales de una rutina por su ID. Actualizar la tabla `rutinas`
- **Method**: PUT
- **URL**: /api/routines/{rutinaId}
- **Headers**: Authorization: {token}
- **Body**:
  - `dificultad_id`
  - `metodos_id`
  - `nombre`
  - `observaciones`
  - `...` (lo que se considere)

### Añadir nueva rutina
- **Description**: Añadir nueva rutina. Insert a la tabla `rutinas`
- **Method**: POST
- **URL**: /api/routines/
- **Headers**: Authorization: {token}
- **Body**: 
  - `dificultad_id`
  - `metodos_id`
  - `nombre`
  - `observaciones`
  - `...` (lo que se considere)

### Añadir nuevos ejercicios a una rutina
- **Description**: Añadir ejercicios a una rutina mediante el ID de la rutina. Insert a la tabla `rutina_ejercicios`
- **Method**: POST
- **URL**: /api/routines/{routineId}/exercises
- **Headers**: Authorization: {token}
- **Body**: 
  - `ejercicios_id`
  - `rutinas_id`
  - `series`
  - `repeticiones`
  - `...` (lo que se considere)

## Rutinas & usuarios

### Crear rutina para un usuario
- **Description**: Crear rutina para un usuario
- **Method**: POST
- **URL**: /api/users/{userId}/routines
- **Headers**: Authorization: {token}
- **Body**: (_aclararlo_)

### Añadir ejercicios a la rutina de un usuario
- **Description**: Insertar ejercicio en ejercicios_usuarios que esté asociado a la rutina indicada
- **Method**: POST
- **URL**: (_aclararlo_)
- **Headers**: Authorization: {token}
- **Body**: (_aclararlo_)

## Objetivos

### Recuperar todos los objetivos
- **Description**: Recuperar todos los objetivos
- **Method**: GET
- **URL**: /api/goals
- **Headers**: Authorization: {token}
- **Body**: ---

### Obtener objetivo por ID
- **Description**: Recuperar los datos de un objetivo específico usando su ID.
- **Method**: GET
- **URL**: /api/goals/{id}
- **Headers**: Authorization: {token}
- **Body**: ---


### Actualizar un objetivo
- **Description**: Editar un objetivo existente
- **Method**: PUT
- **URL**: /api/goals/{id}
- **Headers**: Authorization: {token}
- **Body**:


## Métodos

### Recuperar todos los métodos
- **Description**: Recuperar todos los métodos
- **Method**: GET
- **URL**: /api/methods
- **Headers**: Authorization: {token}
- **Body**: ---

### Obtener método de entrenamiento por objetivo
- **Description**: Dado un objetivo específico, obtener el método de entrenamiento asociado.
- **Method**: GET
- **URL**: /api/methods/goal/{goalId}
- **Headers**: Authorization: {token}
- **Body**


## Dificultad

### Recuperar todas las dificultades
- **Description**: Recuperar todas las dificultades
- **Method**: GET
- **URL**: /api/difficulties
- **Headers**: Authorization: {token}
- **Body**: ---

## Grupos musculares

### Recuperar todos los grupos musculares
- **Description**: Recuperar todos los grupos musculares
- **Method**: GET
- **URL**: /api/muscle-groups
- **Headers**: Authorization: {token}
- **Body**: ---
