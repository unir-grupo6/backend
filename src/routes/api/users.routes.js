const { login, registro, forgotPassword, resetPassword, getRoutinesByUserId, getRoutineById, changePassword, saveUserRoutine, getById, removeUserRoutine, updateUserRoutine, addExerciseToRoutine, removeExerciseFromRoutine, updateUserRoutineExercise, updateUser } = require('../../controllers/users.controller');
const { checkToken } = require('../../middlewares/auth.middlewares');
const { checkPassword } = require('../../middlewares/check-password.middlewares');

const router = require('express').Router();

router.get('/', checkToken, getById);

router.post('/register', registro);
router.post('/login', login);

router.put('/update-password', checkToken, changePassword);
router.put('/forgot-password', forgotPassword);
router.put('/reset-password', checkPassword, resetPassword);
router.put('/update', checkToken, updateUser);

module.exports = router;