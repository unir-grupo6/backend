const db = require('../config/db');

const selectAll = async () => {
  const [result] = await db.query('SELECT * FROM rutinas');
  return result;
};

const getById = async (id) => {
  const [result] = await db.query(
    `SELECT 
        r.id AS rutina_id,
        r.nombre,
        r.observaciones AS rutina_observaciones,
        r.realizada,
        
        d.nivel AS dificultad_nombre,
     
        m.nombre AS metodo_nombre,
        m.tiempo_aerobicos,
        m.tiempo_anaerobicos,
        m.observaciones AS metodo_observaciones,
        m.descanso,
        
        o.nombre AS objetivo_nombre

      FROM rutinas r
      JOIN dificultad d ON r.dificultad_id = d.id
      JOIN metodos m ON r.metodos_id = m.id
      JOIN objetivos o ON r.objetivos_id = o.id
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
      r.observaciones AS rutina_observaciones,
      r.realizada,

      o.nombre AS objetivo_nombre,
      d.nivel AS dificultad_nombre,
      m.nombre AS metodo_nombre,

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
      gm.nombre AS grupo_muscular_nombre

    FROM rutinas r
    LEFT JOIN objetivos o ON r.objetivos_id = o.id
    LEFT JOIN dificultad d ON r.dificultad_id = d.id
    LEFT JOIN metodos m ON r.metodos_id = m.id
    LEFT JOIN ejercicios_rutinas er ON r.id = er.rutinas_id
    LEFT JOIN ejercicios e ON er.ejercicios_id = e.id
    LEFT JOIN grupos_musculares gm ON e.grupos_musculares_id = gm.id
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
  return rows;
};


module.exports = {
  selectAll,
  getById,
  getEjerciciosByRutinaId,
  rutinesFiltered,
};
