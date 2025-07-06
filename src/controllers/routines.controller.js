const Routines = require('../models/routines.model');
const Exercises = require('../models/exercises.model');


const getAll = async (req, res) => {
  try {
    const routines = await Routines.selectAll();
    res.json(routines);
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
};

const getAllRoutines = async (req, res) => {
    const routines = await Routines.getAll();
    res.json(routines);
};

const getById = async (req, res) => {
  const { id } = req.params;
  try {
    const rutinaResult = await Routines.getById(id);
    if (!rutinaResult || rutinaResult.length === 0) {
      return res.status(404).json({ message: 'Routine not found' });
    }
    const rutina = rutinaResult[0];

    const ejercicios = await Routines.getEjerciciosByRutinaId(id);
    rutina.ejercicios = ejercicios || [];

    res.json(rutina);
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
};

const getRoutineById = async (req, res) => {
    const { routineId } = req.params;
    const routines = await Routines.getById(routineId);
    if (!routines) return res.status(404).json({ message: 'Rutina no encontrada' });
    res.json(routines);
};

const getRoutinesWithExercises = async (req, res) => {
    const routines = await Routines.getAll();
    const exercises = await Exercises.getAll();
    res.json({ routines, exercises });
};

const getFilteredRoutines = async (req, res) => {
  try {
    const { objetivos_id, dificultad_id, metodos_id } = req.query;
    const rows = await Routines.routinesFiltered(objetivos_id, dificultad_id, metodos_id);

    const rutinasMap = {};

    for (const row of rows) {
      const rutinaId = row.rutina_id;

      if (!rutinasMap[rutinaId]) {
        rutinasMap[rutinaId] = {
          id_rutina: rutinaId,
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
          id_ejercicio: row.ejercicio_id,
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
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

const getRoutineWithExercises = async (req, res) => {
    const { routineId } = req.params;
    // Obtener la rutina (devuelve array, tomar el primer elemento)
    const rutinaResult = await Routines.getById(routineId);
    if (!rutinaResult || rutinaResult.length === 0) {
        return res.status(404).json({ message: 'Rutina no encontrada' });
    }
    const rutina = rutinaResult[0];

    // Obtener los ejercicios de la rutina
    const ejerciciosRutina = await Routines.getEjerciciosByRutinaId(routineId);
    // Estructura: cada ejercicio es un objeto con los datos de la relación y del ejercicio
    rutina.ejercicios = ejerciciosRutina || [];

    res.json(rutina);
};

const getRoutineWithAllExercises = async (req, res) => {
    const { routineId } = req.params;
    const routines = await Routines.getById(routineId);
    if (!routines) return res.status(404).json({ message: 'Rutina no encontrada' });
    const exercises = await Exercises.getAll();
    res.json({ routines, exercises });
};

const createRoutine = async (req, res) => {
    const { dificultad_id, objetivos_id, metodos_id, nombre, observaciones } = req.body;
    if (!dificultad_id || !objetivos_id || !metodos_id || !nombre) {
        return res.status(400).json({ message: 'Faltan campos obligatorios' });
    }
    const result = await Routines.create({ dificultad_id, objetivos_id, metodos_id, nombre, observaciones });
    const newRoutine = await Routines.getById(result.insertId);
    res.status(201).json(newRoutine);
};

const updateRoutine = async (req, res) => {
    const { routineId } = req.params;
    const { dificultad_id, metodos_id, nombre, observaciones } = req.body;
    if (!dificultad_id || !metodos_id || !nombre) {
        return res.status(400).json({ message: 'Faltan campos obligatorios' });
    }
    const result = await Routines.update({ routineId, dificultad_id, metodos_id, nombre, observaciones });
    if (result.affectedRows === 0) {
        return res.status(404).json({ message: 'Rutina no encontrada' });
    }
    const updatedRoutine = await Routines.getById(routineId);
    res.json(updatedRoutine);
};

const addExerciseToRoutine = async (req, res) => {
    const { routineId } = req.params;
    const { ejercicios_id, series, repeticiones, dia, orden, comentario } = req.body;
    if (!ejercicios_id || !series || !repeticiones) {
        return res.status(400).json({ message: 'Faltan campos obligatorios' });
    }
    const result = await Routines.addExerciseToRoutine({
        rutinas_id: routineId,
        ejercicios_id,
        series,
        repeticiones,
        dia,
        orden,
        comentario
    });
    res.status(201).json({ message: 'Ejercicio añadido a la rutina', insertId: result.insertId });
};

const getPublicRoutinesWithExercises = async (req, res) => {
    const routines = await Routines.getAllPublic();
    const exercises = await Exercises.getAll();
    res.json({ routines, exercises });
};

const getRoutineShared = async (req, res) => {
  const user = req.user;
  try {
    const rows = await Routines.routinesShared(user.id);
    const rutinasMap = {};
    for (const row of rows) {
      const rutinaId = row.rutina_usuario_id;

      if (!rutinasMap[rutinaId]) {
        rutinasMap[rutinaId] = {
          id_rutina: rutinaId,
          nombre: row.rutina_nombre,
          observaciones: row.rutina_observaciones,
          compartida: row.compartida === 1, 

          objetivo: row.objetivo_nombre,
          dificultad: row.dificultad_nombre,
          metodo: row.metodo_nombre,

          ejercicios: []
        };
      }

      if (row.ejercicio_id) {
        rutinasMap[rutinaId].ejercicios.push({
          id_ejercicio: row.ejercicio_id,
          orden: row.orden,
          series: row.series,
          repeticiones: row.repeticiones,
          dia: row.dia,
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
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};





module.exports = {
  getAll,
  getById,
  getFilteredRoutines,
  getRoutineShared,
  getAllRoutines,
  getRoutineById,
  getRoutineWithExercises,
  getRoutinesWithExercises,
  getRoutineWithAllExercises,
  updateRoutine,
  createRoutine,
  addExerciseToRoutine,
  getPublicRoutinesWithExercises,
};
