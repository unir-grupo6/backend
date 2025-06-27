const db = require('../config/db');

const getById = async (userId) => {
    const [result] = await db.query(
        `
            SELECT U.id, U.nombre, U.apellidos, U.email, U.fecha_nacimiento, U.fecha_alta, MU.peso, MU.altura, MU.imc, O.id AS objetivo_id, O.nombre AS objetivo
            FROM usuarios U
            LEFT JOIN medidas_usuarios MU ON U.id = MU.id_usuario
            LEFT JOIN objetivos_usuarios OU ON OU.id_usuarios = U.id
            LEFT JOIN objetivos O ON OU.id_objetivos = O.id
            LEFT JOIN objetivos_usuarios OU2 ON OU2.id_usuarios = OU.id_usuarios AND OU2.fecha > OU.fecha
            WHERE U.id = ? AND OU2.id IS NULL
            ORDER BY MU.fecha DESC
            LIMIT 1;
        `,
        [userId],
    );
    if (result.length === 0) return null;
    return result[0];
}

const getByEmail = async (email) => {
    const [result] = await db.query(
        'SELECT id, email, password FROM usuarios WHERE email = ?',
        [email]
    );
    if (result.length === 0) return null;
    return result[0];
}

const getByResetToken = async (resetToken) => {
    const [result] = await db.query(
        'SELECT id FROM usuarios WHERE reset_token = ?',
        [resetToken]
    );
    if (result.length === 0) return null;
    return result[0];
}

const selectUserRoutineById = async (id_user_routine) => {
    const [result] = await db.query(
        'SELECT id, rutinas_id, usuarios_id, inicio, fin, compartida FROM rutinas_usuarios WHERE id = ? LIMIT 1',
        [id_user_routine]
    );
    if (result.length === 0) return null;
    return result[0];
}

const selectRoutinesByUserId = async (userId, page, limit) => {
    const [result] = await db.query(
        `
        SELECT RU.id as rutina_id, R.nombre, 
		    RU.inicio as fecha_inicio_rutina, RU.fin as fecha_fin_rutina, R.dia, RU.compartida as rutina_compartida,
            R.observaciones as rutina_observaciones, R.sexo, D.nivel,
            M.nombre as metodo_nombre, M.tiempo_aerobicos, M.tiempo_anaerobicos, M.descanso, M.observaciones as metodo_observaciones
        FROM usuarios U
            INNER JOIN rutinas_usuarios RU ON U.id = RU.usuarios_id
            INNER JOIN rutinas R ON R.id = RU.rutinas_id
            INNER JOIN metodos M ON M.id = R.metodos_id
            INNER JOIN dificultad D ON D.id = R.dificultad_id
        WHERE U.id = ?
        LIMIT ? OFFSET ?
        `,
        [userId, limit, (page - 1) * limit]
    );
    return result;
}

const selectUserRoutineByIdUserId = async (user_id, id_user_routine) => {
    const [result] = await db.query(
        'SELECT id, rutinas_id, usuarios_id, inicio, fin, compartida FROM rutinas_usuarios WHERE id = ? AND usuarios_id = ? LIMIT 1',
        [id_user_routine, user_id]
    );
    if (result.length === 0) return null;
    return result[0];
}

const selectActiveRoutinesByUserId = async (userId, page, limit) => {
    const [result] = await db.query(
        `
        SELECT RU.id as rutina_id, R.nombre, 
		    RU.inicio as fecha_inicio_rutina, RU.fin as fecha_fin_rutina, R.dia, RU.compartida as rutina_compartida,
            R.observaciones as rutina_observaciones, R.sexo, D.nivel,
            M.nombre as metodo_nombre, M.tiempo_aerobicos, M.tiempo_anaerobicos, M.descanso, M.observaciones as metodo_observaciones
        FROM usuarios U
            INNER JOIN rutinas_usuarios RU ON U.id = RU.usuarios_id
            INNER JOIN rutinas R ON R.id = RU.rutinas_id
            INNER JOIN metodos M ON M.id = R.metodos_id
            INNER JOIN dificultad D ON D.id = R.dificultad_id
        WHERE U.id = ? AND (RU.inicio <= CURDATE() AND (RU.fin IS NULL OR RU.fin >= CURDATE()))
        LIMIT ? OFFSET ?
        `,
        [userId, limit, (page - 1) * limit]
    );
    return result;
}

const selectRoutineByRoutineId = async (routineId) => {
    const [result] = await db.query(
        `
        SELECT RU.id as rutina_id, R.nombre, 
            RU.inicio as fecha_inicio_rutina, RU.fin as fecha_fin_rutina, R.dia, RU.compartida as rutina_compartida,
            R.observaciones as rutina_observaciones, R.sexo, D.nivel
            ,M.nombre as metodo_nombre, M.tiempo_aerobicos, M.tiempo_anaerobicos, M.descanso, M.observaciones as metodo_observaciones
        FROM rutinas_usuarios RU
            INNER JOIN rutinas R ON R.id = RU.rutinas_id
            INNER JOIN metodos M ON M.id = R.metodos_id
            INNER JOIN dificultad D ON D.id = R.dificultad_id
        WHERE RU.id = ?
        `,
        [routineId]
    );
    return result[0];
}

const selectRoutineByUserIdRoutineId = async (userId, routineId) => {
    const [result] = await db.query(
        `
        SELECT RU.id as rutina_id, R.nombre, 
            RU.inicio as fecha_inicio_rutina, RU.fin as fecha_fin_rutina, R.dia, RU.compartida as rutina_compartida,
            R.observaciones as rutina_observaciones, R.sexo, D.nivel
            ,M.nombre as metodo_nombre, M.tiempo_aerobicos, M.tiempo_anaerobicos, M.descanso, M.observaciones as metodo_observaciones
        FROM usuarios U
            INNER JOIN rutinas_usuarios RU ON U.id = RU.usuarios_id
            INNER JOIN rutinas R ON R.id = RU.rutinas_id
            INNER JOIN metodos M ON M.id = R.metodos_id
            INNER JOIN dificultad D ON D.id = R.dificultad_id
        WHERE U.id = ? and RU.id = ?
        `,
        [userId, routineId]
    );
    return result[0];
}

const selectExercisesByUserRoutineId = async (routineId) => {
    const [result] = await db.query(
        `
        SELECT EU.id, EU.rutinas_id, EU.ejercicios_id, EU.rutinas_usuarios_id, EU.dia,
            EU.orden, E.nombre, E.tipo, E.inicio as step_1, E.fin as step_2, GM.nombre as grupos_musculares,
            EU.series, EU.repeticiones, EU.comentario
        FROM ejercicios_usuarios EU
                INNER JOIN ejercicios E ON E.id = EU.ejercicios_id
                INNER JOIN grupos_musculares GM ON GM.id = E.grupos_musculares_id
        WHERE EU.rutinas_usuarios_id = ?
        ORDER BY EU.orden ASC
        `,
        [routineId]
    );
    return result;
}

const selectExerciseById = async (exerciseId) => {
    const [result] = await db.query(
        `
        SELECT E.id, E.nombre, E.tipo, E.inicio as step_1, E.fin as step_2, GM.nombre as grupos_musculares
        FROM ejercicios E
            INNER JOIN grupos_musculares GM ON GM.id = E.grupos_musculares_id
        WHERE E.id = ?
        `,
        [exerciseId]
    );
    if (result.length === 0) return null;
    return result[0];
}

const selectUserExerciseById = async (exerciseId, userRoutineId) => {
    const [result] = await db.query(
        `
        SELECT EU.id, EU.ejercicios_id, EU.rutinas_usuarios_id,
            EU.orden, E.nombre, E.tipo, E.inicio as step_1, E.fin as step_2, GM.nombre as grupos_musculares,
            EU.series, EU.repeticiones, EU.comentario
        FROM ejercicios_usuarios EU
                INNER JOIN ejercicios E ON E.id = EU.ejercicios_id
                INNER JOIN grupos_musculares GM ON GM.id = E.grupos_musculares_id
        WHERE EU.id = ? AND EU.rutinas_usuarios_id = ?
        `,
        [exerciseId, userRoutineId]
    );
    if (result.length === 0) return null;
    return result[0];
}

const insertUser = async ({ nombre, apellidos, email, password, sexo, fecha_nacimiento }) => {
    const [result] = await db.query(
        'INSERT INTO usuarios (nombre, apellidos, email, password, fecha_alta, sexo, fecha_nacimiento) VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP, ?, ?)',
        [nombre, apellidos, email, password, sexo, fecha_nacimiento]
    );
    return result;
}

const insertUserMetrics = async (userId, peso, altura, imc) => {
    const [result] = await db.query(
        'INSERT INTO medidas_usuarios (id_usuario, peso, altura, imc, fecha) VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP)',
        [userId, peso, altura, imc]
    );
    return result;
}

const insertUserObjective = async (userId, objectiveId) => {
    const [result] = await db.query(
        'INSERT INTO objetivos_usuarios (id_usuarios, id_objetivos, fecha) VALUES (?, ?, CURRENT_TIMESTAMP)',
        [userId, objectiveId]
    );
    return result;
}

const updateUserMetrics = async (userId, peso, altura, imc) => {
    const [result] = await db.query(
        'UPDATE medidas_usuarios SET peso = ?, altura = ?, imc = ?, fecha = CURRENT_TIMESTAMP WHERE id_usuario = ? ORDER BY fecha DESC LIMIT 1',
        [peso, altura, imc, userId]
    );
    return result;
}

const updateRoutineById = async (userRoutineId, fields) => {
    const keys = Object.keys(fields);
    const values = Object.values(fields);

    const setClause = keys.map((key, index) => `${key} = ?`).join(', ');
    const query = `UPDATE rutinas_usuarios SET ${setClause} WHERE id = ?`;

    const [result] = await db.query(
        query,
        [...values, userRoutineId]
    );
    return result;
}

const updateUserRoutineExerciseById = async (exerciseId, userRoutineId, fields) => {
    const keys = Object.keys(fields);
    const values = Object.values(fields);

    const setClause = keys.map((key, index) => `${key} = ?`).join(', ');
    const query = `UPDATE ejercicios_usuarios SET ${setClause} WHERE id = ? AND rutinas_usuarios_id = ?`;

    const [result] = await db.query(
        query,
        [...values, exerciseId, userRoutineId]
    );
    return result;
}

const updatePassword = async (userId, newPassword) => {
    const [result] = await db.query(
        'UPDATE usuarios SET password = ? WHERE id = ?',
        [newPassword, userId]
    );
    return result;
}

const updateResetToken = async (userId, resetToken) => {
    const [result] = await db.query(
        'UPDATE usuarios SET reset_token = ? WHERE id = ?',
        [resetToken, userId]
    );
    return result;
}

const updateExerciseOrder = async (exerciseId, userRoutineId, newOrder) => {
    const [result] = await db.query(
        'UPDATE ejercicios_usuarios SET orden = ? WHERE id = ? AND rutinas_usuarios_id = ?',
        [newOrder, exerciseId, userRoutineId]
    );
    return result;
}

const insertUserRoutine = async (routineId, user_id) => {
    const [result] = await db.query(
        'INSERT INTO rutinas_usuarios (rutinas_id, usuarios_id, compartida) VALUES (?, ?, 0);',
        [routineId, user_id]
    );
    return result;
}

const insertUserRoutineExercise = async (exercise_id, user_routine_id, series, repetitions, order, comment) => {
    const [result] = await db.query(
        `
        INSERT INTO ejercicios_usuarios (ejercicios_id, rutinas_usuarios_id, orden, series, repeticiones, comentario)
        VALUES (?, ?, ?, ?, ?, ?)
        `,
        [exercise_id, user_routine_id, order, series, repetitions, comment]
    );
    return result;
}

const deleteUserRoutine = async (userRoutineId) => {
    const [result] = await db.query(
        'DELETE FROM rutinas_usuarios WHERE id = ?',
        [userRoutineId]
    );
    return result;
}

const deleteUserRoutineExercise = async (exerciseId) => {
    const [result] = await db.query(
        'DELETE FROM ejercicios_usuarios WHERE id = ?',
        [exerciseId]
    );
    return result;
}

const updateUserData = async (userId, { nombre, apellidos, email, fecha_nacimiento }) => {
    const [result] = await db.query(
        'UPDATE usuarios SET nombre = ?, apellidos = ?, email = ?, fecha_nacimiento = ? WHERE id = ?',
        [nombre, apellidos, email, fecha_nacimiento, userId]
    );
    return result;
}

const getUserMetrics = async (userId) => {
    const [result] = await db.query(
        `
        SELECT peso, altura, imc, CAST(fecha AS DATE) as fecha
        FROM medidas_usuarios
        WHERE id_usuario = ?
        ORDER BY fecha DESC
        LIMIT 1;
        `,
        [userId]
    );
    return result[0] || {};
}

module.exports = {
    getById,
    getByEmail,
    getByResetToken,
    selectUserRoutineById,
    selectRoutinesByUserId,
    selectUserRoutineByIdUserId,
    selectActiveRoutinesByUserId,
    selectRoutineByRoutineId,
    selectRoutineByUserIdRoutineId,
    selectExercisesByUserRoutineId,
    selectExerciseById,
    selectUserExerciseById,
    insertUser,
    insertUserMetrics,
    insertUserObjective,
    updateRoutineById,
    updateUserRoutineExerciseById,
    updatePassword,
    updateResetToken,
    updateUserData,
    getUserMetrics,
    updateUserMetrics,
    updateExerciseOrder,
    insertUserRoutine,
    insertUserRoutineExercise,
    deleteUserRoutine,
    deleteUserRoutineExercise
};