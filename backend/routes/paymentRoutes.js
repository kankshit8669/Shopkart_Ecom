const express = require('express')
const router = express.Router();

const {
    handleProcessPayment,
    handleSendStripeKey
} = require('../controllers/paymentHandlers')

const { requireCustomerSession } = require('../middlewares/accessControl')

router.route('/payment/process').post(requireCustomerSession, handleProcessPayment);
router.route('/stripeapi').get(requireCustomerSession, handleSendStripeKey);

module.exports = router;