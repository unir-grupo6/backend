const {getAll, getById, getFilteredRoutines, getRutineShared} = require('../../controllers/rutines.controller');
const router = require('express').Router();
const { checkToken } = require('../../middlewares/auth.middlewares');

router.get('/', checkToken, getAll);
router.get('/rutina/:id', checkToken, getById);
router.get('/filter', checkToken, getFilteredRoutines);
router.get('/shared', checkToken, getRutineShared);
// Define your routes here

module.exports = router;