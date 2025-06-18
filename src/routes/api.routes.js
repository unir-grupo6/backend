const router = require('express').Router();

router.use('/users', require('./api/users.routes'));
router.use('/muscle-groups', require('./api/muscle-groups.routes'));
router.use('/difficulty', require('./api/difficulty.routes'));
router.use('/methods', require('./api/methods.routes'));

module.exports = router;