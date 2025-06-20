const router = require('express').Router();

router.use('/users', require('./api/users.routes'));
router.use('/muscle-groups', require('./api/muscle-groups.routes'));
router.use('/difficulties', require('./api/difficulties.routes'));
router.use('/methods', require('./api/methods.routes'));
router.use('/goals', require('./api/goals.routes'));
router.use('/exercises', require('./api/exercises.routes'));

module.exports = router;