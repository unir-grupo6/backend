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
  - [Recuperar todas las rutinas asignadas a un usuario](#recuperar-todas-las-rutinas-asignadas-a-un-usuario)
  - [Recuperar todas las rutinas con ejercicios asignadas a un usuario](#recuperar-todas-las-rutinas-con-ejercicios-asignadas-a-un-usuario)
  - [Recuperar una rutina asignada a un usuario](#recuperar-una-rutina-asignada-a-un-usuario)
  - [Recuperar todos los ejercicios de una rutina asignada a un usuario](#recuperar-todos-los-ejercicios-de-una-rutina-asignada-a-un-usuario)
  - [Actualizar los datos generales de una rutina asignada a un usuario](#actualizar-los-datos-generales-de-una-rutina-asignada-a-un-usuario)
  - [Guardar rutinas de otros usuarios](#guardar-rutinas-de-otros-usuarios)
  - [Crear rutina para un usuario](#crear-rutina-para-un-usuario)
  - [Eliminar rutina para un usuario](#eliminar-rutina-para-un-usuario)
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
- **Headers**: Authorization: <token>
- **Body**: ---

### Recuperar ejercicio por ID
- **Description**: Recuperar un ejercicio concreto por su ID
- **Method**: GET
- **URL**: /api/exercises/<ejercicioId>
- **Headers**: Authorization: <token>
- **Body**: ---

## Rutinas & rutinas_ejercicios

### Recuperar todas las rutinas
- **Description**: Recuperar todas las rutinas (sin los ejercicios, solo datos generales). Consulta a la tabla `rutinas`
- **Method**: GET
- **URL**: /api/routines/
- **Headers**: Authorization: <token>
- **Body**: ---

### Recuperar rutina por ID
- **Description**: Recuperar una rutina concreta por su ID (sin los ejercicios, solo datos generales). Consulta a la tabla `rutinas`
- **Method**: GET
- **URL**: /api/routines/<rutinaId>
- **Headers**: Authorization: <token>
- **Body**: ---

### Recuperar rutinas con ejercicios
- **Description**: Recuperar todas las rutinas con sus ejercicios. Consulta a la tabla `rutinas` con `rutina_ejercicios`
- **Method**: GET
- **URL**: /api/routines/exercises/
- **Headers**: Authorization: <token>
- **Body**: ---

### Recuperar rutinas con ejercicios por ID
- **Description**: Recuperar una rutina con sus ejercicios por su ID. Consulta a la tabla `rutinas` con `rutina_ejercicios`
- **Method**: GET
- **URL**: /api/routines/<routineId>/exercises
- **Headers**: Authorization: <token>
- **Body**: ---

### Actualizar los datos generales de una rutina
- **Description**: Actualizar los datos genrales de una rutina por su ID. Actualizar la tabla `rutinas`
- **Method**: PUT
- **URL**: /api/routines/<rutinaId>
- **Headers**: Authorization: <token>
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
- **Headers**: Authorization: <token>
- **Body**: 
  - `dificultad_id`
  - `metodos_id`
  - `nombre`
  - `observaciones`
  - `...` (lo que se considere)

### Añadir nuevos ejercicios a una rutina
- **Description**: Añadir ejercicios a una rutina mediante el ID de la rutina. Insert a la tabla `rutina_ejercicios`
- **Method**: POST
- **URL**: /api/routines/<routineId>/exercises
- **Headers**: Authorization: <token>
- **Body**: 
  - `ejercicios_id`
  - `rutinas_id`
  - `series`
  - `repeticiones`
  - `...` (lo que se considere)

## Rutinas & usuarios

### Recuperar todas las rutinas asignadas a un usuario
- **Description**: Recuperar todas las rutinas (sin los ejercicios, solo datos generales) asignadas a un usuario. Consulta a la tabla `rutinas_usuarios`
- **Method**: GET
- **URL**: /api/users/<userId>/routines
- **Headers**: Authorization: <token>
- **Body**: ---

### Recuperar todas las rutinas con ejercicios asignadas a un usuario
- **Description**: Recuperar todas las rutinas y ejercicios asignadas a un usuario. Consulta a las tablas `rutinas_usuarios`, `rutinas`, y `rutina_ejercicios`
- **Method**: GET
- **URL**: /api/users/<userId>/routines/exercises
- **Headers**: Authorization: <token>
- **Body**: ---

### Recuperar una rutina asignada a un usuario
- **Description**: Recuperar una rutina concreta asignada a un usuario. Realiza un INNER JOIN entre las tablas `rutinas_usuarios` y `rutinas`
- **Method**: GET
- **URL**: /api/users/<userId>/routines/<routineId>
- **Headers**: Authorization: <token>
- **Body**: ---

### Recuperar todos los ejercicios de una rutina asignada a un usuario
- **Description**: Recuperar todos los ejercicios de una rutina concreta asignada a un usuario. Realiza un inner join entre `rutinas_usuarios` y `rutina_ejercicios` para obtener todos los ejercicios de la rutina del usuario.
- **Method**: GET
- **URL**: /api/users/<userId>/routines/<routineId>/exercises
- **Headers**: Authorization: <token>
- **Body**: ---

### Actualizar los datos generales de una rutina asignada a un usuario
- **Description**: Actualizar los datos generales de una rutina asignada a un usuario. Actualizar la tabla `rutinas_usuarios`
- **Method**: PATCH (solo actualizará los campos que cambien. Si por ejemplo el campo `compartida` no va a cambiar de valor, lo detecta y no lo actualiza en la BBDD)
- **URL**: /api/users/<userId>/routines/<routineId>
- **Headers**: Authorization: <token>
- **Body**: 
  - `inicio` (date)
  - `fin` (date)
  - `compartida` (number, 0 o 1)

### Guardar rutinas de otros usuarios
- **Description**: Guardar rutinas de otros usuarios. Duplicar la fila de `rutinas_usuarios` cambiando el id user y dejando fecha inicio y fecha fin en blanco. Más adelante el usuario que guarde la rutina podrá actualizar estos campos
- **Method**: POST
- **URL**: /api/users/<userId>/routines/<routineId>/copy (_aclararlo_)
- **Headers**: Authorization: <token>
- **Body**: (_aclararlo_)

### Crear rutina para un usuario
- **Description**: Crear rutina para un usuario
- **Method**: POST
- **URL**: /api/users/<userId>/routines
- **Headers**: Authorization: <token>
- **Body**: (_aclararlo_)

### Eliminar rutina para un usuario
- **Description**: Eliminar rutina para un usuario
- **Method**: DELETE
- **URL**: /api/users/<userId>/routines/<routineId>
- **Headers**: Authorization: <token>
- **Body**: (_aclararlo_)

## Objetivos

### Recuperar todos los objetivos
- **Description**: Recuperar todos los objetivos
- **Method**: GET
- **URL**: /api/goals
- **Headers**: Authorization: <token>
- **Body**: ---

## Métodos

### Recuperar todos los métodos
- **Description**: Recuperar todos los métodos
- **Method**: GET
- **URL**: /api/methods
- **Headers**: Authorization: <token>
- **Body**: ---

## Dificultad

### Recuperar todas las dificultades
- **Description**: Recuperar todas las dificultades
- **Method**: GET
- **URL**: /api/difficulties
- **Headers**: Authorization: <token>
- **Body**: ---

## Grupos musculares

### Recuperar todos los grupos musculares
- **Description**: Recuperar todos los grupos musculares
- **Method**: GET
- **URL**: /api/muscle-groups
- **Headers**: Authorization: <token>
- **Body**: ---
