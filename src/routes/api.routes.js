const router = require('express').Router();

router.use('/users', require('./api/users.routes'));
router.use('/exercises', require('./api/exercises.routes'));
router.use('/rutines', require('./api/rutines.routes'));

module.exports = router;