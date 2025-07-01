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


const getFilteredRoutines = async (req, res) => {
  try {
    const { objetivos_id, dificultad_id, metodos_id } = req.query;
    const rutinas = await Rutines.rutinesFiltered(objetivos_id, dificultad_id, metodos_id);
    res.json(rutinas);
  } catch (error) {
    console.error('Error al obtener rutinas:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

module.exports = {
  getFilteredRoutines
};


module.exports = { getAll, getById, getFilteredRoutines };