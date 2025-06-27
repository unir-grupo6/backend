// Controlador para rutinas
const Routine = require('../models/routines.model');
const Exercise = require('../models/exercises.model');

const getAllRoutines = async (req, res) => {
    const routines = await Routine.getAll();
    res.json(routines);
};

const getRoutineById = async (req, res) => {
    const { routineId } = req.params;
    const routine = await Routine.getById(routineId);
    if (!routine) return res.status(404).json({ message: 'Rutina no encontrada' });
    res.json(routine);
};

const getRoutinesWithExercises = async (req, res) => {
    const routines = await Routine.getAll();
    const exercises = await Exercise.getAll();
    res.json({ routines, exercises });
};

const getRoutineWithExercises = async (req, res) => {
    const { routineId } = req.params;
    const routine = await Routine.getById(routineId);
    if (!routine) return res.status(404).json({ message: 'Rutina no encontrada' });
    // Obtener los ejercicios asociados a la rutina
    const rutinaEjercicios = await Routine.getExercisesByRoutineId(routineId);
    // Para cada registro de rutina_ejercicios, obtener el detalle del ejercicio
    const exercises = await Promise.all(
        rutinaEjercicios.map(async (re) => {
            const ejercicio = await Exercise.getById(re.ejercicios_id);
            return { ...ejercicio, ...re };
        })
    );
    res.json({ routine, exercises });
};

const getRoutineWithAllExercises = async (req, res) => {
    const { routineId } = req.params;
    const routine = await Routine.getById(routineId);
    if (!routine) return res.status(404).json({ message: 'Rutina no encontrada' });
    const exercises = await Exercise.getAll();
    res.json({ routine, exercises });
};

const createRoutine = async (req, res) => {
    const { dificultad_id, objetivos_id, metodos_id, nombre, observaciones } = req.body;
    if (!dificultad_id || !objetivos_id || !metodos_id || !nombre) {
        return res.status(400).json({ message: 'Faltan campos obligatorios' });
    }
    const result = await Routine.create({ dificultad_id, objetivos_id, metodos_id, nombre, observaciones });
    const newRoutine = await Routine.getById(result.insertId);
    res.status(201).json(newRoutine);
};

const updateRoutine = async (req, res) => {
    const { routineId } = req.params;
    const { dificultad_id, metodos_id, nombre, observaciones } = req.body;
    if (!dificultad_id || !metodos_id || !nombre) {
        return res.status(400).json({ message: 'Faltan campos obligatorios' });
    }
    const result = await Routine.update({ routineId, dificultad_id, metodos_id, nombre, observaciones });
    if (result.affectedRows === 0) {
        return res.status(404).json({ message: 'Rutina no encontrada' });
    }
    const updatedRoutine = await Routine.getById(routineId);
    res.json(updatedRoutine);
};

const addExerciseToRoutine = async (req, res) => {
    const { routineId } = req.params;
    const { ejercicios_id, series, repeticiones, dia, orden, comentario } = req.body;
    if (!ejercicios_id || !series || !repeticiones) {
        return res.status(400).json({ message: 'Faltan campos obligatorios' });
    }
    const result = await Routine.addExerciseToRoutine({
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

const getPublicRoutinesWithExercises = async (req, res) => {
    const routines = await Routine.getAllPublic();
    const exercises = await Exercise.getAll();
    res.json({ routines, exercises });
};

// Aquí puedes agregar más controladores según los endpoints

module.exports = { getAllRoutines, getRoutineById, getRoutinesWithExercises, getRoutineWithExercises, getRoutineWithAllExercises, createRoutine, updateRoutine, addExerciseToRoutine, getPublicRoutinesWithExercises };
