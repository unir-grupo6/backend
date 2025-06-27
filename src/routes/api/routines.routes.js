// Rutas para rutinas
const express = require('express');
const router = express.Router();
const { checkToken } = require('../../middlewares/auth.middlewares');
const routinesController = require('../../controllers/routines.controller');

router.get('/', checkToken, routinesController.getAllRoutines);
router.get('/exercises', checkToken, routinesController.getPublicRoutinesWithExercises);
router.get('/:routineId/exercises', checkToken, routinesController.getRoutineWithExercises);
router.get('/:routineId', checkToken, routinesController.getRoutineById);
router.post('/', checkToken, routinesController.createRoutine);
router.post('/:routineId/exercises', checkToken, routinesController.addExerciseToRoutine);
router.put('/:routineId', checkToken, routinesController.updateRoutine);

// Aquí puedes agregar más rutas según los endpoints

module.exports = router;
