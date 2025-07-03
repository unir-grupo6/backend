const db = require('../config/db');

const selectDayUserRoutines = async () => {

    const [result] = await db.query(
        `
        SELECT RU.id as rutina_id, R.nombre as nombre_rutina, U.nombre as nombre_usuario, email
        FROM rutinas_usuarios RU
            INNER JOIN rutinas R ON R.id = RU.rutinas_id
            INNER JOIN usuarios U ON U.id = RU.usuarios_id
        WHERE CURDATE() BETWEEN RU.inicio AND RU.fin AND RU.dia = WEEKDAY(CURDATE() + INTERVAL 1 DAY)
        ORDER BY RU.inicio DESC;
        `
    );
    return result;
}

module.exports = {
    selectDayUserRoutines
};