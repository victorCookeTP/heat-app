const Response = require("../models/response.model");

const createResponse = async (data) => {
  const { candidateId, responseTest, responseAudio } = data;

  if (!candidateId || responseTest === null || responseTest === undefined) {
    throw new Error("Missing candidateId or responseTest");
  }

  return await Response.create({
    candidateId,
    responseTest,
    responseAudio,
    status: "pending",
  });
};

const updateFinalScore = async (candidateId, data) => {
  return await Response.update(data, {
    where: { candidateId },
  });
};

const updateResponseWithAudio = async (candidateId, audioScore) => {
  const response = await Response.findOne({ where: { candidateId } });

  if (!response) {
    throw new Error("Response not found");
  }

  response.responseAudio = audioScore.evaluation;
  response.status = "complete";

  const testScore = parseFloat(response.responseTest) || 0;
  const finalScore = (testScore + audioScore.evaluation) / 2;

  console.log(finalScore);

  let finalResult;
  if (finalScore < 40) {
    finalResult = "Beginner";
  } else if (finalScore < 60) {
    finalResult = "Intermediate";
  } else if (finalScore < 80) {
    finalResult = "Advanced";
  } else {
    finalResult = "Expert";
  }

  response.finalScore = finalScore;
  response.finalResult = finalResult;
  await response.save();

  return response;
};

const getResponsesByUser = async (userId) => {
  return await Response.findAll({
    include: {
      model: Candidate,
      where: { userId },
    },
  });
};

module.exports = {
  createResponse,
  getResponsesByUser,
  updateFinalScore,
  updateResponseWithAudio,
};
