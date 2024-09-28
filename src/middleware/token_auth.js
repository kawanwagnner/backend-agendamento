const jwt = require("jsonwebtoken");
const User = require("../models/user");

const protect = async (req, res, next) => {
  let token;

  // Verifica se o token está presente no cabeçalho Authorization
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      // Extrai o token e faz a verificação
      token = req.headers.authorization.split(" ")[1];

      // Decodifica o token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Encontra o usuário pelo ID decodificado, excluindo a senha
      req.user = await User.findById(decoded.id).select("-password");

      // Caso o usuário não seja encontrado
      if (!req.user) {
        return res.status(401).json({ message: "Usuário não encontrado." });
      }

      // Chama o próximo middleware se tudo estiver correto
      next();
    } catch (err) {
      // Captura erros de verificação do token
      return res
        .status(401)
        .json({ message: "Token inválido ou não autorizado" });
    }
  }

  // Se o token não for fornecido
  if (!token) {
    return res
      .status(401)
      .json({ message: "Sem autorização, token não fornecido" });
  }
};

module.exports = protect;
