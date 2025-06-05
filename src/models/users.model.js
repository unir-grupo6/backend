const db = require('../config/db');

//TODO: Editar en base a las tablas de la BBDD. Eliminarlo si no es necesario
const selectAll = async () => {
    const [result] = await db.query('SELECT * FROM usuario');
    return result;
}

const getByEmail = async (email) => {
    const [result] = await db.query(
        'SELECT * FROM usuario WHERE email = ?',
        [email]
    );
    if (result.length === 0) return null;
    return result[0];
}

module.exports = {
    selectAll,
    getByEmail
};