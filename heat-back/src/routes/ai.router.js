const express = require("express");
const router = express.Router();
const aiController = require("../controllers/ai.controller");
const upload = require("../middleware/upload");

router.get("/questions", aiController.getQuestions);

router.post("/submit-test", aiController.submitTest);

router.post("/final-evaluation", aiController.evaluateFinal);

router.post("/upload-audio", upload.single("audio"), aiController.submitAudio);

module.exports = router;
