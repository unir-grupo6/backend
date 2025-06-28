const express = require('express');
const router = express.Router();
const { checkToken } = require('../../middlewares/auth.middlewares');
const rutinesController = require('../../controllers/rutines.controller');

router.get('/', checkToken, rutinesController.getAllRutines);
router.get('/exercises', checkToken, rutinesController.getPublicRutinesWithExercises);
router.get('/:rutineId/exercises', checkToken, rutinesController.getRutineWithExercises);
router.get('/:rutineId', checkToken, rutinesController.getRutineById);
router.post('/', checkToken, rutinesController.createRutine);
router.put('/:rutineId', checkToken, rutinesController.updateRutine);
router.post('/:rutineId/exercises', checkToken, rutinesController.addExerciseToRutine);

module.exports = router;
