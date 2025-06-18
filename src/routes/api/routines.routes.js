// Rutas para rutinas
const express = require('express');
const router = express.Router();
const { checkToken } = require('../../middlewares/auth.middlewares');
const routinesController = require('../../controllers/routines.controller');

router.get('/', checkToken, routinesController.getAllRoutines);
router.get('/:rutinaId', checkToken, routinesController.getRoutineById);

// Aquí puedes agregar más rutas según los endpoints

module.exports = router;
