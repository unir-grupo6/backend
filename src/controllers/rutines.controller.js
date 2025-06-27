// Controlador para rutines
const Rutine = require('../models/rutines.model');
const Exercise = require('../models/exercises.model');

const getAllRutines = async (req, res) => {
    const rutines = await Rutine.getAll();
    res.json(rutines);
};

const getRutineById = async (req, res) => {
    const { routineId } = req.params;
    const rutine = await Rutine.getById(routineId);
    if (!rutine) return res.status(404).json({ message: 'Rutina no encontrada' });
    res.json(rutine);
};

const getRutinesWithExercises = async (req, res) => {
    const rutines = await Rutine.getAll();
    const exercises = await Exercise.getAll();
    res.json({ rutines, exercises });
};

const getRutineWithExercises = async (req, res) => {
    const { routineId } = req.params;
    const rutine = await Rutine.getById(routineId);
    if (!rutine) return res.status(404).json({ message: 'Rutina no encontrada' });
    const rutineEjercicios = await Rutine.getExercisesByRoutineId(routineId);
    const exercises = await Promise.all(
        rutineEjercicios.map(async (re) => {
            const ejercicio = await Exercise.getById(re.ejercicios_id);
            return { ...ejercicio, ...re };
        })
    );
    res.json({ rutine, exercises });
};

const getRutineWithAllExercises = async (req, res) => {
    const { routineId } = req.params;
    const rutine = await Rutine.getById(routineId);
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
    const { routineId } = req.params;
    const { dificultad_id, metodos_id, nombre, observaciones } = req.body;
    if (!dificultad_id || !metodos_id || !nombre) {
        return res.status(400).json({ message: 'Faltan campos obligatorios' });
    }
    const result = await Rutine.update({ routineId, dificultad_id, metodos_id, nombre, observaciones });
    if (result.affectedRows === 0) {
        return res.status(404).json({ message: 'Rutina no encontrada' });
    }
    const updatedRutine = await Rutine.getById(routineId);
    res.json(updatedRutine);
};

const addExerciseToRutine = async (req, res) => {
    const { routineId } = req.params;
    const { ejercicios_id, series, repeticiones, dia, orden, comentario } = req.body;
    if (!ejercicios_id || !series || !repeticiones) {
        return res.status(400).json({ message: 'Faltan campos obligatorios' });
    }
    const result = await Rutine.addExerciseToRoutine({
        rutinas_id: routineId,
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

module.exports = { getAllRutines, getRutineById, getRutinesWithExercises, getRutineWithExercises, getRutineWithAllExercises, createRutine, updateRutine, addExerciseToRutine, getPublicRutinesWithExercises };
