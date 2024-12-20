const express = require("express");
const {
  createBarber,
  getAllBarbers,
  getBarberById,
  updateBarber,
  deleteBarber,
} = require("../controllers/barberController");
const protect = require("../middleware/token_auth");

const router = express.Router();

// Rotas de barbeiros
router.post("/", protect, createBarber); // Criar barbeiro
router.get("/", protect, getAllBarbers); // Listar todos os barbeiros
router.get("/:id", protect, getBarberById); // Obter barbeiro pelo ID
router.put("/:id", protect, updateBarber); // Atualizar barbeiro
router.delete("/:id", protect, deleteBarber); // Excluir barbeiro

module.exports = router;
