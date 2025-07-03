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

const routinesFiltered = async (objetivos_id, dificultad_id, metodos_id) => {
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

  const [result] = await db.query(query, params);
  return result;
};

const routinesShared = async (user_id) => {
  try {
    const [result] = await db.query(`
      SELECT 
        ru.id as rutina_usuario_id, 
        ru.compartida, 
        r.nombre as rutina_nombre, 
        r.observaciones as rutina_observaciones, 
        o.nombre as objetivo_nombre, 
        d.nivel as dificultad_nombre, 
        m.nombre as metodo_nombre,
        eu.series,
        eu.repeticiones,
        eu.orden,
        eu.comentario as ejercicio_comentario,
        eu.rutinas_usuarios_id,
        e.nombre as ejercicio_nombre,
        e.tipo as ejercicio_tipo,
        e.inicio as step_1,
        e.fin as step_2,
        gm.nombre as grupo_muscular_nombre,
        er.dia,
        e.id as ejercicio_id
      FROM rutinas_usuarios ru
      INNER JOIN rutinas r ON ru.rutinas_id = r.id
      INNER JOIN objetivos o ON r.objetivos_id = o.id
      INNER JOIN dificultad d ON r.dificultad_id = d.id
      INNER JOIN metodos m ON r.metodos_id = m.id
      LEFT JOIN ejercicios_usuarios eu ON ru.id = eu.rutinas_usuarios_id
      LEFT JOIN ejercicios e ON eu.ejercicios_id = e.id
      LEFT JOIN grupos_musculares gm ON e.grupos_musculares_id = gm.id
      LEFT JOIN ejercicios_rutinas er ON e.id = er.ejercicios_id AND r.id = er.rutinas_id
      WHERE ru.compartida = 1 and ru.usuarios_id != ?
    `
    , [user_id]);
    return result;
  } catch (error) {
    console.error("Error al obtener las rutinas compartidas:", error);
    throw error;
  }
};



module.exports = {
  selectAll,
  getById,
  getEjerciciosByRutinaId,
  routinesFiltered,
  routinesShared
};
