const express = require("express");
const router = express.Router();

const electionController = require("../controllers/electionController");

// Get all elections
router.get("/", electionController.getAllElections);

// Get election by ID
router.get("/:id", electionController.getElectionById);

// Create election
router.post("/", electionController.createElection);

// Update election
router.put("/:id", electionController.updateElection);

// Delete election
router.delete("/:id", electionController.deleteElection);

// Activate election
router.patch("/:id/activate", electionController.activateElection);

// End election
router.patch("/:id/end", electionController.endElection);

module.exports = router;