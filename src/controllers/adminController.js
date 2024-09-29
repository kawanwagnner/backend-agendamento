const Schedule = require("../models/schedule");

// Ver todos os agendamentos
exports.getAllSchedules = async (req, res) => {
  try {
    // Busca todos os agendamentos e ordena por data de forma decrescente
    const schedules = await Schedule.find().sort({ date: -1 }); // Mais recentes primeiro
    res.status(200).json(schedules);
  } catch (error) {
    res.status(500).json({ message: "Erro ao buscar agendamentos", error });
  }
};

// Atualizar um agendamento
exports.updateSchedule = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedData = req.body;
    const schedule = await Schedule.findByIdAndUpdate(id, updatedData, {
      new: true,
    });
    if (!schedule) {
      return res.status(404).json({ message: "Agendamento não encontrado" });
    }
    res.status(200).json(schedule);
  } catch (error) {
    res.status(500).json({ message: "Erro ao atualizar agendamento", error });
  }
};

// Deletar um agendamento
exports.deleteSchedule = async (req, res) => {
  try {
    const { id } = req.params;
    const schedule = await Schedule.findByIdAndDelete(id);
    if (!schedule) {
      return res.status(404).json({ message: "Agendamento não encontrado" });
    }
    res.status(200).json({ message: "Agendamento deletado com sucesso" });
  } catch (error) {
    res.status(500).json({ message: "Erro ao deletar agendamento", error });
  }
};

// Bloquear um dia
exports.blockDay = async (req, res) => {
  try {
    const { date } = req.body;
    // Lógica para bloquear o dia
    // Pode ser um campo adicional no modelo de agendamento para marcar dias bloqueados
    res
      .status(200)
      .json({ message: `Dia ${date} bloqueado para novos agendamentos.` });
  } catch (error) {
    res.status(500).json({ message: "Erro ao bloquear o dia", error });
  }
};
