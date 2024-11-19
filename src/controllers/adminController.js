///////////////////////// Imports /////////////////////////

const Schedule = require("../models/schedule");
const User = require("../models/user");

///////////////////////// Função de Resposta /////////////////////////

// Função centralizada de resposta HTTP
const sendResponse = (res, statusCode, data = null, message = null) => {
  res.status(statusCode).json({ message, data });
};

///////////////////////// Schedule /////////////////////////

// Ver todos os agendamentos
exports.getAllSchedules = async (req, res) => {
  try {
    const schedules = await Schedule.find()
      .populate("user", "-password -user") // Exclui os campos 'password' e 'user' dos dados relacionados ao usuário
      .sort({ date: -1 }); // Mais recentes primeiro

    // Filtra para remover o agendamento com o _id específico
    const filteredSchedules = schedules.filter(
      (schedule) => schedule._id.toString() !== "6700265f7f51cc7e7f0ad9ca"
    );

    sendResponse(
      res,
      200,
      filteredSchedules,
      "Agendamentos encontrados com sucesso"
    );
  } catch (error) {
    console.error(error);
    sendResponse(res, 500, null, "Erro ao buscar agendamentos");
  }
};

// Ver um agendamento específico
exports.getSingleSchedule = async (req, res) => {
  try {
    const { id } = req.params;
    const schedule = await Schedule.findById(id).populate(
      "user",
      "-password -user"
    );
    if (!schedule) {
      return sendResponse(res, 404, null, "Agendamento não encontrado");
    }
    sendResponse(res, 200, schedule, "Agendamento encontrado com sucesso");
  } catch (error) {
    console.error(error);
    sendResponse(res, 500, null, "Erro ao buscar agendamento");
  }
};

// Atualizar um agendamento
exports.updateSchedule = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedScheduleData = req.body;
    const schedule = await Schedule.findByIdAndUpdate(id, updatedScheduleData, {
      new: true,
    });
    if (!schedule) {
      return sendResponse(res, 404, null, "Agendamento não encontrado");
    }
    sendResponse(res, 200, schedule, "Agendamento atualizado com sucesso");
  } catch (error) {
    console.error(error);
    sendResponse(res, 500, null, "Erro ao atualizar agendamento");
  }
};

// Deletar um agendamento
exports.deleteSchedule = async (req, res) => {
  try {
    const { id } = req.params;
    const schedule = await Schedule.findByIdAndDelete(id);
    if (!schedule) {
      return sendResponse(res, 404, null, "Agendamento não encontrado");
    }
    sendResponse(res, 200, null, "Agendamento deletado com sucesso");
  } catch (error) {
    console.error(error);
    sendResponse(res, 500, null, "Erro ao deletar agendamento");
  }
};

// Bloquear um dia
exports.blockDay = async (req, res) => {
  try {
    const { date } = req.body;
    // Lógica para bloquear o dia
    sendResponse(
      res,
      200,
      null,
      `Dia ${date} bloqueado para novos agendamentos com sucesso.`
    );
  } catch (error) {
    console.error(error);
    sendResponse(res, 500, null, "Erro ao bloquear o dia");
  }
};

///////////////////////// Usuários /////////////////////////

// Ver todos os usuários
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 }); // Mais recentes primeiro
    sendResponse(res, 200, users, "Usuários encontrados com sucesso");
  } catch (error) {
    console.error(error);
    sendResponse(res, 500, null, "Erro ao buscar usuários");
  }
};

// Ver um usuário específico
exports.getSingleUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id).select("-password -__v"); // Exclui campos confidenciais
    if (!user) {
      return sendResponse(res, 404, null, "Usuário não encontrado");
    }
    sendResponse(res, 200, user, "Usuário encontrado com sucesso");
  } catch (error) {
    console.error(error);
    sendResponse(res, 500, null, "Erro ao buscar usuário");
  }
};

// Atualizar um usuário
exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedUserData = req.body;
    const user = await User.findByIdAndUpdate(id, updatedUserData, {
      new: true,
    });
    if (!user) {
      return sendResponse(res, 404, null, "Usuário não encontrado");
    }
    sendResponse(res, 200, user, "Usuário atualizado com sucesso");
  } catch (error) {
    console.error(error);
    sendResponse(res, 500, null, "Erro ao atualizar usuário");
  }
};

// Deletar um usuário
exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findByIdAndDelete(id);
    if (!user) {
      return sendResponse(res, 404, null, "Usuário não encontrado");
    }
    sendResponse(res, 200, null, "Usuário deletado com sucesso");
  } catch (error) {
    console.error(error);
    sendResponse(res, 500, null, "Erro ao deletar usuário");
  }
};
