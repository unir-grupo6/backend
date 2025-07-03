const express = require('express');
const router = express.Router();
const { checkToken } = require('../../middlewares/auth.middlewares');
const routinesController = require('../../controllers/routines.controller');

router.get('/', checkToken, routinesController.getAll);
router.get('/rutina/:id', checkToken, routinesController.getById);
router.get('/filter', checkToken, routinesController.getFilteredRoutines);
router.get('/shared', checkToken, routinesController.getRoutineShared);
router.get('/', checkToken, routinesController.getAllRoutines);
router.get('/exercises', checkToken, routinesController.getPublicRoutinesWithExercises);
router.get('/:routineId/exercises', checkToken, routinesController.getRoutineWithExercises);
router.get('/:routineId', checkToken, routinesController.getRoutineById);
router.post('/', checkToken, routinesController.createRoutine);
router.put('/:routineId', checkToken, routinesController.updateRoutine);
router.post('/:routineId/exercises', checkToken, routinesController.addExerciseToRoutine);
// Define your routes here

module.exports = router;