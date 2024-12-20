const Barber = require("../models/barber");

// Criar um novo barbeiro
exports.createBarber = async (req, res) => {
  const { name, profilePicture, bio, socialLinks, specialties, portfolio } =
    req.body;

  try {
    // Validação para garantir que o portfólio tenha pelo menos uma foto
    if (!portfolio || !Array.isArray(portfolio) || portfolio.length === 0) {
      return res
        .status(400)
        .json({ message: "O portfólio deve conter pelo menos uma foto." });
    }

    // Criação do barbeiro
    const barber = new Barber({
      name,
      profilePicture,
      bio,
      socialLinks,
      specialties,
      portfolio,
    });

    await barber.save();
    res.status(201).json({
      message: "Barbeiro criado com sucesso!",
      barber,
    });
  } catch (err) {
    res.status(500).json({
      message: "Erro ao criar barbeiro.",
      error: err.message,
    });
  }
};

// Listar todos os barbeiros
exports.getAllBarbers = async (req, res) => {
  try {
    const barbers = await Barber.find();

    if (barbers.length === 0) {
      return res.status(200).json({ message: "Nenhum barbeiro encontrado." });
    }

    res.status(200).json(barbers);
  } catch (err) {
    res.status(500).json({
      message: "Erro ao buscar barbeiros.",
      error: err.message,
    });
  }
};

// Obter um barbeiro pelo ID
exports.getBarberById = async (req, res) => {
  try {
    const barber = await Barber.findById(req.params.id);

    if (!barber) {
      return res.status(404).json({ message: "Barbeiro não encontrado." });
    }

    res.status(200).json(barber);
  } catch (err) {
    res.status(500).json({
      message: "Erro ao buscar barbeiro.",
      error: err.message,
    });
  }
};

// Atualizar informações de um barbeiro
exports.updateBarber = async (req, res) => {
  const { name, profilePicture, bio, socialLinks, specialties, portfolio } =
    req.body;

  try {
    const barber = await Barber.findById(req.params.id);

    if (!barber) {
      return res.status(404).json({ message: "Barbeiro não encontrado." });
    }

    // Atualizar os campos fornecidos
    if (name) barber.name = name;
    if (profilePicture) barber.profilePicture = profilePicture;
    if (bio) barber.bio = bio;

    // Verifica e atualiza os links sociais, somente se houver
    if (socialLinks) {
      barber.socialLinks = {
        instagram: socialLinks.instagram || null,
        facebook: socialLinks.facebook || null,
        twitter: socialLinks.twitter || null,
      };
    }

    if (specialties) barber.specialties = specialties;

    // Validação e atualização do portfólio
    if (portfolio && Array.isArray(portfolio) && portfolio.length > 0) {
      barber.portfolio = portfolio;
    } else if (portfolio) {
      return res
        .status(400)
        .json({ message: "O portfólio deve conter pelo menos uma foto." });
    }

    await barber.save();

    res.status(200).json({
      message: "Barbeiro atualizado com sucesso!",
      barber,
    });
  } catch (err) {
    res.status(500).json({
      message: "Erro ao atualizar barbeiro.",
      error: err.message,
    });
  }
};

// Excluir um barbeiro
exports.deleteBarber = async (req, res) => {
  try {
    const barber = await Barber.findById(req.params.id);

    if (!barber) {
      return res.status(404).json({ message: "Barbeiro não encontrado." });
    }

    // Usar o método findByIdAndDelete diretamente no modelo Barber
    await Barber.findByIdAndDelete(req.params.id);

    res.status(200).json({ message: "Barbeiro excluído com sucesso." });
  } catch (err) {
    res.status(500).json({
      message: "Erro ao excluir barbeiro.",
      error: err.message,
    });
  }
};
