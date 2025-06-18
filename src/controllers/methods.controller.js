const MethodsModel = require('../models/methods.model');

const getAll = async (req, res) => {
    try {
        const data = await MethodsModel.selectAll();
        res.json(data);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving methods' });
    }
};

const getById = async (req, res) => {
    try {
        const id = Number(req.params.id);
        if (isNaN(id)) {
            return res.status(400).json({ message: 'Invalid ID' });
        }

        const metodo = await MethodsModel.getById(id);
        if (!metodo) {
            return res.status(404).json({ message: 'Method not found' });
        }

        res.json(metodo);
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
};

module.exports = {
    getAll,
    getById,
};
