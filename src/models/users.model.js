const db = require('../config/db');

//TODO: Editar en base a las tablas de la BBDD. Eliminarlo si no es necesario
const selectAll = async () => {
    const [result] = await db.query('SELECT * FROM usuario');
    return result;
}

module.exports = {
    selectAll
};