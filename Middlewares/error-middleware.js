const errorMiddleware = (err, req, res, next) => {
    const statusCode = err.status || 500;
    const message = err.message || 'Internal Server Error';
    const extraDetails = err.extraDetails || 'An unexpected error occurred';
    return res.status(statusCode).json({ message, extraDetails })
}

module.exports = errorMiddleware