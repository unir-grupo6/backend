const Goal = require('../models/goals.model');

const getAll = async (req, res) => {
    try{
        const goals = await Goal.selectAll();
        res.json(goals);    
    }
    catch (error) {
        res.status(500).json({ message: 'Error retrieving goals' });
    }
}

const getById = async (req, res) => {
    try {
        const id = Number(req.params.id);
        if (isNaN(id)) {
            return res.status(400).json({ message: 'Invalid ID' });
        }

        const goal = await Goal.getById(id);
        if (!goal) {
            return res.status(404).json({ message: 'Goal not found' });
        }

        res.json(goal);
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
}   

module.exports = { getAll, getById };