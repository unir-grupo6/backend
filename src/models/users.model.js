const db = require('../config/db');

//TODO: Editar en base a las tablas de la BBDD. Eliminarlo si no es necesario
const selectAll = async () => {
    const [result] = await db.query('SELECT * FROM usuarios');
    return result;
}

const getById = async (userId) => {
    const [result] = await db.query(
        `
        SELECT U.id, nombre, apellidos, email, fecha_nacimiento, fecha_alta, sexo, peso, altura, imc
        FROM usuarios U
            LEFT JOIN medidas_usuarios MU on U.id = MU.id_usuario
        WHERE U.id = ?
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

const insertUser = async ({ nombre, apellidos, email, password, sexo, fechaNacimiento }) => {
    const [result] = await db.query(
        'INSERT INTO usuarios (nombre, apellidos, email, password, fecha_alta, sexo, fecha_nacimiento) VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP, ?, ?)',
        [nombre, apellidos, email, password, sexo, fechaNacimiento]
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
    insertUser,
    insertUserMetrics,
    updatePassword,
    updateResetToken
};