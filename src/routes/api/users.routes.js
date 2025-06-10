const { getAll, login, registro, forgotPassword, resetPassword, getUserRoutinesByUserId } = require('../../controllers/users.controller');
const { checkToken } = require('../../middlewares/auth.middlewares');

const router = require('express').Router();

// LOGIN, REGISTER, FORGOT PASSWORD, RESET PASSWORD
router.post('/register', registro);
router.post('/login', login); 

router.put('/forgot-password', forgotPassword);
router.put('/reset-password', resetPassword);

// USER ROUTINES
router.get('/routines', checkToken, getUserRoutinesByUserId);

module.exports = router;