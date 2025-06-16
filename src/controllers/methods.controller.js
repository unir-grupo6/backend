const MethodsModel = require('../models/methods.model');

const getAll = async (req, res) => {
    try {
        const data = await MethodsModel.selectAll();
        res.json(data);
    } catch (error) {
        console.error('Error al obtener los métodos:', error);
        res.status(500).json({ message: 'Error al obtener los métodos' });
    }
};

const getById = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        if (isNaN(id)) {
            return res.status(400).json({ message: 'ID inválido' });
        }

        const metodo = await MethodsModel.getById(id);
        if (!metodo) {
            return res.status(404).json({ message: 'Método no encontrado' });
        }

        res.json(metodo);
    } catch (error) {
        console.error('Error al obtener el método por ID:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
};

module.exports = {
    getAll,
    getById,
};
