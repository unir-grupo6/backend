const nodemailer = require('nodemailer');
require('dotenv').config();

const renderTemplate = require('../utils/renderTemplate');
const resetPasswordTemplate = require('../templates/resetPassword.mjml');

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

transporter.verify()
  .then(() => console.log("Mailer is ready to send emails"))
  .catch(error => console.error("Error setting up mailer:", error));

const sendResetPasswordEmail = async (to_email, verificationLink, name) => {

  const htmlContent = renderTemplate(resetPasswordTemplate, { name, verificationLink });

  await transporter.sendMail({
    from: `"Rutina Go" <${GMAIL_APP_USER}>`,
    to: to_email,
    subject: 'Rutina Go - Restablece tu contraseña',
    text: `Hola ${name},\n\nPara restablecer tu contraseña, usa este enlace:\n${verificationLink}`,
    html: htmlContent,
  });
};

module.exports = {
  transporter,
  sendResetPasswordEmail,
};
