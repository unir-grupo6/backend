const Exercises = require('../models/exercises.model');

const getAll = async (req, res) => {
    try{
        const exercises = await Exercises.selectAll();
        res.json(exercises);
    }
    catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
    // Implement your logic here
}

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

const getByMuscleAndDifficulty = async (req, res) => {
    const { grupos_musculares_id, dificultad_id } = req.query;
    try {
        const exercises = await Exercises.getBymuscleAndDifficulty(grupos_musculares_id, dificultad_id);
        if (!exercises) {
            return res.status(404).json({ message: 'No exercises found for the given criteria' });
        }
        res.json(exercises);
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
}

module.exports = { getAll, getByMuscleAndDifficulty, getAllExercises, getExerciseById };