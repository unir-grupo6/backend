const db = require('../config/db');

const getById = async (userId) => {
    // Primero intenta obtener los datos completos con join
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

const insert = async ({ nombre, apellidos, email, password, sexo }) => {
    const [result] = await db.query(
        'INSERT INTO usuarios (nombre, apellidos, email, password, fecha_alta, sexo) VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP, ?)',
        [nombre, apellidos, email, password, sexo]
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
    insert,
    updatePassword,
    updateResetToken
};