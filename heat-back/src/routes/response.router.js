const express = require("express");
const responseController = require("../controllers/response.controller");

const router = express.Router();

router.post("/", responseController.createResponse);
router.get("/user/:userId", responseController.getResponsesByUser);

module.exports = router;
