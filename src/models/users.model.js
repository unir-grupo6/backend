const db = require('../config/db');

//TODO: Editar en base a las tablas de la BBDD. Eliminarlo si no es necesario
const selectAll = async () => {
    const [result] = await db.query('SELECT * FROM usuario');
    return result;
}

const getById = async (userId) => {
    const [result] = await db.query(
        'SELECT * FROM usuario WHERE id = ?',
        [userId],
    );
    if (result.length === 0) return null;
    return result[0];
}

const getByEmail = async (email) => {
    const [result] = await db.query(
        'SELECT * FROM usuario WHERE email = ?',
        [email]
    );
    if (result.length === 0) return null;
    return result[0];
}

const getByResetToken = async (resetToken) => {
    const [result] = await db.query(
        'SELECT * FROM usuario WHERE reset_token = ?',
        [resetToken]
    );
    if (result.length === 0) return null;
    return result[0];
}

const insert = async ({ username, email, password }) => {
    const [result] = await db.query(
        'INSERT INTO usuario (username, email, password) VALUES (?, ?, ?)',
        [username, email, password]
    );
    return result;
}

const updatePassword = async (userId, newPassword) => {
    const [result] = await db.query(
        'UPDATE usuario SET password = ? WHERE id = ?',
        [newPassword, userId]
    );
    return result;
}

const updateResetToken = async (userId, resetToken) => {
    const [result] = await db.query(
        'UPDATE usuario SET reset_token = ? WHERE id = ?',
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