const express = require("express");
const userController = require("../controllers/user.controller");
const authenticateToken = require("../middleware/auth");

const router = express.Router();

router.post("/register", userController.createUser);
router.post("/login", userController.loginUser);
router.get("/dashboard", authenticateToken, userController.getUserDashboard);

module.exports = router;
