const Order = require('../models/orderModel');
const Product = require('../models/productModel');
const ErrorHandler = require('../utils/requestError');
const wrapAsyncRoute = require('../middlewares/asyncWrapper');

async function getOrder(id) {
    const order = await Order.findById(id);
    if (!order) throw new ErrorHandler('We could not find this order.', 404);
    return order;
}

async function reduceStock(orderItems) {
    for (const item of orderItems) {
        const product = await Product.findById(item.product);
        if (!product) throw new ErrorHandler('One of the items in this order is no longer available.', 404);
        if (product.stock < item.quantity) {
            throw new ErrorHandler(`Only a limited quantity of ${product.name} is available.`, 400);
        }
        product.stock -= item.quantity;
        await product.save({ validateBeforeSave: false });
    }
}

exports.handleNewOrder = wrapAsyncRoute(async (req, res) => {
    const { orderItems, shippingInfo, itemsPrice, taxPrice, shippingPrice, totalPrice, paymentInfo } = req.body;
    const order = await Order.create({
        orderItems, shippingInfo, itemsPrice, taxPrice, shippingPrice, totalPrice,
        paymentInfo, paidAt: Date.now(), user: req.user._id
    });
    res.status(200).json({ success: true, order });
});

exports.handleGetSingleOrder = wrapAsyncRoute(async (req, res) => {
    const order = await Order.findById(req.params.id).populate('user', 'name email');
    if (!order) throw new ErrorHandler('We could not find this order.', 404);
    if (req.user.role !== 'admin' && String(order.user._id) !== String(req.user._id)) {
        throw new ErrorHandler('You do not have access to this order.', 403);
    }
    res.json({ success: true, order });
});

exports.handleMyOrders = wrapAsyncRoute(async (req, res) => {
    const orders = await Order.find({ user: req.user.id });
    res.json({ success: true, orders });
});

exports.handleAllOrders = wrapAsyncRoute(async (req, res) => {
    const orders = await Order.find();
    const totalAmount = orders.reduce((total, order) => total + order.totalPrice, 0);
    res.json({ success: true, totalAmount, orders });
});

exports.handleUpdateOrder = wrapAsyncRoute(async (req, res) => {
    const order = await getOrder(req.params.id);
    if (order.orderStatus === 'Delivered') {
        throw new ErrorHandler('This order has already been delivered.', 400);
    }
    if (req.body.status === 'Shipped' || req.body.status === 'Delivered') {
        if (order.orderStatus === 'Processing') await reduceStock(order.orderItems);
    }
    order.orderStatus = req.body.status;
    if (req.body.status === 'Delivered') order.deliveredAt = Date.now();
    await order.save();
    res.json({ success: true });
});

exports.handleDeleteOrder = wrapAsyncRoute(async (req, res) => {
    const order = await getOrder(req.params.id);
    await order.remove();
    res.json({ success: true });
});
