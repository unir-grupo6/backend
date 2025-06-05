const { getAll } = require('../../controllers/users.controller');

const router = require('express').Router();

router.get('/', getAll);

router.post('/login',); 

module.exports = router;