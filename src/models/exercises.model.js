// Modelo para ejercicios
const db = require('../config/db');

const getAll = async () => {
    const [result] = await db.query('SELECT * FROM ejercicios');
    return result;
};

const getById = async (id) => {
    const [result] = await db.query('SELECT * FROM ejercicios WHERE id = ?', [id]);
    if (result.length === 0) return null;
    return result[0];
};

module.exports = { getAll, getById };
