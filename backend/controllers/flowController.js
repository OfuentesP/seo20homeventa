const axios = require('axios');
const crypto = require('crypto');

const FLOW_API_URL = 'https://sandbox.flow.cl/api/payment/create';
const FLOW_STATUS_URL = 'https://sandbox.flow.cl/api/payment/getStatus';
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
    const baseUrl = isProd ? 'https://seo10.dev' : 'http://localhost:3000';
    const params = {
      apiKey: API_KEY,
      commerceOrder: orderId,
      subject: 'Informe SEO Técnico',
      currency: 'CLP',
      amount: 20000,
      email: email,
      urlConfirmation: `${baseUrl}/api/flow/confirm`,
      urlReturn: `${baseUrl}/confirmacion`
    };
    params.s = signParams(params, SECRET_KEY);
    console.log('[Flow] Intentando crear pago con params:', params);
    const response = await axios.post(FLOW_API_URL, null, { params });
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