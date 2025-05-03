const { WebpayPlus, IntegrationApiKeys, IntegrationCommerceCodes, Environment } = require('transbank-sdk');

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

    res.json({ status: response.status, ...response });
  } catch (error) {
    console.error('[❌ Webpay Commit Error]', error);
    res.status(500).json({ error: error.message });
  }
};