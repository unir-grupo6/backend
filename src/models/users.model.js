const db = require('../config/db');

//TODO: Editar en base a las tablas de la BBDD. Eliminarlo si no es necesario
const selectAll = async () => {
    const [result] = await db.query('SELECT * FROM usuarios');
    return result;
}

const getById = async (userId) => {
    const [result] = await db.query(
        'SELECT * FROM usuarios WHERE id = ?',
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
    selectAll,
    getById,
    getByEmail,
    getByResetToken,
    insert,
    updatePassword,
    updateResetToken
};