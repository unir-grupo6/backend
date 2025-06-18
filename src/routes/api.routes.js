const router = require('express').Router();

router.use('/users', require('./api/users.routes'));
router.use('/exercises', require('./api/exercises.routes'));
router.use('/routines', require('./api/routines.routes'));

module.exports = router;