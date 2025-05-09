const nodemailer = require("nodemailer");
require("dotenv").config();

// Configura el transporter (puedes usar Gmail)
const transporter = nodemailer.createTransport({
  service: "gmail", // o cualquier otro servicio como 'outlook', 'hotmail', etc.
  auth: {
    user: process.env.EMAIL_USER, // tu dirección de correo
    pass: process.env.EMAIL_PASSWORD, // tu contraseña o contraseña de aplicación
  },
});

// Función para enviar correos
const sendEmail = async ({ to, from, subject, html, text }) => {
  try {
    const mailOptions = {
      from,
      to,
      subject,
      text: text || "",
      html: html || "",
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Email enviado: %s", info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error("Error al enviar correo:", error);
    return { success: false, error };
  }
};

module.exports = sendEmail;
