const rateLimit = require("express-rate-limit");

// General API limiter: generous, mainly to blunt abuse/scraping.
const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 300,
    standardHeaders: true,
    legacyHeaders: false,
    message: { success: false, message: "Too many requests, please try again later." },
});

// Stricter limiter for auth endpoints to slow down brute-force login/register attempts.
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 20,
    standardHeaders: true,
    legacyHeaders: false,
    message: { success: false, message: "Too many auth attempts, please try again later." },
});

module.exports = { apiLimiter, authLimiter };
