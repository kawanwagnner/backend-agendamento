const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");
const tokenAuth = require("../middleware/token_auth");

///////////////////////// Middleware /////////////////////////

// Aplica o middleware `tokenAuth` a todas as rotas desse router
router.use(tokenAuth);

///////////////////////// Teste de Autenticação /////////////////////////

// Rota de teste para verificar se o middleware está funcionando
router.get("/test-admin", (req, res) => {
  res
    .status(200)
    .json({ message: "Bem-vindo, administrador!", user: req.user });
});

///////////////////////// Rotas de Agendamentos /////////////////////////

// Ver todos os agendamentos
router.get("/schedules", adminController.getAllSchedules);

// Ver um agendamento específico
router.get("/schedules/:id", adminController.getSingleSchedule);

// Atualizar um agendamento
router.put("/schedules/:id", adminController.updateSchedule);

// Deletar um agendamento
router.delete("/schedules/:id", adminController.deleteSchedule);

// Bloquear um dia para não haver agendamentos
router.post("/block-day", adminController.blockDay);

///////////////////////// Rotas de Usuários /////////////////////////

// Ver todos os usuários
router.get("/users", adminController.getAllUsers);

// Ver um usuário específico
router.get("/users/:id", adminController.getSingleUser);

// Atualizar um usuário
router.put("/users/:id", adminController.updateUser);

// Deletar um usuário
router.delete("/users/:id", adminController.deleteUser);

///////////////////////// Exportação do Router /////////////////////////

module.exports = router;
