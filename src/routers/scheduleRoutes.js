// src/routers/scheduleRoutes.js
const express = require("express");
const {
  createSchedule,
  getSchedules,
  updateSchedule,
  deleteSchedule,
} = require("../controllers/scheduleController");
const protect = require("../middleware/token_auth");

const router = express.Router();

// Rotas de agendamento
router.post("/", protect, createSchedule); // Criar agendamento
router.get("/", protect, getSchedules); // Listar agendamentos
router.put("/:id", protect, updateSchedule); // Atualizar agendamento
router.delete("/:id", protect, deleteSchedule); // Excluir agendamento

module.exports = router;
