function wrapAsyncRoute(handler) {
    return function handleRequest(req, res, next) {
        try {
            Promise.resolve(handler(req, res, next)).catch(next);
        } catch (error) {
            next(error);
        }
    };
}

module.exports = wrapAsyncRoute;
