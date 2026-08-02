const { body, param } = require("express-validator");

const castVoteRules = [
    body("election_id").notEmpty().withMessage("Election ID is required").isInt().withMessage("Election ID must be an integer"),
    body("candidate_id").notEmpty().withMessage("Candidate ID is required").isInt().withMessage("Candidate ID must be an integer"),
];

const electionIdParamRule = [param("electionId").isInt().withMessage("Invalid election id")];

module.exports = { castVoteRules, electionIdParamRule };
