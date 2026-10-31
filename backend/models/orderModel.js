const mongoose = require('mongoose');

const shippingSchema = new mongoose.Schema({
    address: { type: String, required: true },
    city: { type: String, required: true },
    phoneNo: { type: String, required: true },
    postalCode: { type: String, required: true },
    country: { type: String, required: true }
}, { _id: false });

const purchasedItemSchema = new mongoose.Schema({
    name: { type: String, required: true },
    quantity: { type: Number, required: true, min: 1 },
    image: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true }
}, { _id: false });

const orderSchema = new mongoose.Schema({
    shippingInfo: { type: shippingSchema, required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    orderItems: { type: [purchasedItemSchema], default: [] },
    paymentInfo: {
        id: String,
        status: String
    },
    paidAt: Date,
    itemsPrice: { type: Number, required: true, default: 0 },
    taxPrice: { type: Number, required: true, default: 0 },
    shippingPrice: { type: Number, required: true, default: 0 },
    totalPrice: { type: Number, required: true, default: 0 },
    orderStatus: { type: String, required: true, default: 'Processing' },
    deliveredAt: Date,
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Order', orderSchema);
