const { getAll, login } = require('../../controllers/users.controller');

const router = require('express').Router();

router.get('/', getAll);

router.post('/login', login); 

module.exports = router;