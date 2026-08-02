const ApiError = require("../utils/ApiError");

// Generic role guard: allowRoles("admin") or allowRoles("admin", "editor").
// Replaces the old hard-coded isAdmin-only middleware so new roles can be
// added later without touching every route file.
const allowRoles = (...roles) => (req, res, next) => {
    if (!req.user) {
        throw ApiError.unauthorized("Authentication required");
    }

    if (!roles.includes(req.user.role)) {
        throw ApiError.forbidden("You do not have permission to perform this action");
    }

    next();
};

module.exports = { allowRoles, isAdmin: allowRoles("admin") };
