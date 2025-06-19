const MuscleGroupsModel = require('../models/muscle-groups.model');

const getAll = async (req, res) => {
    try {
        const data = await MuscleGroupsModel.selectAll();
        res.json(data);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving muscle groups' });
    }
};

const getById = async (req, res) => {
    try {
        const id = Number(req.params.id);
        if (isNaN(id)) {
            return res.status(400).json({ message: 'Invalid ID' });
        }

        const group = await MuscleGroupsModel.getById(id);
        if (!group) {
            return res.status(404).json({ message: 'Muscle group not found' });
        }

        res.json(group);
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
};

module.exports = {
    getAll,
    getById,
};
