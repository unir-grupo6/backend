const {getAll, getById, getFilteredRoutines, getRoutineShared} = require('../../controllers/routines.controller');
const router = require('express').Router();
const { checkToken } = require('../../middlewares/auth.middlewares');

router.get('/', checkToken, getAll);
router.get('/rutina/:id', checkToken, getById);
router.get('/filter', checkToken, getFilteredRoutines);
router.get('/shared', checkToken, getRoutineShared);

module.exports = router;