const db = require('../config/db');

const autoGenerate = async (id) => {
    const [result] = await db.query('SELECT * FROM grupos_musculares');
    console.log(result, ' - VALOR DE RESULTADO EN MODELO');
    return result;
}

module.exports = {autoGenerate};
