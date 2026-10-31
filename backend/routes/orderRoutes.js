const express = require('express')
const router = express.Router();

const {
    handleNewOrder,
    handleGetSingleOrder,
    handleMyOrders,
    handleAllOrders,
    handleUpdateOrder,
    handleDeleteOrder

} = require('../controllers/orderHandlers')

const { requireCustomerSession, allowUserRoles } = require('../middlewares/accessControl')

router.route('/order/new').post(requireCustomerSession, handleNewOrder);

router.route('/order/:id').get(requireCustomerSession, handleGetSingleOrder);
router.route('/orders/me').get(requireCustomerSession, handleMyOrders);

router.route('/admin/orders/').get(requireCustomerSession, allowUserRoles('admin'), handleAllOrders);
router.route('/admin/order/:id')
    .put(requireCustomerSession, allowUserRoles('admin'), handleUpdateOrder)
    .delete(requireCustomerSession, allowUserRoles('admin'), handleDeleteOrder);

module.exports = router;