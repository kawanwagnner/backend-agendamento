const mongoose = require("mongoose");

const BarberSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  profilePicture: {
    type: String, // URL da foto de perfil do barbeiro
    required: false, // Opcional
  },
  bio: {
    type: String,
    required: false,
  },
  socialLinks: {
    instagram: { type: String, required: false },
    facebook: { type: String, required: false },
    twitter: { type: String, required: false },
  },
  specialties: {
    type: [String], // Ex: ["Corte de cabelo", "Barba", "Sobrancelha"]
    required: false,
  },
  portfolio: {
    type: [
      {
        photo: {
          type: String, // URL da foto
          required: true,
        },
        description: {
          type: String, // Opcional, descrição da foto
          required: false,
        },
      },
    ],
    validate: [arrayLimit, "O portfólio deve conter pelo menos uma foto."],
  },
  availability: {
    type: Boolean, // Se o barbeiro está disponível para agendamentos
    default: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Função de validação para garantir pelo menos uma foto no portfólio
function arrayLimit(val) {
  return val.length > 0; // Exige pelo menos uma foto
}

module.exports = mongoose.model("Barber", BarberSchema);
