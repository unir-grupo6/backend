const db = require('../config/db');

const selectAll = async () => {
    const [result] = await db.query('SELECT * FROM grupos_musculares');
    return result;
}

const getById = async (userId) => {
    const [result] = await db.query(
        'SELECT * FROM grupos_musculares WHERE id = ?',
        [userId],
    );
    if (result.length === 0) return null;
    return result[0];
}

module.exports = {
    selectAll,
    getById,
};