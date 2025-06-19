const { getAll, login, registro, forgotPassword, resetPassword, getById } = require('../../controllers/users.controller');
const { checkToken } = require('../../middlewares/auth.middlewares');
const { checkPassword } = require('../../middlewares/check-password.middlewares');

const router = require('express').Router();

// router.get('/', checkToken, getAll);
// router.get('/', getAll);
router.get('/', checkToken, getById);

router.post('/register', checkPassword, registro);
router.post('/login', login);

router.put('/forgot-password', forgotPassword);
router.put('/reset-password', checkPassword, resetPassword);

module.exports = router;