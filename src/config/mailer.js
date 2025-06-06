const nodemailer = require('nodemailer');

require('dotenv').config();
const { GMAIL_APP_USER, GMAIL_APP_PASSWORD } = process.env;

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
        user: GMAIL_APP_USER,
        pass: GMAIL_APP_PASSWORD,
    },
});

transporter.verify().then(() => {
    console.log("Mailer is ready to send emails");
}).catch(error => {
    console.error("Error setting up mailer:", error);
});

module.exports = {
    transporter,
};