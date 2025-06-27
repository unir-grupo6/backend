// Modelo para rutines
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

const getExercisesByRoutineId = async (routineId) => {
    const [result] = await db.query('SELECT * FROM ejercicios_rutinas WHERE rutinas_id = ?', [routineId]);
    return result;
};

const create = async ({ dificultad_id, objetivos_id, metodos_id, nombre, observaciones }) => {
    const [result] = await db.query(
        'INSERT INTO rutinas (dificultad_id, objetivos_id, metodos_id, nombre, observaciones) VALUES (?, ?, ?, ?, ?)',
        [dificultad_id, objetivos_id, metodos_id, nombre, observaciones]
    );
    return result;
};

const update = async ({ routineId, dificultad_id, metodos_id, nombre, observaciones }) => {
    const [result] = await db.query(
        'UPDATE rutinas SET dificultad_id = ?, metodos_id = ?, nombre = ?, observaciones = ? WHERE id = ?',
        [dificultad_id, metodos_id, nombre, observaciones, routineId]
    );
    return result;
};

const addExerciseToRoutine = async ({ rutinas_id, ejercicios_id, series, repeticiones, dia, orden, comentario }) => {
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

module.exports = { getAll, getById, getExercisesByRoutineId, create, update, addExerciseToRoutine, getAllPublic };
