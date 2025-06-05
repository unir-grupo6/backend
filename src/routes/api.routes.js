const router = require('express').Router();

router.use('/users', require('./api/users.routes'));

module.exports = router;