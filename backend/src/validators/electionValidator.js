const { body, param } = require("express-validator");

const createRules = [
    body("title").trim().notEmpty().withMessage("Title is required").isLength({ max: 150 }),
    body("description").trim().notEmpty().withMessage("Description is required"),
    body("start_date").notEmpty().withMessage("Start date is required").isISO8601().withMessage("Start date must be a valid date"),
    body("end_date").notEmpty().withMessage("End date is required").isISO8601().withMessage("End date must be a valid date")
        .custom((value, { req }) => {
            if (new Date(value) <= new Date(req.body.start_date)) {
                throw new Error("End date must be after start date");
            }
            return true;
        }),
    body("status").optional().isIn(["upcoming", "active", "completed"]).withMessage("Invalid status"),
];

const updateRules = [
    param("id").isInt().withMessage("Invalid election id"),
    body("title").optional().trim().notEmpty().isLength({ max: 150 }),
    body("description").optional().trim().notEmpty(),
    body("start_date").optional().isISO8601(),
    body("end_date").optional().isISO8601(),
    body("status").optional().isIn(["upcoming", "active", "completed"]).withMessage("Invalid status"),
];

const idParamRule = [param("id").isInt().withMessage("Invalid election id")];

module.exports = { createRules, updateRules, idParamRule };
