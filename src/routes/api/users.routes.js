const { login, registro, forgotPassword, resetPassword, getRoutinesByUserId, getRoutineById, changePassword, saveUserRoutine, getById, removeUserRoutine, updateUserRoutine, addExerciseToRoutine, removeExerciseFromRoutine, updateUserRoutineExercise, updateUser } = require('../../controllers/users.controller');
const { checkToken } = require('../../middlewares/auth.middlewares');
const { checkPassword } = require('../../middlewares/check-password.middlewares');

const router = require('express').Router();

// USER RUTINES
router.get('/', checkToken, getById);
router.get('/rutines', checkToken, getRutinesByUserId);
router.get('/rutines/:rutineId', checkToken, getRutineById);

// LOGIN, REGISTER, FORGOT PASSWORD, RESET PASSWORD
router.post('/register', registro);
router.post('/login', login);

router.put('/update-password', checkToken, changePassword);
router.put('/forgot-password', forgotPassword);
router.put('/reset-password', checkPassword, resetPassword);
router.put('/update', checkToken, updateUser);

module.exports = router;