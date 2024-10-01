const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const Candidate = require("./candidate.model");

const Response = sequelize.define(
  "Response",
  {
    responseTest: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    responseAudio: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    candidateId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: Candidate,
        key: "uuid",
      },
    },
    finalScore: {
      type: DataTypes.STRING, // Guardará el puntaje final calculado
      allowNull: true,
    },
    finalResult: {
      type: DataTypes.STRING, // Principiante, Intermedio, Avanzado, etc.
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM("pending", "complete"),
      defaultValue: "pending",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = Response;
