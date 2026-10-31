class RequestError extends Error {
    constructor(message, statusCode = 500) {
        super(message);
        this.name = 'RequestError';
        this.statusCode = statusCode;
        if (Error.captureStackTrace) Error.captureStackTrace(this, RequestError);
    }
}

module.exports = RequestError;
