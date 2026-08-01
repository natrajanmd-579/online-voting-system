const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload");

const candidateController = require("../controllers/candidateController");

// Get all candidates
router.get("/", candidateController.getAllCandidates);

// Get candidate by ID
router.get("/:id", candidateController.getCandidateById);

// Create candidate
router.post(
    "/",
    upload.single("photo"),
    candidateController.createCandidate
);
// Update candidate
router.put(
    "/:id",
    upload.single("photo"),
    candidateController.updateCandidate
);
// Delete candidate
router.delete("/:id", candidateController.deleteCandidate);


module.exports = router;