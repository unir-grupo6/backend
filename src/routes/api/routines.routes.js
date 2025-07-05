
const {getAll, getById, getFilteredRoutines, getRoutineShared,createRoutine,getRoutineWithExercises, getRoutineById, updateRoutine,addExerciseToRoutine} = require('../../controllers/routines.controller');
const { getAllUserExercises } = require('../../controllers/user-routines.controller');
const router = require('express').Router();
const { checkToken } = require('../../middlewares/auth.middlewares');


router.get('/', checkToken, getAll);
router.get('/rutina/:id', checkToken, getById);
router.get('/filter', checkToken, getFilteredRoutines);
router.get('/shared', checkToken, getRoutineShared);
router.get('/exercises', checkToken, getAllUserExercises);
router.get('/:routineId/exercises', checkToken, getRoutineWithExercises);
router.get('/:routineId', checkToken, getRoutineById);
router.post('/', checkToken, createRoutine);
router.put('/:routineId', checkToken, updateRoutine);
router.post('/:routineId/exercises', checkToken, addExerciseToRoutine);
// Define your routes here

module.exports = router;