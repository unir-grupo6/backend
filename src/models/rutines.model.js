// Modelo para rutines
const db = require('../config/db');

const getAll = async () => {
    const [result] = await db.query('SELECT * FROM rutinas');
    return result;
};

const selectAll = async () => {
  const [result] = await db.query('SELECT * FROM rutinas');
  return result;
};

// const getById = async (id) => {
//     const [result] = await db.query('SELECT * FROM rutinas WHERE id = ?', [id]);
//     if (result.length === 0) return null;
//     return result[0];
// };

const getById = async (id) => {
  const [result] = await db.query(
    `SELECT 
        r.id AS rutina_id,
        r.nombre,
        r.observaciones AS rutina_observaciones,
        r.realizada,
        r.dificultad_id,
        r.metodos_id,
        r.objetivos_id,
        d.nivel,
        m.nombre AS metodo_nombre,
        m.tiempo_aerobicos,
        m.tiempo_anaerobicos,
        m.observaciones AS metodo_observaciones,
        m.descanso
      FROM rutinas r
      JOIN dificultad d ON r.dificultad_id = d.id
      JOIN metodos m ON r.metodos_id = m.id
      WHERE r.id = ?`,
    [id]
  );
  return result;
};

const getEjerciciosByRutinaId = async (id) => {
  const [ejercicios] = await db.query(
    `
    SELECT 
      er.id,
      er.orden,
      er.series,
      er.repeticiones,
      er.comentario,
      e.nombre,
      e.tipo,
      e.inicio AS step_1,
      e.fin AS step_2,
      gm.nombre AS grupos_musculares
    FROM ejercicios_rutinas er
    JOIN ejercicios e ON er.ejercicios_id = e.id
    JOIN grupos_musculares gm ON e.grupos_musculares_id = gm.id
    WHERE er.rutinas_id = ?
    ORDER BY er.orden ASC
    `,
    [id]
  );
  return ejercicios;
};

const rutinesFiltered = async (objetivos_id, dificultad_id, metodos_id) => {
  let query = `
    SELECT 
      r.id AS rutina_id,
      r.nombre AS rutina_nombre,
      r.objetivos_id,
      r.dificultad_id,
      r.metodos_id,
      r.observaciones AS rutina_observaciones,
      r.realizada,

      er.series,
      er.repeticiones,
      er.dia,
      er.orden,
      er.comentario AS ejercicio_comentario,

      e.id AS ejercicio_id,
      e.nombre AS ejercicio_nombre,
      e.tipo AS ejercicio_tipo,
      e.inicio AS step_1,
      e.fin AS step_2,
      e.grupos_musculares_id,
      e.dificultad_id AS ejercicio_dificultad_id

    FROM rutinas r
    LEFT JOIN ejercicios_rutinas er ON r.id = er.rutinas_id
    LEFT JOIN ejercicios e ON er.ejercicios_id = e.id
  `;

  const conditions = [];
  const params = [];

  if (objetivos_id) {
    conditions.push('r.objetivos_id = ?');
    params.push(objetivos_id);
  }
  if (dificultad_id) {
    conditions.push('r.dificultad_id = ?');
    params.push(dificultad_id);
  }
  if (metodos_id) {
    conditions.push('r.metodos_id = ?');
    params.push(metodos_id);
  }

  if (conditions.length > 0) {
    query += ` WHERE ${conditions.join(' AND ')}`;
  }

  const [rows] = await db.query(query, params);
  return rows;
};



const getExercisesByRutineId = async (rutineId) => {
    const [result] = await db.query('SELECT * FROM ejercicios_rutinas WHERE rutinas_id = ?', [rutineId]);
    return result;
};

const create = async ({ dificultad_id, objetivos_id, metodos_id, nombre, observaciones }) => {
    const [result] = await db.query(
        'INSERT INTO rutinas (dificultad_id, objetivos_id, metodos_id, nombre, observaciones) VALUES (?, ?, ?, ?, ?)',
        [dificultad_id, objetivos_id, metodos_id, nombre, observaciones]
    );
    return result;
};

const update = async ({ rutineId, dificultad_id, metodos_id, nombre, observaciones }) => {
    const [result] = await db.query(
        'UPDATE rutinas SET dificultad_id = ?, metodos_id = ?, nombre = ?, observaciones = ? WHERE id = ?',
        [dificultad_id, metodos_id, nombre, observaciones, rutineId]
    );
    return result;
};

const addExerciseToRutine = async ({ rutinas_id, ejercicios_id, series, repeticiones, dia, orden, comentario }) => {
    const [result] = await db.query(
        'INSERT INTO ejercicios_rutinas (rutinas_id, ejercicios_id, series, repeticiones, dia, orden, comentario) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [rutinas_id, ejercicios_id, series, repeticiones, dia, orden, comentario]
    );
    return result;
};

const getAllPublic = async () => {
    const [result] = await db.query('SELECT * FROM rutinas WHERE compartida = 1');
    return result;
};

module.exports = { getAll, getById, getEjerciciosByRutinaId, rutinesFiltered, create, update, addExerciseToRutine, getAllPublic, selectAll };