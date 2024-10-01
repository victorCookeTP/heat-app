const Candidate = require("../models/candidate.model");
const Response = require("../models/response.model");

const createCandidate = async (data) => {
  const existingCandidate = await Candidate.findOne({
    where: { email: data.email },
  });

  if (existingCandidate) {
    throw new Error("Email already registered");
  }

  return await Candidate.create(data);
};

const getCandidatesByUser = async (userId) => {
  return await Candidate.findAll({ where: { userId } });
};

const deleteCandidateAndResponses = async (candidateId) => {
  const candidate = await Candidate.findByPk(candidateId);

  if (!candidate) {
    throw new Error("Candidate not found");
  }

  await Response.destroy({ where: { candidateId } });

  await candidate.destroy();

  return { message: "Candidate and associated responses deleted successfully" };
};

module.exports = {
  createCandidate,
  getCandidatesByUser,
  deleteCandidateAndResponses,
};
