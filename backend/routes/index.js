const express = require('express');
const router = express.Router();
const {
  createTransaction,
  commitTransaction
} = require('../controllers/webpayController');

router.post('/webpay/create', createTransaction);
router.post('/webpay/commit', commitTransaction);

module.exports = router;