const {getAll, getById, getByGoalsAndDifficultyAndMethod} = require('../../controllers/rutines.controller');
const router = require('express').Router();

router.get('/', getAll);
router.get('/:id', getById);
router.get('/filter', getByGoalsAndDifficultyAndMethod);

// Define your routes here

module.exports = router;