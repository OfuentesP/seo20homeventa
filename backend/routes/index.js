console.log('[🔍 Carga de rutas] Iniciando import de controller');

const { createTransaction, commitTransaction } = require('../controllers/webpayController');
console.log('[✅ Rutas] createTransaction:', typeof createTransaction);

const express = require('express');
const router = express.Router();

router.post('/webpay/create', createTransaction);
router.post('/webpay/commit', commitTransaction);

module.exports = router;