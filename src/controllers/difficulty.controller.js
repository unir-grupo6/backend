const DifficultyModel = require('../models/difficulty.model');

const getAll = async (req, res) => {
    try {
        const data = await DifficultyModel.selectAll();
        res.json(data);
    } catch (error) {
        console.error('Error al obtener las dificultades:', error);
        res.status(500).json({ message: 'Error al obtener las dificultades' });
    }
};

const getById = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        if (isNaN(id)) {
            return res.status(400).json({ message: 'ID inválido' });
        }

        const difficulty = await DifficultyModel.getById(id);
        if (!difficulty) {
            return res.status(404).json({ message: 'Dificultad no encontrada' });
        }

        res.json(difficulty);
    } catch (error) {
        console.error('Error al obtener la dificultad por ID:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
};

module.exports = {
    getAll,
    getById,
};
