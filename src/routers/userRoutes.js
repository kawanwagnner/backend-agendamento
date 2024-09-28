// src/routers/userRoutes.js
const express = require("express");
const { registerUser, loginUser } = require("../controllers/userController");

const router = express.Router();

// Rotas de registro e login
router.post("/register", registerUser);
router.post("/login", loginUser);

module.exports = router;