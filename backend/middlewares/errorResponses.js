const RequestError = require('../utils/requestError');

function formatError(error) {
    if (error.name === 'CastError') {
        return new RequestError('The requested item ID is not valid.', 400);
    }
    if (error.name === 'ValidationError') {
        const issues = Object.values(error.errors).map(field => field.message);
        return new RequestError(issues.join(', '), 400);
    }
    if (error.code === 11000) {
        const fields = Object.keys(error.keyValue || {});
        return new RequestError(`${fields.join(', ') || 'Value'} is already in use`, 400);
    }
    if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
        return new RequestError('Your session has expired. Please sign in again.', 401);
    }
    return error;
}

module.exports = (error, req, res, next) => {
    const handled = formatError(error);
    const statusCode = handled.statusCode || 500;
    const message = statusCode >= 500 && process.env.NODE_ENV === 'PRODUCTION'
        ? 'The server could not process your request. Please try again later.'
        : handled.message || 'We could not complete your request. Please try again.';
    const response = { success: false, message };

    if (process.env.NODE_ENV !== 'PRODUCTION') {
        response.errMessage = response.message;
        response.error = { name: handled.name, message: response.message };
        response.stack = handled.stack;
    }

    res.status(statusCode).json(response);
};
