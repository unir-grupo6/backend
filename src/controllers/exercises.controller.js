// Controlador para ejercicios
const Exercise = require('../models/exercises.model');

const getAllExercises = async (req, res) => {
    const exercises = await Exercise.getAll();
    res.json(exercises);
};

const getExerciseById = async (req, res) => {
    const { ejercicioId } = req.params;
    const exercise = await Exercise.getById(ejercicioId);
    if (!exercise) return res.status(404).json({ message: 'Ejercicio no encontrado' });
    res.json(exercise);
};

module.exports = { getAllExercises, getExerciseById };
