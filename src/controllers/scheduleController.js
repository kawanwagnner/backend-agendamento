// src/controllers/scheduleController.js
const Schedule = require("../models/schedule");

// Criar um novo agendamento
exports.createSchedule = async (req, res) => {
  const { service, date, duration } = req.body;

  // Lista de serviços de barbearia
  const validServices = [
    "Corte de cabelo",
    "Barba",
    "Corte e Barba",
    "Sobrancelha",
    "Lavar e Secar",
  ];

  // Verifica se o serviço selecionado é válido
  if (!validServices.includes(service)) {
    return res.status(400).json({
      message: "Serviço inválido. Escolha um serviço de barbearia válido.",
    });
  }

  // Validação adicional para a data
  const selectedDate = new Date(date);

  // Verifica se a data passada é inválida ou no passado
  if (isNaN(selectedDate.getTime())) {
    return res.status(400).json({
      message: "Formato de data inválido. Use um formato ISO 8601.",
    });
  }

  if (selectedDate < new Date()) {
    return res.status(400).json({
      message: "A data escolhida já passou. Selecione uma data futura.",
    });
  }

  try {
    // Verifica se o usuário já possui um agendamento ativo e não cancelado (em uma data futura)
    const existingSchedule = await Schedule.findOne({
      user: req.user._id,
      date: { $gte: new Date() }, // Verifica se existe agendamento futuro
      status: { $ne: "cancelado" }, // Somente agendamentos que não estão cancelados
    });

    if (existingSchedule) {
      return res.status(400).json({
        message:
          "Você já possui um agendamento ativo. Conclua ou cancele antes de criar um novo.",
      });
    }

    // Cria o novo agendamento
    const schedule = new Schedule({
      user: req.user._id,
      service,
      date: selectedDate,
      duration,
      status: "agendado", // Aqui setamos o status como "agendado" em português
    });

    await schedule.save();
    res.status(201).json({
      message: "Agendamento de barbearia criado com sucesso!",
      schedule,
    });
  } catch (err) {
    res.status(500).json({
      message: "Erro ao criar agendamento",
      error: err.message,
    });
  }
};

// Listar agendamentos do usuário logado
exports.getSchedules = async (req, res) => {
  try {
    const schedules = await Schedule.find({ user: req.user._id }).sort({
      date: 1,
    }); // Ordena por data futura

    // Verifica se a lista está vazia
    if (schedules.length === 0) {
      return res.status(200).json({
        message: "Nenhum agendamento encontrado.",
      });
    }

    // Caso haja agendamentos, retorna a lista
    res.status(200).json(schedules);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Erro ao buscar agendamentos", error: err.message });
  }
};

// Atualizar um agendamento existente
exports.updateSchedule = async (req, res) => {
  const { date, status } = req.body;

  try {
    const schedule = await Schedule.findById(req.params.id);

    if (!schedule) {
      return res.status(404).json({ message: "Agendamento não encontrado." });
    }

    // Verifica se o usuário é o dono do agendamento
    if (schedule.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: "Não autorizado." });
    }

    // Verifica se o status é "Confirmado" e impede o usuário comum de alterá-lo
    if (status && status === "confirmado") {
      return res.status(403).json({
        message: "Somente o administrador pode confirmar o agendamento.",
      });
    }

    // Permite apenas alterar o status para "Cancelado"
    if (status && status !== "cancelado") {
      return res
        .status(400)
        .json({ message: "Você só pode cancelar o agendamento." });
    }

    // Atualiza a data se fornecida, mas verifica se o dia é o mesmo
    if (date) {
      const newDate = new Date(date);
      const originalDate = new Date(schedule.date);

      // Verifica se a data (ano, mês e dia) são os mesmos
      const isSameDay =
        newDate.getFullYear() === originalDate.getFullYear() &&
        newDate.getMonth() === originalDate.getMonth() &&
        newDate.getDate() === originalDate.getDate();

      if (!isSameDay) {
        return res.status(400).json({
          message:
            "Você só pode alterar o horário, o dia deve permanecer o mesmo.",
        });
      }

      // Verifica se o novo horário não está no passado
      if (newDate < new Date()) {
        return res.status(400).json({
          message:
            "O horário escolhido já passou. Selecione um horário futuro.",
        });
      }

      // Atualiza o campo `date` com a nova hora
      schedule.date = newDate;
    }

    // Atualiza o status se for para "Cancelado"
    if (status === "cancelado") {
      schedule.status = "cancelado";
    }

    await schedule.save();

    res.status(200).json({
      message: "Agendamento atualizado com sucesso!",
      schedule,
    });
  } catch (err) {
    res.status(500).json({
      message: "Erro ao atualizar agendamento",
      error: err.message,
    });
  }
};

// Excluir um agendamento
exports.deleteSchedule = async (req, res) => {
  try {
    const schedule = await Schedule.findById(req.params.id);

    if (!schedule) {
      return res.status(404).json({ message: "Agendamento não encontrado." });
    }

    // Verifica se o usuário é o dono do agendamento
    if (schedule.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: "Não autorizado." });
    }

    // Usa o método findByIdAndDelete para excluir o agendamento
    await Schedule.findByIdAndDelete(req.params.id);

    res.status(200).json({ message: "Agendamento excluído com sucesso." });
  } catch (err) {
    res.status(500).json({
      message: "Erro ao excluir agendamento",
      error: err.message,
    });
  }
};
