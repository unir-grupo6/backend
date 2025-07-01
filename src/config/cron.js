const cron = require('node-cron');
const { sendDailyUserRoutinesEmails } = require('../controllers/cron-routines.controller');

// Send daily user routines emails at 09:00 every day
cron.schedule('0 0 9 * * *', () => { // This cron job runs every day at 09:00
    console.log('Starting to send daily emails');
    sendDailyUserRoutinesEmails();
    console.log('Daily emails sent');
});