const express = require('express');
const router = express.Router();

const {
    handleRegisterUser,
    handleLoginUser,
    handleForgotPassword,
    handleResetPassword,
    handleGetUserProfile,
    handleUpdatePassword,
    handleUpdateProfile,
    handleLogout,
    handleAllUsers,
    handleGetUserDetails,
    handleUpdateUser,
    handleDeleteUser

} = require('../controllers/authHandlers');


const { requireCustomerSession, allowUserRoles } = require('../middlewares/accessControl')

router.route('/register').post(handleRegisterUser);
router.route('/login').post(handleLoginUser);

router.route('/password/forgot').post(handleForgotPassword)
router.route('/password/reset/:token').put(handleResetPassword)

router.route('/logout').get(handleLogout);

router.route('/me').get(requireCustomerSession, handleGetUserProfile)
router.route('/password/update').put(requireCustomerSession, handleUpdatePassword)
router.route('/me/update').put(requireCustomerSession, handleUpdateProfile)

router.route('/admin/users').get(requireCustomerSession, allowUserRoles('admin'), handleAllUsers)
router.route('/admin/user/:id')
    .get(requireCustomerSession, allowUserRoles('admin'), handleGetUserDetails)
    .put(requireCustomerSession, allowUserRoles('admin'), handleUpdateUser)
    .delete(requireCustomerSession, allowUserRoles('admin'), handleDeleteUser)

module.exports = router;