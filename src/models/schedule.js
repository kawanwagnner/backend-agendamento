const mongoose = require("mongoose");

const scheduleSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  service: {
    type: String,
    required: true,
    enum: [
      "Corte de cabelo",
      "Barba",
      "Corte e Barba",
      "Sobrancelha",
      "Lavar e Secar",
    ], // Serviços de barbearia
  },
  date: {
    type: Date,
    required: true,
  },
  duration: {
    type: Number,
    required: true,
    min: 15, // Define um tempo mínimo de duração para um serviço
  },
  status: {
    type: String,
    enum: ["agendado", "concluído", "cancelado"],
    default: "agendado",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Schedule", scheduleSchema);
