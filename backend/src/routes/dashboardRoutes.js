const express = require("express");
const router = express.Router();

const dashboardController = require("../controllers/dashboardController");
const { verifyToken } = require("../middleware/authMiddleware");

router.get("/summary", verifyToken, dashboardController.getDashboardSummary);
router.get("/elections", dashboardController.getElectionsList);
router.get("/vote-trends", verifyToken, dashboardController.getVoteTrends);
router.get("/recent-activity", verifyToken, dashboardController.getRecentActivity);
router.get("/results/:electionId", dashboardController.getElectionResults);

module.exports = router;
