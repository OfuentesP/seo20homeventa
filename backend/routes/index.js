const express = require('express');
const router = express.Router();
const {
  createTransaction,
  commitTransaction
} = require('../controllers/webpayController');
const {
  createFlowPayment,
  confirmFlowPayment
} = require('../controllers/flowController');

router.post('/webpay/create', createTransaction);
router.post('/webpay/commit', commitTransaction);
router.post('/flow/create', createFlowPayment);
router.post('/flow/confirm', confirmFlowPayment);

module.exports = router;