const express = require("express");
const router = express.Router();

const VoteController = require("../controllers/voteController");
const verifyToken = require("../middleware/authMiddleware");

// Cast Vote
router.post(
    "/",
    verifyToken,
    VoteController.castVote
);

// Vote History
router.get(
    "/history",
    verifyToken,
    VoteController.getVoteHistory
);

// Vote Status
router.get(
    "/status/:electionId",
    verifyToken,
    VoteController.getVoteStatus
);

module.exports = router;