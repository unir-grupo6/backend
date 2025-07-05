const db = require('../config/db');

const getById = async (userId) => {
    // Primero intenta obtener los datos completos con join
    const [result] = await db.query(
        `
            SELECT U.id, U.nombre, U.apellidos, U.email, U.fecha_nacimiento, U.fecha_alta,U.password, MU.peso, MU.altura, MU.imc, O.id AS objetivo_id, O.nombre AS objetivo
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
    if (result.length > 0) return result[0];
    // Si no hay datos en medidas_usuarios, devuelve los datos básicos del usuario
    const [basic] = await db.query(
        'SELECT id, nombre, apellidos, email, fecha_alta FROM usuarios WHERE id = ?',
        [userId]
    );
    if (basic.length === 0) return null;
    return basic[0];
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

const getObjectiveById = async (objectiveId) => {
    const [result] = await db.query(
        'SELECT id, nombre FROM objetivos WHERE id = ?',
        [objectiveId]
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

const updateUserData = async (userId, { nombre, apellidos, email, fecha_nacimiento }) => {
    const [result] = await db.query(
        'UPDATE usuarios SET nombre = ?, apellidos = ?, email = ?, fecha_nacimiento = ? WHERE id = ?',
        [nombre, apellidos, email, fecha_nacimiento, userId]
    );
    return result;
}

module.exports = {
    getById,
    getByEmail,
    getByResetToken,
    getUserMetrics,
    getObjectiveById,
    insertUser,
    insertUserMetrics,
    insertUserObjective,
    updatePassword,
    updateResetToken,
    updateUserData,
    updateUserMetrics
};