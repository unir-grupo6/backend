const Rutines = require('../models/rutines.model');

const getAll = async (req, res) => {
  try {
    const rutines = await Rutines.selectAll();
    res.json(rutines);
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
};

const getById = async (req, res) => {
  const { id } = req.params;
  try {
    const rutinaResult = await Rutines.getById(id);
    if (!rutinaResult || rutinaResult.length === 0) {
      return res.status(404).json({ message: 'Rutine not found' });
    }
    const rutina = rutinaResult[0];

    const ejercicios = await Rutines.getEjerciciosByRutinaId(id);
    rutina.ejercicios = ejercicios || [];

    res.json(rutina);
  } catch (error) {
    console.error('Error en obtener rutina por id con ejercicios:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const getFilteredRoutines = async (req, res) => {
  try {
    const { objetivos_id, dificultad_id, metodos_id } = req.query;
    const rows = await Rutines.rutinesFiltered(objetivos_id, dificultad_id, metodos_id);

    const rutinasMap = {};

    for (const row of rows) {
      const rutinaId = row.rutina_id;

      if (!rutinasMap[rutinaId]) {
        rutinasMap[rutinaId] = {
          id: rutinaId,
          nombre: row.rutina_nombre,
          observaciones: row.rutina_observaciones,
          realizada: row.realizada,

          objetivo: row.objetivo_nombre,
          dificultad: row.dificultad_nombre,
          metodo: row.metodo_nombre,

          ejercicios: []
        };
      }

      if (row.ejercicio_id) {
        rutinasMap[rutinaId].ejercicios.push({
          id: row.ejercicio_id,
          orden: row.orden,
          series: row.series,
          repeticiones: row.repeticiones,
          comentario: row.ejercicio_comentario,
          nombre: row.ejercicio_nombre,
          tipo: row.ejercicio_tipo,
          step_1: row.step_1,
          step_2: row.step_2,
          grupos_musculares: row.grupo_muscular_nombre
        });
      }
    }

    res.json(Object.values(rutinasMap));
  } catch (error) {
    console.error('Error al obtener rutinas:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};



module.exports = {
  getAll,
  getById,
  getFilteredRoutines,
};
