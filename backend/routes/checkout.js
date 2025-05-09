const express = require("express");
const db = require("../database");
const sendEmail = require("./nodemailer");
const router = express.Router();

router.post("/", async (req, res) => {
  const {
    nombre,
    apellido,
    dni,
    telefono,
    correo,
    direccion,
    ciudad,
    provincia,
    codigo_postal,
    referenciaDeEntrega,
    carritoId,
  } = req.body;

  try {
    // Determinar si es retiro en local o envío a domicilio
    const esRetiroEnLocal = referenciaDeEntrega === "retiro";

    console.log("Referencia de entrega:", referenciaDeEntrega);
    console.log("¿Es retiro en local?:", esRetiroEnLocal);

    // Crear una nueva entrada en la tabla checkout.
    const query =
      "INSERT INTO checkout (nombre, apellido, dni, telefono, correo, direccion, ciudad, provincia, codigo_postal, referenciaDeEntrega) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
    const values = [
      nombre,
      apellido,
      dni,
      telefono,
      correo,
      esRetiroEnLocal ? "Retiro en local" : direccion,
      esRetiroEnLocal ? null : ciudad,
      esRetiroEnLocal ? null : provincia,
      esRetiroEnLocal ? null : codigo_postal,
      referenciaDeEntrega,
    ];

    const [result] = await db.query(query, values);

    if (result.affectedRows > 0) {
      // Preparar sección de detalles de envío para el administrador - SIMPLIFICADA
      const seccionDetallesAdmin = esRetiroEnLocal
        ? `<div style="margin-bottom: 20px;">
            <h2 style="color: #0056b3; margin-bottom: 15px;">Método de entrega:</h2>
            <p><strong>Tipo:</strong> Retiro en local</p>
          </div>`
        : `<div style="margin-bottom: 20px;">
            <h2 style="color: #0056b3; margin-bottom: 15px;">Detalles de envío:</h2>
            <p><strong>Dirección:</strong> ${direccion || "No especificada"}</p>
            <p><strong>Ciudad:</strong> ${ciudad || "No especificada"}</p>
            <p><strong>Provincia:</strong> ${provincia || "No especificada"}</p>
            <p><strong>Código postal:</strong> ${
              codigo_postal || "No especificado"
            }</p>
          </div>`;

      // Preparar sección de detalles de envío para el cliente - DETALLADA
      const seccionDetallesCliente = esRetiroEnLocal
        ? `<div style="margin-bottom: 20px;">
            <h2 style="color: #0056b3; margin-bottom: 15px;">Detalles de retiro:</h2>
            <p><strong>Método:</strong> Retiro en local</p>
            <p><strong>Dirección de retiro:</strong> Av. Principal 123, Ciudad</p>
            <p><strong>Horario de atención:</strong> Lunes a Viernes 9:00 - 18:00</p>
          </div>`
        : `<div style="margin-bottom: 20px;">
            <h2 style="color: #0056b3; margin-bottom: 15px;">Detalles de envío:</h2>
            <p><strong>Dirección:</strong> ${direccion || "No especificada"}</p>
            <p><strong>Ciudad:</strong> ${ciudad || "No especificada"}</p>
            <p><strong>Provincia:</strong> ${provincia || "No especificada"}</p>
            <p><strong>Código postal:</strong> ${
              codigo_postal || "No especificado"
            }</p>
          </div>`;

      // Correo para el administrador con estilo mejorado
      await sendEmail({
        to: "lautarojimenez02@gmail.com",
        from: process.env.EMAIL_USER,
        subject: "Nuevo Pedido Exitoso",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 5px;">
            <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin-bottom: 20px;">
              <h1 style="color: #0056b3; text-align: center; margin-bottom: 20px;">Nuevo Pedido Recibido</h1>
              <p style="font-size: 16px; color: #333;">Se ha registrado un nuevo pedido con los siguientes detalles:</p>
            </div>
            
            <div style="margin-bottom: 20px;">
              <h2 style="color: #0056b3; margin-bottom: 15px;">Datos del cliente:</h2>
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 8px; border-bottom: 1px solid #ddd;"><strong>Nombre completo:</strong></td>
                  <td style="padding: 8px; border-bottom: 1px solid #ddd;">${nombre} ${apellido}</td>
                </tr>
                <tr>
                  <td style="padding: 8px; border-bottom: 1px solid #ddd;"><strong>DNI:</strong></td>
                  <td style="padding: 8px; border-bottom: 1px solid #ddd;">${dni}</td>
                </tr>
                <tr>
                  <td style="padding: 8px; border-bottom: 1px solid #ddd;"><strong>Correo:</strong></td>
                  <td style="padding: 8px; border-bottom: 1px solid #ddd;">${correo}</td>
                </tr>
                <tr>
                  <td style="padding: 8px; border-bottom: 1px solid #ddd;"><strong>Teléfono:</strong></td>
                  <td style="padding: 8px; border-bottom: 1px solid #ddd;">${telefono}</td>
                </tr>
              </table>
            </div>
            
            ${seccionDetallesAdmin}
            
            <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin-top: 20px; text-align: center;">
              <p style="margin: 0;">Este correo fue generado automáticamente. Por favor no responder.</p>
            </div>
          </div>
        `,
      });

      // Correo para el cliente con estilo mejorado
      await sendEmail({
        to: correo,
        from: process.env.EMAIL_USER,
        subject: "Confirmación de tu pedido",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 5px;">
            <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin-bottom: 20px; text-align: center;">
              <h1 style="color: #0056b3; margin-bottom: 10px;">¡Gracias por tu pedido!</h1>
              <p style="font-size: 16px; color: #333;">Pedido #${
                result.insertId
              }</p>
            </div>
            
            <div style="margin-bottom: 20px;">
              <p style="font-size: 16px; color: #333; line-height: 1.5;">Hola <strong>${nombre}</strong>,</p>
              <p style="font-size: 16px; color: #333; line-height: 1.5;">Hemos recibido tu pedido correctamente. Gracias por confiar en nosotros.</p>
              <p style="font-size: 16px; color: #333; line-height: 1.5;">Pronto nos pondremos en contacto contigo ${
                esRetiroEnLocal
                  ? "para coordinar el retiro de tu pedido"
                  : "para coordinar la entrega"
              }.</p>
            </div>
            
            ${seccionDetallesCliente}
            
            <div style="margin-bottom: 20px;">
              <p style="font-size: 16px; color: #333; line-height: 1.5;">Si tienes alguna pregunta, no dudes en contactarnos:</p>
              <p style="font-size: 16px; color: #333; line-height: 1.5;">📞 Teléfono: (123) 456-7890</p>
              <p style="font-size: 16px; color: #333; line-height: 1.5;">✉️ Email: info@tuempresa.com</p>
            </div>
            
            <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin-top: 20px; text-align: center;">
              <p style="margin: 0;">¡Gracias por tu compra!</p>
            </div>
          </div>
        `,
      });

      res
        .status(200)
        .json({ message: "Checkout realizado con éxito y correo enviado." });
    } else {
      throw new Error("El proceso de checkout no pudo ser completado.");
    }
  } catch (error) {
    console.error("Error al procesar el checkout:", error);
    res.status(500).json({ message: "Error interno del servidor." });
  }
});

module.exports = router;
