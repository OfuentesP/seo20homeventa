const express = require('express');
const router = express.Router();
const {
  createTransaction,
  commitTransaction
} = require('../controllers/webpayController');
const {
  createFlowPayment,
  confirmFlowPayment,
  getFlowStatus
} = require('../controllers/flowController');

router.post('/webpay/create', createTransaction);
router.post('/webpay/commit', commitTransaction);
router.post('/flow/create', createFlowPayment);
router.post('/flow/confirm', confirmFlowPayment);
router.post('/flow/status', getFlowStatus);

module.exports = router;