const admin = require('./firebase');
const { getFirestore, FieldValue } = require('firebase-admin/firestore');
const nodemailer = require('nodemailer');

// Configuración del transporter de nodemailer para Gmail
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'obfuentesp@gmail.com', // Reemplaza con tu email
    pass: 'eodd wevm oprc eppu'     // Reemplaza con tu contraseña de aplicación de Gmail
  }
});

async function testEmail() {
  try {
    const db = getFirestore();
    const orderId = 'TEST-' + Date.now();

    // Crear un documento de prueba en Firestore
    await db.collection('solicitudes').doc(orderId + '-exito').set({
      nombre: 'Cliente de Prueba',
      empresa: 'Empresa de Prueba',
      sitio: 'sitio.com',
      cargo: 'Cargo de Prueba',
      email: 'cliente@prueba.com',
      tipo: 'Flow',
      estado: 'exito',
      amount: 20000,
      commerceOrder: orderId,
      fecha: FieldValue.serverTimestamp()
    });

    // Enviar correo de notificación
    const mailOptions = {
      from: 'obfuentesp@gmail.com',
      to: 'obfuentesp@gmail.com', // Reemplaza con tu email
      subject: 'Prueba: Nueva solicitud de informe SEO confirmada',
      text: `Se ha simulado un nuevo pago con Flow.\n\nDetalles:\n- Orden: ${orderId}\n- Monto: 20000\n- Cliente: Cliente de Prueba\n- Email: cliente@prueba.com`
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('[Error al enviar correo]', error);
      } else {
        console.log('[Correo enviado]', info.response);
      }
    });

    console.log('Prueba completada. Revisa tu correo.');
  } catch (error) {
    console.error('[Error en la prueba]', error);
  }
}

testEmail(); 