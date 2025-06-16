const MuscleGroupsModel = require('../models/muscle-groups.model');

const getAll = async (req, res) => {
    try {
        const data = await MuscleGroupsModel.selectAll();
        res.json(data);
    } catch (error) {
        console.error('Error al obtener los grupos musculares:', error);
        res.status(500).json({ message: 'Error al obtener los grupos musculares' });
    }
};

const getById = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        if (isNaN(id)) {
            return res.status(400).json({ message: 'ID inválido' });
        }

        const group = await MuscleGroupsModel.getById(id);
        if (!group) {
            return res.status(404).json({ message: 'Grupo muscular no encontrado' });
        }

        res.json(group);
    } catch (error) {
        console.error('Error al obtener el grupo muscular por ID:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
};

module.exports = {
    getAll,
    getById,
};
