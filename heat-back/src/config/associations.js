const User = require("../models/user.model");
const Candidate = require("../models/candidate.model");
const Response = require("../models/response.model");

Candidate.belongsTo(User, { foreignKey: "userId" });
User.hasMany(Candidate, { foreignKey: "userId" });

Candidate.hasMany(Response, {
  foreignKey: "candidateId",
  as: "responses",
});
Response.belongsTo(Candidate, { foreignKey: "candidateId" });

module.exports = { User, Candidate, Response };
