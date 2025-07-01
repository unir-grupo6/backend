const { getAll, getByMuscleAndDifficulty} = require('../../controllers/exercises.controller');
const router = require('express').Router();
const { checkToken } = require('../../middlewares/auth.middlewares');

router.get('/',checkToken, getAll);
router.get('/filter',checkToken, getByMuscleAndDifficulty);



// Define your routes here

module.exports = router;