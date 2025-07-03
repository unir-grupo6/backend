// Rutas para ejercicios
const { getAllExercises, getExerciseById, getAll, getByMuscleAndDifficulty } = require('../../controllers/exercises.controller');
const router = require('express').Router();
const { checkToken } = require('../../middlewares/auth.middlewares');

router.get('/', checkToken, getAllExercises);
router.get('/filter', checkToken, getByMuscleAndDifficulty);
router.get('/:ejercicioId', checkToken, getExerciseById);
router.get('/', getAll);


module.exports = router;
