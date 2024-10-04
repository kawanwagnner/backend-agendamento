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

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);

    res
      .status(201)
      .json({ message: "Usuário registrado com sucesso!", user, token });
  } catch (err) {
    res.status(500).json({ message: "Erro no servidor", error: err.message });
  }
};

// Login de usuário e administrador
exports.loginUser = async (req, res) => {
  const { email, password, user, pass } = req.body;

  try {
    // Verificação se é login de administrador
    if (user && pass) {
      if (user === "adm" && pass === "adm@C0mpany") {
        const token = jwt.sign({ role: "admin" }, process.env.JWT_SECRET);

        return res.status(200).json({
          message: "Login de administrador bem-sucedido!",
          token,
          role: "admin",
        });
      } else {
        return res.status(400).json({ message: "Credenciais inválidas" });
      }
    }

    // Verificação de login de usuário comum
    const usuario = await User.findOne({ email }).select("+password");
    if (!usuario)
      return res.status(400).json({ message: "Credenciais inválidas" });

    const isMatch = await usuario.comparePassword(password);
    if (!isMatch)
      return res.status(400).json({ message: "Credenciais inválidas" });

    const token = jwt.sign({ id: usuario._id }, process.env.JWT_SECRET);

    res
      .status(200)
      .json({ message: "Login de usuário bem-sucedido!", usuario, token });
  } catch (err) {
    res.status(500).json({ message: "Erro no servidor", error: err.message });
  }
};
