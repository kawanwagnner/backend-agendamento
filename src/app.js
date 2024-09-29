// src/app.js
const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./database/db.js");
const userRoutes = require("./routers/userRoutes");
const scheduleRoutes = require("./routers/scheduleRoutes");
const adminRoutes = require("./routers/adminRoutes");

// Configuração do dotenv para variáveis de ambiente
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Conectar ao MongoDB
connectDB();

// Middlewares
app.use(express.json());

// Rota test
app.use("/test", (req, res) => {
  console.log("Estamos no AR!!");

  return res.status(200).json({
    msg: "Estamos no AR!!",
  });
});

// Rotas
app.use("/api/users", userRoutes); // Rotas de usuários (registro e login)
app.use("/api/schedules", scheduleRoutes); // Rotas de agendamento (CRUD de agendamentos)
app.use("/admin", adminRoutes);

// Iniciar o servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
