const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");
const tokenAuth = require("../middleware/token_auth");

// Rota de teste para verificar se o middleware está funcionando
router.get("/test-admin", tokenAuth, (req, res) => {
  res
    .status(200)
    .json({ message: "Bem-vindo, administrador!", user: req.user });
});

// Ver todos os agendamentos
router.get("/schedules", tokenAuth, adminController.getAllSchedules);

// Atualizar um agendamento
router.put("/schedules/:id", tokenAuth, adminController.updateSchedule);

// Deletar um agendamento
router.delete("/schedules/:id", tokenAuth, adminController.deleteSchedule);

// Bloquear um dia para não haver agendamentos
router.post("/block-day", tokenAuth, adminController.blockDay);

module.exports = router;
