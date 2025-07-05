const { login, registro, forgotPassword, resetPassword, getRutinesByUserId, getRutineById, changePassword, saveUserRoutine, getById, removeUserRoutine, updateUserRoutine, addExerciseToRoutine, removeExerciseFromRoutine, updateUserRoutineExercise, updateUser } = require('../../controllers/users.controller');
const { checkToken } = require('../../middlewares/auth.middlewares');
const { checkPassword } = require('../../middlewares/check-password.middlewares');

const router = require('express').Router();

// USER RUTINES
router.get('/', checkToken, getById);
router.get('/routines', checkToken, getRutinesByUserId);
router.get('/routines/:routineId', checkToken, getRutineById);

router.post('/register', checkPassword, registro);
router.post('/login', login);

router.put('/update-password', checkToken, checkPassword, changePassword);
router.put('/forgot-password', forgotPassword);
router.put('/reset-password', checkPassword, resetPassword);
router.put('/update', checkToken, updateUser);

module.exports = router;