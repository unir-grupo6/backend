const { getAll, login } = require('../../controllers/users.controller');
const { checkToken } = require('../../middlewares/auth.middlewares');

const router = require('express').Router();

router.get('/', checkToken, getAll);

router.post('/login', login); 

module.exports = router;