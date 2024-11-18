// errorHandler.js
const errorHandler = (err, req, res, next) => {
    if (err instanceof multer.MulterError) {
        // Multer errors (e.g., file size limit exceeded)
        return res.status(400).json({ error: err.message });
    }
    if (err.name === 'ValidationError') {
        // Validation errors from mongoose or other validation logic
        return res.status(400).json({ error: err.message });
    }
    if (err.message) {
        // General errors
        return res.status(500).json({ error: err.message });
    }
    // Unknown errors
    return res.status(500).json({ error: 'Something went wrong!' });
};

module.exports = errorHandler;