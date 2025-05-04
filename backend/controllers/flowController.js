const axios = require('axios');
const crypto = require('crypto');
const qs = require('querystring');
const admin = require('../firebase');
const { getFirestore, setDoc, FieldValue } = require('firebase-admin/firestore');

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
      amount: 1000,
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
  let flowResponse = null;
  try {
    console.log('[Flow Confirm] req.query:', req.query);
    console.log('[Flow Confirm] req.body:', req.body);

    // Extrae el token de todos los posibles lugares y formatos
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
      console.error('[Flow Confirm Error] Token no encontrado');
      return res.status(400).json({ error: 'Token no válido' });
    }

    const params = {
      apiKey: API_KEY,
      token
    };
    params.s = signParams(params, SECRET_KEY);
    const response = await axios.get(FLOW_STATUS_URL, { params });
    flowResponse = response.data;
    console.log('[Flow Confirm] Estado recibido:', flowResponse);

    // Guarda en Firestore si commerceOrder está presente
    if (flowResponse.commerceOrder) {
      try {
        const db = getFirestore();
        const ref = db.collection('solicitudes').doc(flowResponse.commerceOrder);
        await ref.set({
          tipo: 'Flow',
          estado: flowResponse.status === 2 ? 'exito' : flowResponse.status === 3 ? 'rechazado' : flowResponse.status === 4 ? 'anulado' : 'otro',
          amount: flowResponse.amount,
          payer: flowResponse.payer,
          commerceOrder: flowResponse.commerceOrder,
          nombre: req.body.nombre || '',
          empresa: req.body.empresa || '',
          sitio: req.body.sitio || '',
          cargo: req.body.cargo || '',
          email: req.body.email || '',
          fecha: FieldValue.serverTimestamp()
        }, { merge: true });
        console.log('[Flow Confirm] Guardado en Firestore:', flowResponse.commerceOrder);
      } catch (e) {
        console.error('[Flow Confirm][Firestore Error]', e);
        // NO lanzar error, solo loguear
      }
    }

    res.json(flowResponse);
  } catch (err) {
    console.error('[Flow Confirm Error]', err);
    if (flowResponse) {
      return res.json(flowResponse);
    }
    res.status(500).json({ error: 'Error confirmando pago', detalle: err.message });
  }
};

// Endpoint para consultar el estado de una transacción en Flow
exports.getFlowStatus = async (req, res) => {
  try {
    const { token, buyOrder, nombre, empresa, sitio, cargo, email } = req.body;
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
    if (buyOrder && (nombre || empresa || sitio || cargo || email)) {
      try {
        const db = getFirestore();
        const ref = db.collection('solicitudes').doc(buyOrder);
        await ref.set({
          nombre: nombre || '',
          empresa: empresa || '',
          sitio: sitio || '',
          cargo: req.body.cargo || '',
          email: req.body.email || ''
        }, { merge: true });
        console.log('[Flow][Status] Actualizados datos de formulario en Firestore:', buyOrder);
      } catch (e) {
        console.error('[❌ Error actualizando datos de formulario en Firestore]', e);
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