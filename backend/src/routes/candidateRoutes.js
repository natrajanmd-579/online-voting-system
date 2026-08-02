const express = require("express");
const router = express.Router();

const upload = require("../middleware/upload");
const candidateController = require("../controllers/candidateController");
const { verifyToken } = require("../middleware/authMiddleware");
const { allowRoles } = require("../middleware/roleMiddleware");
const validate = require("../middleware/validate");
const { createRules, updateRules, idParamRule } = require("../validators/candidateValidator");

// Public read access
router.get("/", candidateController.getAllCandidates);
router.get("/:id", idParamRule, validate, candidateController.getCandidateById);

// Admin-only writes (previously unauthenticated — now secured)
router.post(
    "/",
    verifyToken,
    allowRoles("admin"),
    upload.single("photo"),
    createRules,
    validate,
    candidateController.createCandidate
);
router.put(
    "/:id",
    verifyToken,
    allowRoles("admin"),
    upload.single("photo"),
    updateRules,
    validate,
    candidateController.updateCandidate
);
router.delete("/:id", verifyToken, allowRoles("admin"), idParamRule, validate, candidateController.deleteCandidate);

module.exports = router;
