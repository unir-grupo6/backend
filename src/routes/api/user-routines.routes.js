const { getRoutinesByUserId, getRoutineById, saveUserRoutine, removeUserRoutine, updateUserRoutine, addExerciseToRoutine, removeExerciseFromRoutine, updateUserRoutineExercise, generatePdfFromUserRoutine, getSharedRoutines } = require('../../controllers/user-routines.controller');
const { checkToken } = require('../../middlewares/auth.middlewares');

const router = require('express').Router();

router.get('/', checkToken, getRoutinesByUserId);
router.get('/:routineId', checkToken, getRoutineById);
router.get('/generate/:userRoutineId', checkToken, generatePdfFromUserRoutine);



router.patch('/:userRoutineId', checkToken, updateUserRoutine);
router.patch('/:userRoutineId/exercises/:exerciseId', checkToken, updateUserRoutineExercise);

router.post('/:userRoutineId/save', checkToken, saveUserRoutine);
router.post('/:userRoutineId/exercises', checkToken, addExerciseToRoutine);

router.delete('/:userRoutineId', checkToken, removeUserRoutine);
router.delete('/:userRoutineId/exercises/:exerciseId', checkToken, removeExerciseFromRoutine);

module.exports = router;