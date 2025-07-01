const cronRoutines = require('../models/cron-routines.model');

const { sendDailyUserRoutinesEmail } = require('../config/mailer');

const sendDailyUserRoutinesEmails = async () => {
    try {
        const userRoutines = await cronRoutines.selectDayUserRoutines();

        try {
            for (const routine of userRoutines) {
                const { nombre_rutina, nombre_usuario, email } = routine;
                await sendDailyUserRoutinesEmail(nombre_rutina, nombre_usuario, email);
            }
        } catch (error) {
            console.error('Error sending daily user routines emails:', error.message);
            
        }
    } catch (error) {
        console.error('Error fetching daily user routines:', error.message);
    }
}

module.exports = {
    sendDailyUserRoutinesEmails
};