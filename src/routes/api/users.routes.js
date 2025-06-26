const { login, registro, forgotPassword, resetPassword, getRoutinesByUserId, getRoutineById, changePassword, saveUserRoutine, getById, removeUserRoutine, updateUserRoutine, addExerciseToRoutine, removeExerciseFromRoutine } = require('../../controllers/users.controller');
const { checkToken } = require('../../middlewares/auth.middlewares');

const router = require('express').Router();

router.get('/', checkToken, getById);

// LOGIN, REGISTER, FORGOT PASSWORD, RESET PASSWORD
router.post('/register', registro);
router.post('/login', login);

router.put('/update-password', checkToken, changePassword);
router.put('/forgot-password', forgotPassword);
router.put('/reset-password', resetPassword);

// USER ROUTINES
router.get('/routines', checkToken, getRoutinesByUserId);
router.get('/routines/:routineId', checkToken, getRoutineById);

router.post('/routines/:userRoutineId/save', checkToken, saveUserRoutine);
router.patch('/routines/:userRoutineId', checkToken, updateUserRoutine);
router.post('/routines/:userRoutineId/exercises', checkToken, addExerciseToRoutine);

router.delete('/routines/:userRoutineId', checkToken, removeUserRoutine);
// delete exercise from routine
router.delete('/routines/:userRoutineId/exercises/:exerciseId', checkToken, removeExerciseFromRoutine);

module.exports = router;