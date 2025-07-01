const db = require('../config/db');

const selectAll = async () => {
    const [result] = await db.query('SELECT * FROM rutinas');
    return result;
}


const getById = async (id) => {
  try {
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
        WHERE r.id = ?`, [id]
    );

    if (!result || result.length === 0) return null;
    const rutina = result[0];

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

    rutina.ejercicios = ejercicios || [];
    return rutina;
  } catch (error) {
    console.error('Error en obtener rutina por id con ejercicios:', error);
    throw error;
  }
}


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
      e.inicio AS ejercicio_inicio,
      e.fin AS ejercicio_fin,
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
    query += ' WHERE ' + conditions.join(' AND ');
  }

  const [rows] = await db.query(query, params);

  // Agrupar por rutina_id
  const rutinasMap = {};

  for (const row of rows) {
    const rutinaId = row.rutina_id;

    if (!rutinasMap[rutinaId]) {
      rutinasMap[rutinaId] = {
        id: row.rutina_id,
        nombre: row.rutina_nombre,
        objetivos_id: row.objetivos_id,
        dificultad_id: row.dificultad_id,
        metodos_id: row.metodos_id,
        observaciones: row.rutina_observaciones,
        realizada: row.realizada,
        ejercicios: []
      };
    }

    if (row.ejercicio_id) {
      rutinasMap[rutinaId].ejercicios.push({
        id: row.ejercicio_id,
        nombre: row.ejercicio_nombre,
        tipo: row.ejercicio_tipo,
        inicio: row.ejercicio_inicio,
        fin: row.ejercicio_fin,
        grupos_musculares_id: row.grupos_musculares_id,
        dificultad_id: row.ejercicio_dificultad_id,
        series: row.series,
        repeticiones: row.repeticiones,
        dia: row.dia,
        orden: row.orden,
        comentario: row.ejercicio_comentario
      });
    }
  }

  return Object.values(rutinasMap);
};




module.exports = {
    selectAll,
    getById,
    rutinesFiltered
}