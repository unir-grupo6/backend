
const express = require('express');
const router = express.Router();
const { checkToken } = require('../../middlewares/auth.middlewares');
const rutinesController = require('../../controllers/rutines.controller');



router.get('/', checkToken, routinesController.getAll);
router.get('/rutina/:id', checkToken, routinesController.getById);
router.get('/filter', checkToken, routinesController.getFilteredRoutines);
router.get('/', checkToken, routinesController.getAllRoutines);
router.get('/exercises', checkToken, routinesController.getPublicRoutinesWithExercises);
router.get('/:rutineId/exercises', checkToken, routinesController.getRutineWithExercises);
router.get('/:rutineId', checkToken, routinesController.getRutineById);
router.post('/', checkToken, routinesController.createRutine);
router.put('/:rutineId', checkToken, routinesController.updateRutine);
router.post('/:rutineId/exercises', checkToken, rutinesController.addExerciseToRutine);
// Define your routes here


module.exports = router;