const express = require('express');
const router = express.Router();
const {
  getDashboardSummary,
  getElectionsList,
  getElectionResults
} = require('../controllers/dashboardController');


router.get('/summary', getDashboardSummary);
router.get('/elections', getElectionsList);
router.get('/results/:electionId', getElectionResults);

module.exports = router;