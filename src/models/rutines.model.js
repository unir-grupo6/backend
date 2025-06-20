const db = require('../config/db');

const selectAll = async () => {
    const [result] = await db.query('SELECT * FROM rutinas');
    return result;
}


const getById = async (id) => {
    const [result] = await db.query('SELECT * FROM rutinas WHERE id = ?', [id]);
    return result[0];
}

const getBygoalsAndDifficultyAndMethod = async (objetivos_id, dificultad_id, metodos_id) => {
    let query = 'SELECT * FROM rutinas';
    const conditions = [];
    const params = [];
    if (objetivos_id) {
        conditions.push('objetivos_id = ?');
        params.push(objetivos_id);
    }
    if (dificultad_id) {
        conditions.push('dificultad_id = ?');
        params.push(dificultad_id);
    }
    if (metodos_id) {
        conditions.push('metodos_id = ?');
        params.push(metodos_id);
    }
    if (conditions.length > 0) {
        query += ' WHERE ' + conditions.join(' AND ');
    }
    const [result] = await db.query(query, params);
    return result;
  };



module.exports = {
    selectAll,
    getById,
    getBygoalsAndDifficultyAndMethod
}