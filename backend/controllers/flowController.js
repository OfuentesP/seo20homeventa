const axios = require('axios');
const crypto = require('crypto');
const qs = require('querystring');

const FLOW_API_URL = 'https://www.flow.cl/api/payment/create';
const FLOW_STATUS_URL = 'https://www.flow.cl/api/payment/getStatus';
const API_KEY = process.env.FLOW_API_KEY || 'TU_API_KEY_SANDBOX';
const SECRET_KEY = process.env.FLOW_SECRET_KEY || 'TU_SECRET_KEY_SANDBOX';

function signParams(params, secretKey) {
  const keys = Object.keys(params).sort();
  let toSign = '';
  keys.forEach(key => {
    toSign += key + params[key];
  });
  console.log('[Flow] String a firmar:', toSign);
  const signature = crypto.createHmac('sha256', secretKey).update(toSign).digest('hex');
  console.log('[Flow] Firma generada:', signature);
  return signature;
}

exports.createFlowPayment = async (req, res) => {
  try {
    const { nombre, email, sitio } = req.body;
    const orderId = 'ORD-' + Date.now();
    const isProd = process.env.NODE_ENV === 'production';
    const baseUrl = isProd ? 'https://seo20.dev' : 'http://localhost:3000';
    // Limpia el email y loguea tipo y valor
    const emailLimpio = (email || '').trim();
    console.log('[Flow][DEBUG] Email recibido:', email, '| Email limpio:', emailLimpio, '| Tipo:', typeof emailLimpio);
    console.log('[Flow][DEBUG] Entorno NODE_ENV:', process.env.NODE_ENV);
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
    // Log detallado de los parámetros
    Object.entries(params).forEach(([k, v]) => {
      console.log(`[Flow][param] ${k}:`, v);
    });
    // Validación rápida
    const missing = Object.entries(params).filter(([k, v]) => v === undefined || v === null || v === '').map(([k]) => k);
    if (missing.length) {
      console.error('[Flow][ERROR] Faltan parámetros:', missing);
    }
    console.log('[Flow] Intentando crear pago con params:', params);
    const response = await axios.post(
      FLOW_API_URL,
      qs.stringify(params),
      { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
    );
    console.log('[Flow] Respuesta de Flow:', response.data);
    res.json({ ...response.data, orderId });
  } catch (err) {
    console.error('[Flow Error]', err.message);
    if (err.response) {
      console.error('[Flow Error Response]', err.response.data);
    }
    res.status(500).json({ error: 'Error al crear pago con Flow', detalle: err.message, flow: err.response?.data });
  }
};

exports.confirmFlowPayment = async (req, res) => {
  try {
    const { token } = req.body;
    if (!token) return res.status(400).send('Falta token');
    const params = {
      apiKey: API_KEY,
      token
    };
    params.s = signParams(params, SECRET_KEY);
    const response = await axios.get(FLOW_STATUS_URL, { params });
    console.log('[Flow Confirm] Estado recibido:', response.data);
    // Aquí puedes guardar el estado del pago en tu base de datos o Firestore
    res.send('OK');
  } catch (err) {
    console.error('[Flow Confirm Error]', err.response?.data || err.message);
    res.status(500).send('Error confirmando pago');
  }
};

// Endpoint para consultar el estado de una transacción en Flow
exports.getFlowStatus = async (req, res) => {
  try {
    const { token, buyOrder } = req.body;
    console.log('[Flow][Status] Consultando estado para token:', token, 'buyOrder:', buyOrder);
    if (!token) return res.status(400).json({ error: 'Falta token' });
    const params = {
      apiKey: API_KEY,
      token
    };
    params.s = signParams(params, SECRET_KEY);
    const response = await axios.get(FLOW_STATUS_URL, { params });
    console.log('[Flow][Status] Respuesta de Flow:', response.data);
    // Si el estado es anulado/cancelado o rechazado, guarda en la base de datos
    if (response.data.status !== 'AUTHORIZED' && buyOrder) {
      // Guardar en Firestore como anulado (solo si tienes Firestore configurado en el backend)
      try {
        const { getFirestore, doc, setDoc, serverTimestamp } = require('firebase-admin/firestore');
        const db = getFirestore();
        const estado = response.data.status === 'FAILED' ? 'rechazado' : 'anulado';
        console.log(`[Flow][Status] Guardando en Firestore como ${estado}`, buyOrder);
        await setDoc(doc(db, 'solicitudes', buyOrder), {
          tipo: 'Flow',
          detalles: response.data,
          estado: estado,
          fecha: serverTimestamp()
        }, { merge: true });
        console.log('[Flow][Status] Guardado exitoso en Firestore');
      } catch (e) {
        console.error('[❌ Error guardando en Firestore]', e);
      }
    }
    res.json({ ...response.data, buyOrder }); // Incluye el buyOrder en la respuesta
  } catch (err) {
    console.error('[Flow][Status] Error:', err.message);
    if (err.response) {
      console.error('[Flow][Status] Error Response:', err.response.data);
    }
    res.status(500).json({ error: 'Error consultando estado en Flow', detalle: err.message });
  }
}; 