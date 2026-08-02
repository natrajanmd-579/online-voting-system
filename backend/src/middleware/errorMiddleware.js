const multer = require("multer");
const env = require("../config/env");
const logger = require("../utils/logger");

// 404 handler for unmatched routes.
const notFound = (req, res, next) => {
    res.status(404).json({
        success: false,
        message: `Route not found: ${req.method} ${req.originalUrl}`,
    });
};

// Single place where every error in the app is turned into an HTTP response.
// Keeps controllers free of repetitive try/catch + res.status().json() code.
const errorHandler = (err, req, res, next) => {
    let statusCode = err.statusCode || 500;
    let message = err.message || "Internal server error";
    let details = err.details || null;

    // MySQL specific errors -> friendlier messages
    if (err.code === "ER_DUP_ENTRY") {
        statusCode = 409;
        message = "A record with these details already exists";
    } else if (err.code === "ER_NO_REFERENCED_ROW_2" || err.code === "ER_NO_REFERENCED_ROW") {
        statusCode = 400;
        message = "Referenced record does not exist";
    }

    // Multer upload errors
    if (err instanceof multer.MulterError) {
        statusCode = 400;
        message = err.message;
    }

    if (statusCode >= 500) {
        logger.error(message, { stack: err.stack, path: req.originalUrl });
    } else {
        logger.warn(message, { path: req.originalUrl });
    }

    res.status(statusCode).json({
        success: false,
        message,
        ...(details ? { details } : {}),
        ...(env.nodeEnv !== "production" && statusCode >= 500 ? { stack: err.stack } : {}),
    });
};

module.exports = { notFound, errorHandler };
