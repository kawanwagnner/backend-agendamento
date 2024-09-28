// src/database/db.js
const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      dbName: "sistema_agendamento",
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Conectado ao MongoDB - Banco de Dados: sistema_agendamento");
  } catch (err) {
    console.error("Erro ao conectar ao MongoDB", err);
    process.exit(1); // Finaliza o processo com erro
  }
};

module.exports = connectDB;
