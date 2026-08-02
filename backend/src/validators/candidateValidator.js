const { body, param } = require("express-validator");

const createRules = [
    body("election_id").notEmpty().withMessage("Election ID is required").isInt().withMessage("Election ID must be an integer"),
    body("name").trim().notEmpty().withMessage("Name is required").isLength({ max: 100 }),
    body("party").trim().notEmpty().withMessage("Party is required").isLength({ max: 100 }),
    body("symbol").trim().notEmpty().withMessage("Symbol is required").isLength({ max: 50 }),
    body("manifesto").optional({ checkFalsy: true }).isLength({ max: 5000 }).withMessage("Manifesto is too long"),
];

const updateRules = [
    param("id").isInt().withMessage("Invalid candidate id"),
    body("election_id").optional().isInt(),
    body("name").optional().trim().notEmpty().isLength({ max: 100 }),
    body("party").optional().trim().notEmpty().isLength({ max: 100 }),
    body("symbol").optional().trim().notEmpty().isLength({ max: 50 }),
    body("manifesto").optional({ checkFalsy: true }).isLength({ max: 5000 }),
];

const idParamRule = [param("id").isInt().withMessage("Invalid candidate id")];

module.exports = { createRules, updateRules, idParamRule };
