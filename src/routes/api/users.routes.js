const { login, registro, forgotPassword, resetPassword, getRoutinesByUserId, getRoutineById } = require('../../controllers/users.controller');
const { checkToken } = require('../../middlewares/auth.middlewares');
const { updatePassword } = require('../../models/users.model');

const router = require('express').Router();

// LOGIN, REGISTER, FORGOT PASSWORD, RESET PASSWORD
router.post('/register', registro);
router.post('/login', login); 
router.put('/update-password', checkToken, updatePassword);
router.put('/forgot-password', forgotPassword);
router.put('/reset-password', resetPassword);

// USER ROUTINES
router.get('/routines', checkToken, getRoutinesByUserId);
router.get('/routines/:routineId', checkToken, getRoutineById);

module.exports = router;