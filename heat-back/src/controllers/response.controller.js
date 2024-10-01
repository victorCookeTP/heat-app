const responseService = require("../services/response.service");
const Candidate = require("../models/candidate.model");

const createResponse = async (req, res) => {
  const { candidateId, answers, responseAi } = req.body;
  const correctAnswers = ["A", "C", "B"]; // Respuestas simuladas

  let score = 0;
  answers.forEach((answer, index) => {
    if (answer === correctAnswers[index]) {
      score++;
    }
  });

  const responseTest = (score / correctAnswers.length) * 100;

  const response = await responseService.createResponse({
    candidateId,
    responseTest,
    responseAudio: responseAi,
    finalScore: null,
  });

  res.status(201).json(response);
};

const getCandidatesWithScores = async (req, res) => {
  try {
    const candidates = await Candidate.findAll();

    const candidatesWithScores = await Promise.all(
      candidates.map(async (candidate) => {
        const response = await Response.findOne({
          where: { candidateId: candidate.id },
        });

        return {
          ...candidate.toJSON(),
          testScore: response ? response.testScore : null,
        };
      })
    );

    res.json(candidatesWithScores);
  } catch (error) {
    console.error("Error obteniendo candidatos con scores:", error);
    res.status(500).json({ error: "Error al obtener candidatos" });
  }
};

const getResponsesByUser = async (req, res) => {
  try {
    const responses = await responseService.getResponsesByUser(
      req.params.userId
    );
    res.json(responses);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener respuestas" });
  }
};

module.exports = {
  createResponse,
  getResponsesByUser,
  getCandidatesWithScores,
};
