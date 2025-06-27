const { getAll, getByMuscleAndDifficulty} = require('../../controllers/exercises.controller');
const router = require('express').Router();

router.get('/', getAll);
router.get('/filter', getByMuscleAndDifficulty);



// Define your routes here

module.exports = router;