// Modelo para rutinas
const db = require('../config/db');

const getAll = async () => {
    const [result] = await db.query('SELECT * FROM rutinas');
    return result;
};

const getById = async (id) => {
    const [result] = await db.query('SELECT * FROM rutinas WHERE id = ?', [id]);
    if (result.length === 0) return null;
    return result[0];
};

// Aquí puedes agregar más métodos según los endpoints

module.exports = { getAll, getById };
