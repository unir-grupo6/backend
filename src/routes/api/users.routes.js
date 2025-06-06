const { getAll, login, registro, forgotPassword, resetPassword } = require('../../controllers/users.controller');
const { checkToken } = require('../../middlewares/auth.middlewares');

const router = require('express').Router();

router.get('/', checkToken, getAll);

router.post('/register', registro);
router.post('/login', login); 

router.put('/forgot-password', forgotPassword);
router.put('/reset-password', resetPassword);

module.exports = router;