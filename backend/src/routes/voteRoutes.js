const express = require("express");
const router = express.Router();

const VoteController = require("../controllers/voteController");
const { verifyToken } = require("../middleware/authMiddleware");
const validate = require("../middleware/validate");
const { castVoteRules, electionIdParamRule } = require("../validators/voteValidator");

router.post("/", verifyToken, castVoteRules, validate, VoteController.castVote);
router.get("/history", verifyToken, VoteController.getVoteHistory);
router.get("/status/:electionId", verifyToken, electionIdParamRule, validate, VoteController.getVoteStatus);

module.exports = router;
