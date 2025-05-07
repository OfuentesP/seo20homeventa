const { WebpayPlus, IntegrationApiKeys, IntegrationCommerceCodes, Environment } = require('transbank-sdk');
const { getFirestore, FieldValue } = require('firebase-admin/firestore');
const axios = require('axios');

// ✅ Configuración correcta
WebpayPlus.configureForProduction(
  '597052965528', // Tbk-Api-Key-Id
  '6277d7aa-df6a-418c-9bad-bf93d0e09f81'
);

// 🔍 Ahora sí puedes hacer log
console.log('[🧪 WebpayPlus]', typeof WebpayPlus.Transaction);

async function getUsdToClp() {
  try {
    const res = await axios.get('https://mindicador.cl/api/dolar');
    return res.data.serie[0].valor;
  } catch (e) {
    console.error('[Error obteniendo USD/CLP]', e);
    // Valor de respaldo si la API falla
    return 950;
  }
}

exports.createTransaction = async (req, res) => {
  try {
    const { nombre, email, sitio } = req.body;
    const buyOrder = 'orden-' + Math.floor(Math.random() * 1000000);
    const sessionId = 'sesion-' + Math.floor(Math.random() * 1000000);
    const usdAmount = 20;
    const usdToClp = await getUsdToClp();
    const amount = Math.round(usdAmount * usdToClp);
    const returnUrl = 'https://seo20.dev/es/confirmacion';

    const response = await new WebpayPlus.Transaction().create(
      buyOrder,
      sessionId,
      amount,
      returnUrl
    );

    // Guardar documento pendiente con los datos del usuario
    try {
      const db = getFirestore();
      await db.collection('solicitudes').doc(buyOrder + '-pendiente').set({
        nombre: nombre || '',
        email: email || '',
        sitio: sitio || '',
        estado: 'pendiente',
        fecha: FieldValue.serverTimestamp(),
        usdAmount,
        usdToClp,
        clpAmount: amount
      }, { merge: true });
    } catch (e) {
      console.error('[Firestore Error - Guardado Pendiente Webpay]', e);
    }

    res.json({
      token: response.token,
      url: response.url,
      buyOrder,
      usdAmount,
      usdToClp,
      clpAmount: amount
    });
  } catch (error) {
    console.error('[❌ Webpay Create Error]', error);
    res.status(500).json({ error: error.message });
  }
};

exports.commitTransaction = async (req, res) => {
  try {
    const { token_ws } = req.body;

    if (!token_ws) {
      return res.status(400).json({ error: 'Token no recibido' });
    }

    const response = await new WebpayPlus.Transaction().commit(token_ws);
    console.log('[✅ Commit Webpay]', response.status, response.buy_order);

    // Guardar en Firestore
    try {
      const db = getFirestore();
      let estado = 'rechazado';
      if (response.status === 'AUTHORIZED' || response.status === 'SUCCESS') {
        estado = 'exito';
      } else if (response.status === 'ANULADA' || response.status === 'CANCELED') {
        estado = 'anulado';
      }

      // Buscar datos del usuario en el documento pendiente (igual que Flow)
      let datosUsuario = {};
      try {
        const pendienteDoc = await db.collection('solicitudes').doc(response.buy_order + '-pendiente').get();
        if (pendienteDoc.exists) {
          datosUsuario = pendienteDoc.data();
        }
      } catch (e) {
        console.error('[Firestore Error - Buscar Pendiente Webpay]', e);
      }

      await db.collection('solicitudes').doc(response.buy_order + '-' + estado).set({
        ...datosUsuario,
        tipo: 'Webpay',
        estado,
        amount: response.amount,
        buyOrder: response.buy_order,
        sessionId: response.session_id,
        cardDetail: response.card_detail,
        accountingDate: response.accounting_date,
        transactionDate: response.transaction_date,
        authorizationCode: response.authorization_code,
        paymentTypeCode: response.payment_type_code,
        response: response,
        fecha: FieldValue.serverTimestamp()
      }, { merge: true });
    } catch (e) {
      console.error('[Firestore Error - Webpay Commit]', e);
    }

    res.json(response);
  } catch (error) {
    console.error('[❌ Webpay Commit Error]', error);
    res.status(500).json({ error: error.message });
  }
};