// utils/logger.js

const { createLogger, format, transports } = require("winston");
const { combine, timestamp, printf, colorize } = format;

// Define um formato personalizado para as mensagens de log
const myFormat = printf(({ level, message, timestamp }) => {
  return `${timestamp} [${level}]: ${message}`;
});

// Cria uma instância do logger
const logger = createLogger({
  level: "info", // Nível mínimo de log a ser registrado
  format: combine(
    colorize(), // Adiciona cores aos logs no console
    timestamp({ format: "YYYY-MM-DD HH:mm:ss" }), // Formata o timestamp
    myFormat // Aplica o formato personalizado
  ),
  transports: [
    new transports.Console(), // Loga no console
    new transports.File({ filename: "logs/error.log", level: "error" }), // Loga erros em um arquivo
    new transports.File({ filename: "logs/combined.log" }), // Loga todos os níveis em outro arquivo
  ],
});

// Exporta o logger para uso em outros arquivos
module.exports = logger;
