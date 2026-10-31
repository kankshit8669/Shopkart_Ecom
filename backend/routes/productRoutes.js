const express = require('express')
const router = express.Router();


const {
    handleGetProducts,
    handleGetAdminProducts,
    handleNewProduct,
    handleGetSingleProduct,
    handleUpdateProduct,
    handleDeleteProduct,
    handleCreateProductReview,
    handleGetProductReviews,
    handleDeleteReview

} = require('../controllers/productHandlers')

const { requireCustomerSession, allowUserRoles } = require('../middlewares/accessControl');


router.route('/products').get(handleGetProducts);
router.route('/admin/products').get(handleGetAdminProducts);
router.route('/product/:id').get(handleGetSingleProduct);

router.route('/admin/product/new').post(requireCustomerSession, allowUserRoles('admin'), handleNewProduct);

router.route('/admin/product/:id')
    .put(requireCustomerSession, allowUserRoles('admin'), handleUpdateProduct)
    .delete(requireCustomerSession, allowUserRoles('admin'), handleDeleteProduct);


router.route('/review').put(requireCustomerSession, handleCreateProductReview)
router.route('/reviews').get(requireCustomerSession, handleGetProductReviews)
router.route('/reviews').delete(requireCustomerSession, handleDeleteReview)

module.exports = router;