const { WebpayPlus, IntegrationApiKeys, IntegrationCommerceCodes, Environment } = require('transbank-sdk');
const { getFirestore, FieldValue } = require('firebase-admin/firestore');

// ✅ Configuración correcta
WebpayPlus.configureForIntegration(
  IntegrationCommerceCodes.WEBPAY_PLUS,
  IntegrationApiKeys.WEBPAY,
  Environment.Integration
);

// 🔍 Ahora sí puedes hacer log
console.log('[🧪 WebpayPlus]', typeof WebpayPlus.Transaction);

exports.createTransaction = async (req, res) => {
  try {
    const buyOrder = 'orden-' + Math.floor(Math.random() * 1000000);
    const sessionId = 'sesion-' + Math.floor(Math.random() * 1000000);
    const amount = 10000;
    const returnUrl = 'https://seo20.dev/confirmacion';

    const response = await new WebpayPlus.Transaction().create(
      buyOrder,
      sessionId,
      amount,
      returnUrl
    );

    res.json({
      token: response.token,
      url: response.url
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
      await db.collection('solicitudes').doc(response.buy_order + '-' + estado).set({
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

    res.json({ status: response.status, buyOrder: response.buy_order, ...response });
  } catch (error) {
    console.error('[❌ Webpay Commit Error]', error);
    res.status(500).json({ error: error.message });
  }
};