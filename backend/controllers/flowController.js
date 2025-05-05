const axios = require('axios');
const crypto = require('crypto');
const qs = require('querystring');
const admin = require('../firebase');
const { getFirestore, setDoc, FieldValue } = require('firebase-admin/firestore');
const nodemailer = require('nodemailer');

const FLOW_API_URL = 'https://www.flow.cl/api/payment/create';
const FLOW_STATUS_URL = 'https://www.flow.cl/api/payment/getStatus';
const API_KEY = process.env.FLOW_API_KEY || 'TU_API_KEY_SANDBOX';
const SECRET_KEY = process.env.FLOW_SECRET_KEY || 'TU_SECRET_KEY_SANDBOX';

// Configuración del transporter de nodemailer para Gmail
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'obfuentesp@gmail.com', // Reemplaza con tu email
    pass: 'eodd wevm oprc eppu '     // Reemplaza con tu contraseña de aplicación de Gmail
  }
});

function signParams(params, secretKey) {
  const keys = Object.keys(params).sort();
  let toSign = '';
  keys.forEach(key => {
    toSign += key + params[key];
  });
  const signature = crypto.createHmac('sha256', secretKey).update(toSign).digest('hex');
  return signature;
}

function getEstadoFromStatus(status) {
  switch (Number(status)) {
    case 2: return 'exito';
    case 3: return 'rechazado';
    case 4: return 'anulado';
    default: return 'error';
  }
}

exports.createFlowPayment = async (req, res) => {
  try {
    const { nombre, email, sitio, empresa, cargo } = req.body;
    const orderId = 'ORD-' + Date.now();
    const isProd = process.env.NODE_ENV === 'production';
    const baseUrl = isProd ? 'https://seo20.dev' : 'http://localhost:3000';

    const emailLimpio = (email || '').trim();

    const params = {
      apiKey: API_KEY,
      commerceOrder: orderId,
      subject: 'Informe SEO Técnico',
      currency: 'CLP',
      amount: 20000,
      email: emailLimpio,
      urlConfirmation: `${baseUrl}/api/flow/confirm`,
      urlReturn: `${baseUrl}/confirmacion`
    };
    params.s = signParams(params, SECRET_KEY);

    const response = await axios.post(
      FLOW_API_URL,
      qs.stringify(params),
      { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
    );

    try {
      const db = getFirestore();
      await db.collection('solicitudes').doc(orderId + '-pendiente').set({
        nombre: nombre || '',
        empresa: empresa || '',
        sitio: sitio || '',
        cargo: cargo || '',
        email: emailLimpio || '',
        estado: 'pendiente',
        fecha: FieldValue.serverTimestamp()
      }, { merge: true });
    } catch (e) {
      console.error('[Firestore Error - Guardado Pendiente]', e);
    }

    res.json({ ...response.data, orderId });
  } catch (err) {
    console.error('[Flow Error]', err.message);
    res.status(500).json({ error: 'Error al crear pago con Flow', detalle: err.message, flow: err.response?.data });
  }
};

exports.confirmFlowPayment = async (req, res) => {
  let flowResponse = null;
  try {
    const token =
      req.query.token ||
      req.query.token_ws ||
      req.query.TBK_TOKEN ||
      req.body.token ||
      req.body.token_ws ||
      req.body.TBK_TOKEN ||
      (typeof req.body === 'string' ? req.body : undefined) ||
      (typeof req.body === 'object' && Object.keys(req.body).length === 1
        ? req.body[Object.keys(req.body)[0]]
        : undefined);

    if (!token) {
      return res.status(400).json({ error: 'Token no válido' });
    }

    const params = { apiKey: API_KEY, token };
    params.s = signParams(params, SECRET_KEY);

    const response = await axios.get(FLOW_STATUS_URL, { params });
    flowResponse = response.data;

    const statusStr = getEstadoFromStatus(flowResponse.status);

    if (flowResponse.commerceOrder) {
      try {
        const db = getFirestore();
        const pendienteDoc = await db.collection('solicitudes').doc(`${flowResponse.commerceOrder}-pendiente`).get();
        const datosForm = pendienteDoc.exists ? pendienteDoc.data() : {};

        await db.collection('solicitudes').doc(flowResponse.commerceOrder + '-' + statusStr).set({
          ...datosForm,
          tipo: 'Flow',
          estado: statusStr,
          amount: flowResponse.amount,
          payer: flowResponse.payer,
          commerceOrder: flowResponse.commerceOrder,
          fecha: FieldValue.serverTimestamp()
        }, { merge: true });

        // Enviar correo de notificación si el pago fue exitoso
        if (statusStr === 'exito') {
          const mailOptions = {
            from: 'tu_email@gmail.com',
            to: 'tu_email@gmail.com', // Reemplaza con tu email
            subject: 'Nueva solicitud de informe SEO confirmada',
            text: `Se ha confirmado un nuevo pago con Flow.\n\nDetalles:\n- Orden: ${flowResponse.commerceOrder}\n- Monto: ${flowResponse.amount}\n- Cliente: ${datosForm.nombre || 'No especificado'}\n- Email: ${datosForm.email || 'No especificado'}`
          };

          transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
              console.error('[Error al enviar correo]', error);
            } else {
              console.log('[Correo enviado]', info.response);
            }
          });
        }
      } catch (e) {
        console.error('[Firestore Error - Confirmación]', e);
      }
    }

    flowResponse.estado = statusStr;
    res.json(flowResponse);
  } catch (err) {
    console.error('[Flow Confirm Error]', err);
    if (flowResponse) {
      return res.json(flowResponse);
    }
    res.status(500).json({ error: 'Error confirmando pago', detalle: err.message });
  }
};

exports.getFlowStatus = async (req, res) => {
  try {
    const { token, buyOrder, nombre, empresa, sitio, cargo, email } = req.body;
    if (!token) return res.status(400).json({ error: 'Falta token' });

    const params = { apiKey: API_KEY, token };
    params.s = signParams(params, SECRET_KEY);

    const response = await axios.get(FLOW_STATUS_URL, { params });
    let responseData = { ...response.data, buyOrder };

    if (typeof responseData.status !== 'undefined') {
      responseData.status = Number(responseData.status);
      responseData.estado = getEstadoFromStatus(responseData.status);
    }

    if (buyOrder && (nombre || empresa || sitio || cargo || email)) {
      try {
        const db = getFirestore();
        await db.collection('solicitudes').doc(buyOrder).set({
          nombre: nombre || '',
          empresa: empresa || '',
          sitio: sitio || '',
          cargo: cargo || '',
          email: email || ''
        }, { merge: true });
      } catch (e) {
        console.error('[Firestore Error - Status Update]', e);
      }
    }

    res.json(responseData);
  } catch (err) {
    console.error('[Flow Status Error]', err.message);
    res.status(500).json({ error: 'Error consultando estado en Flow', detalle: err.message });
  }
};