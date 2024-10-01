const candidateService = require("../services/candidate.service");
const {
  sendTestLinkEmail,
  sendTestResultsEmail,
} = require("../services/email.service");
const Candidate = require("../models/candidate.model");
const Response = require("../models/response.model");
const User = require("../models/user.model");

const createCandidate = async (req, res) => {
  try {
    const { firstName, lastName, email } = req.body;
    const userId = req.user.id;

    if (!userId) {
      return res.status(400).json({ error: "User ID is required" });
    }

    const candidate = await candidateService.createCandidate({
      firstName,
      lastName,
      email,
      userId,
      reminder: false,
    });

    res.status(201).json(candidate);
  } catch (error) {
    if (error.message === "Email already registered") {
      return res
        .status(400)
        .json({ error: "Candidate with this email already exists" });
    }

    console.log(error);
    res.status(500).json({ error: "Error creating candidate" });
  }
};

const deleteCandidate = async (req, res) => {
  const { candidateId } = req.params;

  try {
    const result = await candidateService.deleteCandidateAndResponses(
      candidateId
    );
    res.status(200).json(result);
  } catch (error) {
    if (error.message === "Candidate not found") {
      return res.status(404).json({ error: "Candidate not found" });
    }
    console.error(error);
    res.status(500).json({ error: "Error deleting candidate and responses" });
  }
};

const getCandidatesByUser = async (req, res) => {
  const userId = req.user.id;
  try {
    const candidates = await candidateService.getCandidatesByUser(userId);
    res.json(candidates);
  } catch (error) {
    res.status(500).json({ error: "Error retrieving candidates" });
  }
};

const sendTestLink = async (req, res) => {
  const { email, testLink, candidateId } = req.body;

  try {
    const candidate = await Candidate.findByPk(candidateId);

    if (!candidate) {
      return res.status(404).json({ error: "Candidate not found" });
    }

    candidate.reminder = true;

    await sendTestLinkEmail(candidate.email, testLink);
    await candidate.save();

    res.status(200).json({ message: "Email sent successfully" });
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).json({ error: "Error sending email" });
  }
};

const sendTestResults = async (req, res) => {
  const { email, testScore, audioScore, finalResult } = req.body;

  try {
    await sendTestResultsEmail(email, testScore, audioScore, finalResult);
    res.status(200).json({ message: "Test results sent successfully" });
  } catch (error) {
    console.error("Error sending test results email:", error);
    res.status(500).json({ error: "Error sending test results email" });
  }
};

const getCandidatesWithResults = async (req, res) => {
  try {
    const candidates = await Candidate.findAll({
      include: [
        {
          model: Response,
          as: "responses",
        },
        {
          model: User,
          attributes: ["firstName", "lastName", "uuid"],
        },
      ],
    });

    const candidatesWithResults = candidates.map((candidate) => {
      const response = candidate.responses[0]; // Se asume un test por candidato
      return {
        uuid: candidate.uuid,
        firstName: candidate.firstName,
        lastName: candidate.lastName,
        email: candidate.email,
        testScore: response ? response.responseTest : null,
        audioScore: response ? response.responseAudio : null,
        finalResult: response ? response.finalResult : null,
        status: response ? response.status : null,
        userFirstName: candidate.User ? candidate.User.firstName : null,
        userLastName: candidate.User ? candidate.User.lastName : null,
        userId: candidate.User ? candidate.User.uuid : null,
      };
    });

    res.json(candidatesWithResults);
  } catch (error) {
    console.error("Error fetching candidates with results:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const checkCandidateStatus = async (req, res) => {
  const { candidateId } = req.params;

  try {
    const response = await Response.findOne({ where: { candidateId } });

    if (response) {
      if (response.status === "complete") {
        return res.status(200).json({
          message: "The test is complete.",
          status: "complete",
        });
      } else if (response.status === "pending") {
        return res.status(200).json({
          message: "The test is pending audio recording.",
          status: "pending",
        });
      }
    }

    return res.status(200).json({
      message: "The candidate has not started the test yet.",
      status: "not-started",
    });
  } catch (error) {
    console.error("Error checking candidate status:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
};

module.exports = {
  sendTestLink,
  sendTestResults,
  createCandidate,
  getCandidatesByUser,
  getCandidatesWithResults,
  checkCandidateStatus,
  deleteCandidate,
};
