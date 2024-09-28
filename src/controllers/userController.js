// src/controllers/userController.js
const User = require("../models/user");
const jwt = require("jsonwebtoken");

// Registrar usuário
exports.registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ message: "Email já registrado" });

    user = await User.create({ name, email, password });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "10h",
    });

    res
      .status(201)
      .json({ message: "Usuário registrado com sucesso!", user, token });
  } catch (err) {
    res.status(500).json({ message: "Erro no servidor", error: err.message });
  }
};

// Login de usuário
exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email }).select("+password");
    if (!user)
      return res.status(400).json({ message: "Credenciais inválidas" });

    const isMatch = await user.comparePassword(password);
    if (!isMatch)
      return res.status(400).json({ message: "Credenciais inválidas" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.status(200).json({ message: "Login bem-sucedido!", user, token });
  } catch (err) {
    res.status(500).json({ message: "Erro no servidor", error: err.message });
  }
};
