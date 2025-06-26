const { getAll, login, registro, forgotPassword, resetPassword, getById, updateUser } = require('../../controllers/users.controller');
const { checkToken } = require('../../middlewares/auth.middlewares');
const { checkPassword } = require('../../middlewares/check-password.middlewares');

const router = require('express').Router();

router.get('/', checkToken, getById);

router.post('/register', checkPassword, registro);
router.post('/login', login);

router.put('/forgot-password', forgotPassword);
router.put('/reset-password', checkPassword, resetPassword);

router.put('/update', checkToken, updateUser);

module.exports = router;