const db = require('../config/db');

const selectAll = async () => {
    const [result] = await db.query('SELECT * FROM objetivos');
    return result;
}

const getById = async (id) => {
    const [result] = await db.query('SELECT * FROM objetivos WHERE id = ?', [id]);
    return result[0] || null;
}

module.exports = {
    selectAll,
    getById
}