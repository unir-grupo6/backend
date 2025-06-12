const { getAll, login, registro, forgotPassword, resetPassword } = require('../../controllers/users.controller');
const { checkToken } = require('../../middlewares/auth.middlewares');
const { checkRegisterPassword, checkUpdatePassword } = require('../../middlewares/check-password.middlewares');

const router = require('express').Router();

// router.get('/', checkToken, getAll);
router.get('/', getAll);

router.post('/register', checkRegisterPassword, registro);
router.post('/login', login); 

router.put('/forgot-password', forgotPassword);
router.put('/reset-password', checkUpdatePassword, resetPassword);

module.exports = router;