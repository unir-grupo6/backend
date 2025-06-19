const db = require('../config/db');

const selectAll = async () => {
    const [result] = await db.query('SELECT * FROM metodos');
    return result;
};

const getById = async (id) => {
    const [result] = await db.query(
        'SELECT * FROM metodos WHERE id = ?',
        [id]
    );
    if (result.length === 0) return null;
    return result[0];
};

module.exports = {
    selectAll,
    getById,
};
