const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const RequestError = require('../utils/requestError');
const wrapAsyncRoute = require('./asyncWrapper');

exports.requireCustomerSession = wrapAsyncRoute(async (req, res, next) => {
    const token = req.cookies && req.cookies.token;
    if (!token) return next(new RequestError('Sign in to access this page.', 401));

    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const account = await User.findById(payload.id);
    if (!account) return next(new RequestError('This account is unavailable. Please sign in again.', 401));

    req.user = account;
    next();
});

exports.allowUserRoles = (...acceptedRoles) => (req, res, next) => {
    if (!req.user || !acceptedRoles.includes(req.user.role)) {
        return next(new RequestError('Your account does not have permission to do that.', 403));
    }
    next();
};
