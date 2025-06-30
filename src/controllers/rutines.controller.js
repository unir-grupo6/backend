// Controlador para rutines
const Rutine = require('../models/rutines.model');
const Exercise = require('../models/exercises.model');

const getAll = async (req, res) => {
    try{
        const rutines = await Rutines.selectAll();
        res.json(rutines); 
    }
    catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
}
const getAllRutines = async (req, res) => {
    const rutines = await Rutine.getAll();
    res.json(rutines);
};

const getById = async (req, res) => {
    const { id } = req.params;
    try {
        const rutine = await Rutines.getById(id);
        if (!rutine) {
            return res.status(404).json({ message: 'Rutine not found' });
        }
        res.json(rutine);
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
}

const getRutineById = async (req, res) => {
    const { rutineId } = req.params;
    const rutine = await Rutine.getById(rutineId);
    if (!rutine) return res.status(404).json({ message: 'Rutina no encontrada' });
    res.json(rutine);
};

const getRutinesWithExercises = async (req, res) => {
    const rutines = await Rutine.getAll();
    const exercises = await Exercise.getAll();
    res.json({ rutines, exercises });
};

const getByGoalsAndDifficultyAndMethod = async (req, res) => {
    const { objetivos_id, dificultad_id, metodos_id } = req.query;
    try{
        const rutines = await Rutines.getBygoalsAndDifficultyAndMethod(objetivos_id, dificultad_id, metodos_id);
        if (!rutines) {
            return res.status(404).json({ message: 'No rutines found for the given criteria' });
        }
        res.json(rutines);
    }
    catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
}

const getRutineWithExercises = async (req, res) => {
    const { rutineId } = req.params;
    const rutine = await Rutine.getById(rutineId);
    if (!rutine) return res.status(404).json({ message: 'Rutina no encontrada' });
    const rutineEjercicios = await Rutine.getExercisesByRutineId(rutineId);
    const exercises = await Promise.all(
        rutineEjercicios.map(async (re) => {
            const ejercicio = await Exercise.getById(re.ejercicios_id);
            // Incluye detalles adicionales como sexo y día
            return { ...ejercicio, sexo: re.sexo, dia: re.dia, series: re.series, repeticiones: re.repeticiones, orden: re.orden, comentario: re.comentario };
        })
    );
    res.json({ ...rutine, exercises });
};

const getRutineWithAllExercises = async (req, res) => {
    const { rutineId } = req.params;
    const rutine = await Rutine.getById(rutineId);
    if (!rutine) return res.status(404).json({ message: 'Rutina no encontrada' });
    const exercises = await Exercise.getAll();
    res.json({ rutine, exercises });
};

const createRutine = async (req, res) => {
    const { dificultad_id, objetivos_id, metodos_id, nombre, observaciones } = req.body;
    if (!dificultad_id || !objetivos_id || !metodos_id || !nombre) {
        return res.status(400).json({ message: 'Faltan campos obligatorios' });
    }
    const result = await Rutine.create({ dificultad_id, objetivos_id, metodos_id, nombre, observaciones });
    const newRutine = await Rutine.getById(result.insertId);
    res.status(201).json(newRutine);
};

const updateRutine = async (req, res) => {
    const { rutineId } = req.params;
    const { dificultad_id, metodos_id, nombre, observaciones } = req.body;
    if (!dificultad_id || !metodos_id || !nombre) {
        return res.status(400).json({ message: 'Faltan campos obligatorios' });
    }
    const result = await Rutine.update({ rutineId, dificultad_id, metodos_id, nombre, observaciones });
    if (result.affectedRows === 0) {
        return res.status(404).json({ message: 'Rutina no encontrada' });
    }
    const updatedRutine = await Rutine.getById(rutineId);
    res.json(updatedRutine);
};

const addExerciseToRutine = async (req, res) => {
    const { rutineId } = req.params;
    const { ejercicios_id, series, repeticiones, dia, orden, comentario } = req.body;
    if (!ejercicios_id || !series || !repeticiones) {
        return res.status(400).json({ message: 'Faltan campos obligatorios' });
    }
    const result = await Rutine.addExerciseToRutine({
        rutinas_id: rutineId,
        ejercicios_id,
        series,
        repeticiones,
        dia,
        orden,
        comentario
    });
    res.status(201).json({ message: 'Ejercicio añadido a la rutina', insertId: result.insertId });
};

const getPublicRutinesWithExercises = async (req, res) => {
    const rutines = await Rutine.getAllPublic();
    const exercises = await Exercise.getAll();
    res.json({ rutines, exercises });
};

module.exports = { getAll, getById, getByGoalsAndDifficultyAndMethod, getAllRutines, getRutineById, getRutinesWithExercises, getRutineWithExercises, getRutineWithAllExercises, createRutine, updateRutine, addExerciseToRutine, getPublicRutinesWithExercises };
