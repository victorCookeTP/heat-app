const aiService = require("../services/ai.service");
const responseService = require("../services/response.service");
const { evaluateTest } = require("../services/ai.service");
const Response = require("../models/response.model");

const fs = require("fs");
const upload = require("../middleware/upload");
const axios = require("axios");

const getQuestions = async (req, res) => {
  try {
    const questions = await aiService.generateQuestions();

    const questionsContent = questions.content;

    console.log(questionsContent);

    res.status(200).json({ questions: questionsContent });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const submitTest = async (req, res) => {
  const { answers } = req.body;
  const correctAnswers = ["A", "C", "B"]; // Simulación

  try {
    const score = aiService.evaluateTest(answers, correctAnswers);
    res.status(200).json({ score });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const submitAudio = async (req, res) => {
  const audioFilePath = req.file ? req.file.path : null;

  if (!audioFilePath || fs.statSync(audioFilePath).size === 0) {
    return res.status(400).json({
      error: "El archivo de audio está vacío o no se recibió correctamente",
    });
  }

  console.log("Archivo recibido:", audioFilePath);

  try {
    const evaluation = await aiService.evaluateAudio(audioFilePath);
    res.status(200).json({ evaluation });
  } catch (error) {
    console.error("Error evaluando el audio:", error);
    res.status(500).json({ error: "Error procesando el archivo de audio" });
  }
};

const evaluateFinal = async (req, res) => {
  const { candidateId, testScore, audioScore } = req.body;

  try {
    if (audioScore !== null && audioScore !== undefined) {
      const updatedResponse = await responseService.updateResponseWithAudio(
        candidateId,
        audioScore
      );
      return res
        .status(200)
        .json({ message: "Final results saved", finalResult: updatedResponse });
    }

    const response = await responseService.createResponse({
      candidateId,
      responseTest: testScore,
      responseAudio: null,
      status: "pending",
    });

    res
      .status(200)
      .json({ message: "Test results saved. Awaiting audio score.", response });
  } catch (error) {
    console.error("Error al guardar el resultado:", error);
    res.status(500).json({ error: "Error al guardar el resultado" });
  }
};

const evaluateAudio = async (req, res) => {
  if (!req.file) {
    return res
      .status(400)
      .json({ error: "No se subió ningún archivo de audio." });
  }

  const audioFilePath = req.file.path;

  try {
    const evaluation = await aiService.evaluateAudio(audioFilePath);
    res.status(200).json({ evaluation });
  } catch (error) {
    console.error("Error durante la evaluación:", error);
    res.status(500).json({ error: "Error procesando el archivo de audio." });
  }
};

module.exports = {
  getQuestions,
  submitTest,
  submitAudio,
  evaluateFinal,
  evaluateAudio,
};
