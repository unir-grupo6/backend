const db = require('../config/db');

const getById = async (userId) => {
    const [result] = await db.query(
        `
            SELECT U.id, nombre, apellidos, email, fecha_alta, peso, altura, imc
            FROM usuarios U
		        INNER JOIN medidas_usuarios MU on U.id = MU.id_usuario
            WHERE U.id = ?
            ORDER BY MU.fecha desc
            LIMIT 1;
        `,
        [userId],
    );
    if (result.length === 0) return null;
    return result[0];
}

const getByEmail = async (email) => {
    const [result] = await db.query(
        'SELECT * FROM usuarios WHERE email = ?',
        [email]
    );
    if (result.length === 0) return null;
    return result[0];
}

const getByResetToken = async (resetToken) => {
    const [result] = await db.query(
        'SELECT * FROM usuarios WHERE reset_token = ?',
        [resetToken]
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

const selectExercisesByUserRoutineId = async (routineId) => {
    const [result] = await db.query(
        `
        SELECT E.nombre, E.tipo, E.inicio as step_1, E.fin as step_2, GM.nombre as grupos_musculares, EU.series, EU.repeticiones, EU.comentario
FROM ejercicios_usuarios EU
        INNER JOIN ejercicios E ON E.id = EU.ejercicios_id
        INNER JOIN grupos_musculares GM ON GM.id = E.grupos_musculares_id
WHERE EU.rutinas_usuarios_id = ?
        `,
        [routineId]
    );
    return result;
}

const insert = async ({ nombre, apellidos, email, contraseña, sexo }) => {
    const [result] = await db.query(
        'INSERT INTO usuarios (nombre, apellidos, email, contraseña, fecha_alta, sexo) VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP, ?)',
        [nombre, apellidos, email, contraseña, sexo]
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

module.exports = {
    getById,
    getByEmail,
    getByResetToken,
    selectRoutinesByUserId,
    selectActiveRoutinesByUserId,
    selectExercisesByUserRoutineId,
    insert,
    updatePassword,
    updateResetToken
};