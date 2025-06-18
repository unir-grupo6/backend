const DifficultyModel = require('../models/difficulties.model');

const getAll = async (req, res) => {
    try {
        const data = await DifficultyModel.selectAll();
        res.json(data);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving difficulties' });
    }
};

const getById = async (req, res) => {
    try {
        const id = Number(req.params.id);
        if (isNaN(id)) {
            return res.status(400).json({ message: 'Invalid ID' });
        }

        const difficulty = await DifficultyModel.getById(id);
        if (!difficulty) {
            return res.status(404).json({ message: 'Difficulty not found' });
        }

        res.json(difficulty);
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
};

module.exports = {
    getAll,
    getById,
};
