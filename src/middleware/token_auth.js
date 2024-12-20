// middlewares/tokenAuth.js

const jwt = require("jsonwebtoken");
const User = require("../models/user");
const logger = require("../utils/logger"); // Importa o logger configurado

const tokenAuth = async (req, res, next) => {
  let token;

  // Verifica se o token está presente no cabeçalho Authorization
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      // Extrai o token do cabeçalho
      token = req.headers.authorization.split(" ")[1];

      // Verifica se o JWT_SECRET está definido
      if (!process.env.JWT_SECRET) {
        logger.error("JWT_SECRET não está definido no ambiente.");
        return res
          .status(500)
          .json({ message: "Configuração do servidor inválida." });
      }

      // Decodifica o token usando o segredo JWT
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Se o token contiver um `role: admin`, não é necessário buscar no banco de dados
      if (decoded.role === "admin") {
        req.user = { role: "admin" }; // Atribui o `role` diretamente
        logger.info(`Admin autenticado com token válido.`);
      } else {
        // Se não for um token de administrador, busca o usuário pelo ID
        req.user = await User.findById(decoded.id).select("-password");

        // Caso o usuário não seja encontrado
        if (!req.user) {
          logger.warn(`Usuário não encontrado para o ID: ${decoded.id}`);
          return res.status(401).json({ message: "Usuário não encontrado." });
        }

        logger.info(`Usuário autenticado: ${req.user.id}`);
      }

      // Chama o próximo middleware se tudo estiver correto
      next();
    } catch (err) {
      // Captura erros de verificação do token
      logger.error(`Erro de autenticação: ${err.message}`);

      if (err.name === "TokenExpiredError") {
        return res.status(401).json({ message: "Token expirado." });
      } else if (err.name === "JsonWebTokenError") {
        return res.status(401).json({ message: "Token inválido." });
      }

      // Para outros erros de JWT
      return res.status(401).json({ message: "Autenticação falhou." });
    }
  } else {
    // Se o token não for fornecido no cabeçalho Authorization
    logger.warn("Tentativa de acesso sem token.");
    return res
      .status(401)
      .json({ message: "Sem autorização, token não fornecido." });
  }
};

module.exports = tokenAuth;
