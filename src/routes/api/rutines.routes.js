const {getAll, getById, getFilteredRoutines} = require('../../controllers/rutines.controller');
const router = require('express').Router();

router.get('/', getAll);
router.get('/rutina/:id', getById);
router.get('/filter', getFilteredRoutines);
// Define your routes here

module.exports = router;