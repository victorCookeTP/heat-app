const userService = require("../services/user.service");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const candidateService = require("../services/candidate.service");

const createUser = async (req, res) => {
  try {
    const { password, ...userData } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await userService.createUser({
      ...userData,
      password: hashedPassword,
    });
    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({ error: "Error al crear el usuario" });
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await userService.getUserByEmail(email);
    if (!user) return res.status(404).json({ error: "Usuario no encontrado" });

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword)
      return res.status(401).json({ error: "Contraseña incorrecta" });

    const token = jwt.sign({ id: user.uuid }, process.env.JWT_SECRET, {
      expiresIn: "24h",
    });
    res.status(200).json({ token, user });
  } catch (error) {
    res.status(500).json({ error: "Error en el login" });
  }
};

const getUserDashboard = async (req, res) => {
  try {
    const userId = req.user.id;

    const candidates = await candidateService.getCandidatesByUser(userId);
    res.status(200).json({ candidates });
  } catch (error) {
    // console.log(error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createUser,
  loginUser,
  getUserDashboard,
};
