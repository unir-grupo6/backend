// Rutas para ejercicios
const express = require('express');
const router = express.Router();
const { checkToken } = require('../../middlewares/auth.middlewares');
const exercisesController = require('../../controllers/exercises.controller');

router.get('/', checkToken, exercisesController.getAllExercises);
router.get('/:ejercicioId', checkToken, exercisesController.getExerciseById);

module.exports = router;
