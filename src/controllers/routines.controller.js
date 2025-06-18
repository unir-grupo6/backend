// Controlador para rutinas
const Routine = require('../models/routines.model');

const getAllRoutines = async (req, res) => {
    const routines = await Routine.getAll();
    res.json(routines);
};

const getRoutineById = async (req, res) => {
    const { rutinaId } = req.params;
    const routine = await Routine.getById(rutinaId);
    if (!routine) return res.status(404).json({ message: 'Rutina no encontrada' });
    res.json(routine);
};

// Aquí puedes agregar más controladores según los endpoints

module.exports = { getAllRoutines, getRoutineById };
