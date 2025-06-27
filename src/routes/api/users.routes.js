const { login, registro, forgotPassword, resetPassword, getRoutinesByUserId, getRoutineById, changePassword, saveUserRoutine, getById, removeUserRoutine, updateUserRoutine, addExerciseToRoutine, removeExerciseFromRoutine, updateUserRoutineExercise, updateUser } = require('../../controllers/users.controller');
const { checkToken } = require('../../middlewares/auth.middlewares');
const { checkPassword } = require('../../middlewares/check-password.middlewares');

const router = require('express').Router();

router.get('/', checkToken, getById);

// LOGIN, REGISTER, FORGOT PASSWORD, RESET PASSWORD
router.post('/register', registro);
router.post('/login', login);

router.put('/update-password', checkToken, changePassword);
router.put('/forgot-password', forgotPassword);
router.put('/reset-password', checkPassword, resetPassword);
router.put('/update', checkToken, updateUser);

// USER ROUTINES
router.get('/routines', checkToken, getRoutinesByUserId);
router.get('/routines/:routineId', checkToken, getRoutineById);

router.patch('/routines/:userRoutineId', checkToken, updateUserRoutine);
router.patch('/routines/:userRoutineId/exercises/:exerciseId', checkToken, updateUserRoutineExercise);

router.post('/routines/:userRoutineId/save', checkToken, saveUserRoutine);
router.post('/routines/:userRoutineId/exercises', checkToken, addExerciseToRoutine);

router.delete('/routines/:userRoutineId', checkToken, removeUserRoutine);
router.delete('/routines/:userRoutineId/exercises/:exerciseId', checkToken, removeExerciseFromRoutine);

module.exports = router;