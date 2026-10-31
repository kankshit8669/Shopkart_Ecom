const wrapAsyncRoute = require('../middlewares/asyncWrapper');
const RequestError = require('../utils/requestError');

exports.handleProcessPayment = wrapAsyncRoute(async (req, res) => {
    const amount = Number(req.body.amount);
    if (!Number.isSafeInteger(amount) || amount < 1) {
        throw new RequestError('Please enter a valid payment amount.', 400);
    }
    if (!process.env.STRIPE_SECRET_KEY) {
        throw new RequestError('Online payment is not available at the moment.', 503);
    }

    const paymentService = require('stripe')(process.env.STRIPE_SECRET_KEY);
    const payment = await paymentService.paymentIntents.create({
        amount,
        currency: 'inr'
    });

    res.json({ success: true, client_secret: payment.client_secret });
});

exports.handleSendStripeKey = wrapAsyncRoute(async (req, res) => {
    res.json({ stripeApiKey: process.env.STRIPE_API_KEY });
});
