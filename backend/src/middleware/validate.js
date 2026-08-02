const { validationResult } = require("express-validator");
const ApiError = require("../utils/ApiError");

// Runs after an array of express-validator checks. Collects any failures
// into a single, consistently-shaped 400 error instead of each controller
// re-implementing its own validation branch.
const validate = (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        const details = errors.array().map((e) => ({ field: e.path, message: e.msg }));
        throw ApiError.badRequest("Validation failed", details);
    }

    next();
};

module.exports = validate;
