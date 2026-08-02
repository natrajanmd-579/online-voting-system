const { body } = require("express-validator");

const registerRules = [
    body("full_name").trim().notEmpty().withMessage("Full name is required")
        .isLength({ min: 2, max: 100 }).withMessage("Full name must be 2-100 characters"),
    body("email").trim().notEmpty().withMessage("Email is required").isEmail().withMessage("Invalid email address").normalizeEmail(),
    body("phone").optional({ checkFalsy: true }).isMobilePhone("any").withMessage("Invalid phone number"),
    body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters"),
];

const loginRules = [
    body("email").trim().notEmpty().withMessage("Email is required").isEmail().withMessage("Invalid email address").normalizeEmail(),
    body("password").notEmpty().withMessage("Password is required"),
];

const updateProfileRules = [
    body("full_name").trim().notEmpty().withMessage("Full name is required").isLength({ min: 2, max: 100 }),
    body("phone").optional({ checkFalsy: true }).isMobilePhone("any").withMessage("Invalid phone number"),
];

const changePasswordRules = [
    body("currentPassword").notEmpty().withMessage("Current password is required"),
    body("newPassword").isLength({ min: 6 }).withMessage("New password must be at least 6 characters"),
];

module.exports = { registerRules, loginRules, updateProfileRules, changePasswordRules };
