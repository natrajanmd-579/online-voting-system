const express = require("express");
const router = express.Router();

const electionController = require("../controllers/electionController");
const { verifyToken } = require("../middleware/authMiddleware");
const { allowRoles } = require("../middleware/roleMiddleware");
const validate = require("../middleware/validate");
const { createRules, updateRules, idParamRule } = require("../validators/electionValidator");

// Public read access
router.get("/", electionController.getAllElections);
router.get("/:id", idParamRule, validate, electionController.getElectionById);

// Admin-only writes. NOTE: these were previously unauthenticated in the
// original codebase, allowing any anonymous request to create/edit/delete
// elections. That gap is closed here.
router.post("/", verifyToken, allowRoles("admin"), createRules, validate, electionController.createElection);
router.put("/:id", verifyToken, allowRoles("admin"), updateRules, validate, electionController.updateElection);
router.delete("/:id", verifyToken, allowRoles("admin"), idParamRule, validate, electionController.deleteElection);
router.patch("/:id/activate", verifyToken, allowRoles("admin"), idParamRule, validate, electionController.activateElection);
router.patch("/:id/end", verifyToken, allowRoles("admin"), idParamRule, validate, electionController.endElection);

module.exports = router;
