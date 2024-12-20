// src/app.js
const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./database/db.js");
const userRoutes = require("./routers/userRoutes");
const scheduleRoutes = require("./routers/scheduleRoutes");
const barberRoutes = require("./routers/barberRoutes");
const adminRoutes = require("./routers/adminRoutes");
const logger = require("./utils/logger.js");
const cors = require("cors");
dotenv.config();

// Valida a presença das chaves necessárias:
if (!process.env.JWT_SECRET) {
  logger.error("JWT_SECRET não está definido no ambiente.");
  process.exit(1);
}
if (!process.env.MONGO_URI) {
  logger.error("MONGO_URI não está definido no ambiente.");
  process.exit(1);
}

const app = express();
const PORT = process.env.PORT || 5000;

// Liberação de API a patir de qualquer Interface Controller
app.use(cors());

// Conectar ao MongoDB
connectDB();

// Middlewares
app.use(cors()); // Habilitando CORS para todas as rotas
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
app.use("/api/barbers", barberRoutes); // Rotas de barbeiros
app.use("/admin", adminRoutes); // Rotas de barbeiros

// Iniciar o servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
