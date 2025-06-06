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

const sendResetPasswordEmail = async (to_email, verificationLink) => {
    transporter.sendMail({
            from: `"Rutina Go" <${process.env.GMAIL_APP_USER}>`,
            to: to_email,
            subject: 'Rutina Go - Password Reset',
            text: 'Click the link below to reset your password',
            html: `<p>Click the link below to reset your password:</p><a href="${verificationLink}">${verificationLink}</a>`
            })
}

module.exports = {
    transporter,
    sendResetPasswordEmail,
};