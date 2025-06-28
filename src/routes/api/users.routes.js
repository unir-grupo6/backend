const { login, registro, forgotPassword, resetPassword, getRutinesByUserId, getRutineById, changePassword } = require('../../controllers/users.controller');
const { checkToken } = require('../../middlewares/auth.middlewares');

const router = require('express').Router();

// USER RUTINES
router.get('/rutines', checkToken, getRutinesByUserId);
router.get('/rutines/:rutineId', checkToken, getRutineById);

// LOGIN, REGISTER, FORGOT PASSWORD, RESET PASSWORD
router.post('/register', registro);
router.post('/login', login);

router.put('/update-password', checkToken, changePassword);
router.put('/forgot-password', forgotPassword);
router.put('/reset-password', resetPassword);

module.exports = router;