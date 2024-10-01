const express = require("express");
const candidateController = require("../controllers/candidate.controller");
const authenticateToken = require("../middleware/auth");

const router = express.Router();

router.get("/results", candidateController.getCandidatesWithResults);

router.post("/", authenticateToken, candidateController.createCandidate);

router.get("/", authenticateToken, candidateController.getCandidatesByUser);

router.get("/status/:candidateId", candidateController.checkCandidateStatus);

router.post("/send-link", candidateController.sendTestLink);

router.post("/send-results", candidateController.sendTestResults);

router.delete(
  "/:candidateId",
  authenticateToken,
  candidateController.deleteCandidate
);

module.exports = router;
