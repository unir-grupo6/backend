const Rutines = require('../models/rutines.model')

const getAll = async (req, res) => {
    try{
        const rutines = await Rutines.selectAll();
        res.json(rutines); 
    }
    catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
    // Implement your logic here
}

const getById = async (req, res) => {
    const { id } = req.params;
    try {
        const rutine = await Rutines.getById(id);
        if (!rutine) {
            return res.status(404).json({ message: 'Rutine not found' });
        }
        res.json(rutine);
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
}


const getByGoalsAndDifficultyAndMethod = async (req, res) => {
    const { objetivos_id, dificultad_id, metodos_id } = req.query;
    try{
        const rutines = await Rutines.getBygoalsAndDifficultyAndMethod(objetivos_id, dificultad_id, metodos_id);
        if (!rutines) {
            return res.status(404).json({ message: 'No rutines found for the given criteria' });
        }
        res.json(rutines);
    }
    catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
}

module.exports = { getAll, getById, getByGoalsAndDifficultyAndMethod };