const jwt = require("jsonwebtoken");
const User = require("../models/user");

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

      // Decodifica o token usando o segredo JWT
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Se o token contiver um `role: admin`, não é necessário buscar no banco de dados
      if (decoded.role === "admin") {
        req.user = { role: "admin" }; // Atribui o `role` diretamente
      } else {
        // Se não for um token de administrador, busca o usuário pelo ID
        req.user = await User.findById(decoded.id).select("-password");

        // Caso o usuário não seja encontrado
        if (!req.user) {
          return res.status(401).json({ message: "Usuário não encontrado." });
        }
      }

      // Chama o próximo middleware se tudo estiver correto
      next();
    } catch (err) {
      // Captura erros de verificação do token
      return res
        .status(401)
        .json({ message: "Token inválido ou não autorizado" });
    }
  } else {
    // Se o token não for fornecido no cabeçalho Authorization
    return res
      .status(401)
      .json({ message: "Sem autorização, token não fornecido." });
  }
};

module.exports = tokenAuth;
