// Modelo para rutines
const db = require('../config/db');

const getAll = async () => {
    const [result] = await db.query('SELECT * FROM rutinas');
    return result;
};

const selectAll = async () => {
    const [result] = await db.query('SELECT * FROM rutinas');
    return result;
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
        query += ` WHERE ${conditions.join(' AND ')}`;
    }
    const [result] = await db.query(query, params);
    return result;
  };

const getById = async (id) => {
    const [result] = await db.query('SELECT * FROM rutinas WHERE id = ?', [id]);
    if (result.length === 0) return null;
    return result[0];
};

const getExercisesByRutineId = async (rutineId) => {
    const [result] = await db.query('SELECT * FROM ejercicios_rutinas WHERE rutinas_id = ?', [rutineId]);
    return result;
};

const create = async ({ dificultad_id, objetivos_id, metodos_id, nombre, observaciones }) => {
    const [result] = await db.query(
        'INSERT INTO rutinas (dificultad_id, objetivos_id, metodos_id, nombre, observaciones) VALUES (?, ?, ?, ?, ?)',
        [dificultad_id, objetivos_id, metodos_id, nombre, observaciones]
    );
    return result;
};

const update = async ({ rutineId, dificultad_id, metodos_id, nombre, observaciones }) => {
    const [result] = await db.query(
        'UPDATE rutinas SET dificultad_id = ?, metodos_id = ?, nombre = ?, observaciones = ? WHERE id = ?',
        [dificultad_id, metodos_id, nombre, observaciones, rutineId]
    );
    return result;
};

const addExerciseToRutine = async ({ rutinas_id, ejercicios_id, series, repeticiones, dia, orden, comentario }) => {
    const [result] = await db.query(
        'INSERT INTO ejercicios_rutinas (rutinas_id, ejercicios_id, series, repeticiones, dia, orden, comentario) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [rutinas_id, ejercicios_id, series, repeticiones, dia, orden, comentario]
    );
    return result;
};

const getAllPublic = async () => {
    const [result] = await db.query('SELECT * FROM rutinas WHERE compartida = 1');
    return result;
};

module.exports = { getAll, getById, getExercisesByRutineId, create, update, addExerciseToRutine, getAllPublic, selectAll, getBygoalsAndDifficultyAndMethod };