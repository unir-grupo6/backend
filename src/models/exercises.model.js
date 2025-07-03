const db = require('../config/db');

const selectAll = async () => {
    const [result] = await db.query('SELECT * FROM ejercicios');
    return result;
}

const getAll = async () => {
    const [result] = await db.query('SELECT * FROM ejercicios');
    return result;
};

const getById = async (id) => {
    const [result] = await db.query('SELECT * FROM ejercicios WHERE id = ?', [id]);
    if (result.length === 0) return null;
    return result[0];
};


const getBymuscleAndDifficulty = async (grupos_musculares_id, dificultad_id) => {
    let query = 'SELECT * FROM ejercicios';
    const conditions = [];
    const params = [];

    if (grupos_musculares_id) {
        conditions.push('grupos_musculares_id = ?');
        params.push(grupos_musculares_id);
    }

    if (dificultad_id) {
        conditions.push('dificultad_id = ?');
        params.push(dificultad_id);
    }

    if (conditions.length > 0) {
        query += ` WHERE ${conditions.join(' AND ')}`;
    }

    const [result] = await db.query(query, params);
    return result;
};


module.exports = {selectAll, getBymuscleAndDifficulty, getAll, getById}
