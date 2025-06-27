const express = require('express');
const router = express.Router();
const { checkToken } = require('../../middlewares/auth.middlewares');
const rutinesController = require('../../controllers/rutines.controller');

router.get('/', checkToken, rutinesController.getAllRutines);
router.get('/exercises', checkToken, rutinesController.getPublicRutinesWithExercises);
router.get('/:routineId/exercises', checkToken, rutinesController.getRutineWithExercises);
router.get('/:routineId', checkToken, rutinesController.getRutineById);
router.post('/', checkToken, rutinesController.createRutine);
router.put('/:routineId', checkToken, rutinesController.updateRutine);
router.post('/:routineId/exercises', checkToken, rutinesController.addExerciseToRutine);

module.exports = router;
