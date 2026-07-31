const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');

// Endpoint: GET /api/dashboard/summary
router.get('/summary', dashboardController.getDashboardSummary);

// Endpoint: GET /api/dashboard/results/:electionId
router.get('/results/:electionId', dashboardController.getElectionResults);

module.exports = router;