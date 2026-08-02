const jwt = require("jsonwebtoken");
const env = require("../config/env");
const ApiError = require("../utils/ApiError");
const asyncHandler = require("../utils/asyncHandler");

// Verifies the Bearer token and attaches the decoded payload to req.user.
const verifyToken = asyncHandler(async (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        throw ApiError.unauthorized("Access denied. No token provided.");
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
        throw ApiError.unauthorized("Invalid token format");
    }

    try {
        const decoded = jwt.verify(token, env.jwt.secret);
        req.user = decoded; // { id, role, iat, exp }
        next();
    } catch (err) {
        throw ApiError.unauthorized("Invalid or expired token");
    }
});

// Optional auth: attaches req.user if a valid token is present, but never
// blocks the request. Useful for endpoints that behave differently for
// logged-in vs anonymous users without requiring login.
const optionalAuth = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) return next();

    const token = authHeader.split(" ")[1];
    try {
        req.user = jwt.verify(token, env.jwt.secret);
    } catch (err) {
        // ignore invalid token for optional auth
    }
    next();
};

module.exports = { verifyToken, optionalAuth };
