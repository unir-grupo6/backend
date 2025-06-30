const express = require('express');
const router = express.Router();
const { checkToken } = require('../../middlewares/auth.middlewares');
const rutinesController = require('../../controllers/rutines.controller');

router.get('/', rutinesController.getAll);
router.get('/rutina/:id', rutinesController.getById);
router.get('/filter', rutinesController.getByGoalsAndDifficultyAndMethod);
router.get('/', checkToken, rutinesController.getAllRutines);
router.get('/exercises', checkToken, rutinesController.getPublicRutinesWithExercises);
router.get('/:rutineId/exercises', checkToken, rutinesController.getRutineWithExercises);
router.get('/:rutineId', checkToken, rutinesController.getRutineById);
router.post('/', checkToken, rutinesController.createRutine);
router.put('/:rutineId', checkToken, rutinesController.updateRutine);
router.post('/:rutineId/exercises', checkToken, rutinesController.addExerciseToRutine);
// Define your routes here

module.exports = router;