const Schedule = require("../models/schedule");
const { isValid, parse, format } = require("date-fns");
const { ptBR } = require("date-fns/locale");

// Criar um novo agendamento
exports.createSchedule = async (req, res) => {
  const { service, date, time, duration, barber } = req.body;

  // Lista de serviços de barbearia
  const validServices = [
    "Corte de cabelo",
    "Barba",
    "Corte e Barba",
    "Sobrancelha",
    "Lavar e Secar",
  ];

  // Lista de barbeiros disponíveis
  const validBarbers = ["João Silva", "Pedro Santos", "Carlos Ferreira"];

  // Verifica se o serviço selecionado é válido
  if (!validServices.includes(service)) {
    return res.status(400).json({
      message: "Serviço inválido. Escolha um serviço de barbearia válido.",
    });
  }

  // Verifica se o barbeiro selecionado é válido
  if (!validBarbers.includes(barber)) {
    return res.status(400).json({
      message: "Barbeiro inválido. Escolha um barbeiro disponível.",
    });
  }

  // Validação adicional para a data e hora
  if (!date || !time) {
    return res.status(400).json({
      message: "Data e hora são obrigatórios.",
    });
  }

  // Converte a data do formato dd/MM/yyyy para um objeto Date
  const parsedDate = parse(date, "dd/MM/yyyy", new Date(), { locale: ptBR });

  if (!isValid(parsedDate)) {
    return res.status(400).json({
      message: "Formato de data inválido. Use o formato dd/MM/yyyy.",
    });
  }

  // Combina data e hora para criar o objeto Date completo
  const dateTimeString = `${format(parsedDate, "yyyy-MM-dd")}T${time}:00`;
  const selectedDate = new Date(`${dateTimeString}-03:00`); // Adiciona o offset do horário de Brasília

  // Normaliza a data atual no fuso horário local
  const now = new Date();
  const nowWithoutSeconds = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
    now.getHours(),
    now.getMinutes()
  );

  if (selectedDate < nowWithoutSeconds) {
    return res.status(400).json({
      message:
        "A data e hora escolhidas já passaram. Selecione uma data futura.",
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

    // Cria o novo agendamento com o barbeiro selecionado
    const schedule = new Schedule({
      user: req.user._id,
      service,
      barber,
      date: selectedDate,
      duration,
      status: "agendado", // Define o status como "agendado"
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
    // Busca todos os agendamentos do usuário e ordena por data de forma decrescente
    const schedules = await Schedule.find({ user: req.user._id }).sort({
      date: -1, // Ordena por data de forma decrescente (mais recente primeiro)
    });

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
  const { date, time, status } = req.body;

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

    // Valida e atualiza a data e hora
    if (date && time) {
      const parsedDate = parse(date, "dd/MM/yyyy", new Date(), {
        locale: ptBR,
      });
      if (!isValid(parsedDate)) {
        return res.status(400).json({
          message: "Formato de data inválido. Use o formato dd/MM/yyyy.",
        });
      }

      const dateTimeString = `${format(parsedDate, "yyyy-MM-dd")}T${time}:00`;
      const newDate = new Date(`${dateTimeString}-03:00`); // Adiciona o offset do horário de Brasília

      if (newDate.getTime() < Date.now()) {
        return res.status(400).json({
          message:
            "O horário escolhido já passou. Selecione um horário futuro.",
        });
      }

      schedule.date = newDate; // Atualiza a data e hora
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
