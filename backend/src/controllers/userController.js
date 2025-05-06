const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const UserService = require("../services/userService");

const register = async (req, res) => {
  const data = req.body;

  try {
    if (req.file) {
      data.fotoPerfil = req.file.filename;
    }
    const user = await UserService.createUser(data);
    res.json({ message: "Usuário criado!" });
  } catch (error) {
    if (error.code === "P2002" && error.meta?.target.includes("email")) {
      return res.status(400).json({ error: "E-mail já cadastrado." });
    }

    console.error(error);
    res
      .status(400)
      .json({ error: "Erro ao criar usuário. Verifique os dados enviados." });
  }
};

const login = async (req, res) => {
  const { email, password, rememberMe } = req.body;
  try {
    const { token, user } = await UserService.authenticateUser(
      email,
      password,
      rememberMe
    );
    res.json({ token, user });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getAllUsuarios = async (req, res) => {
  const {
    page = 1,
    limit = 10,
    search = "",
    nivel,
    dataInicial,
    dataFinal,
  } = req.query;

  const skip = (Number(page) - 1) * Number(limit);
  const take = Number(limit);
  const searchTerm = search.toLowerCase();

  const niveis = nivel
    ? Array.isArray(nivel)
      ? nivel
      : nivel
          .split(",")
          .map((t) => t.trim())
          .filter((t) => t)
    : [];

  const dataFiltro = [];

  if (dataInicial) {
    dataFiltro.push({
      dataCadastro: { gte: new Date(dataInicial) },
    });
  }

  if (dataFinal) {
    // Considera o fim do dia
    const dataFinalCompleta = new Date(dataFinal);
    dataFinalCompleta.setHours(23, 59, 59, 999);

    dataFiltro.push({
      dataCadastro: { lte: dataFinalCompleta },
    });
  }

  const where = {
    AND: [
      {
        OR: [
          { name: { contains: searchTerm } },
          { email: { contains: searchTerm } },
          { telefone: { contains: searchTerm } },
        ],
      },
      ...(niveis.length > 0 ? [{ nivel: { in: niveis } }] : []),
      ...dataFiltro,
    ],
  };

  try {
    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        skip,
        take,
        orderBy: { id: "desc" },
      }),
      prisma.user.count({ where }),
    ]);

    const totalPages = Math.ceil(total / limit);
    const currentPage = totalPages > 0 ? Math.min(Number(page), totalPages) : 0;

    res.json({
      data: users,
      total,
      page: currentPage,
      totalPages,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao buscar users." });
  }
};

const updateUsuario = async (req, res) => {
  const { id } = req.params;
  const data = req.body;

  try {
    if (req.file) {
      data.fotoPerfil = req.file.filename;
    }

    const user = await prisma.user.update({
      where: { id },
      data,
    });
    res.json({ message: "Usuário atualizado com sucesso.", user });
  } catch (error) {
    console.log("erro user", error);
    res.status(400).json({ error: "Erro ao atualizar usuário." });
  }
};

const deleteUsuario = async (req, res) => {
  const { id: idsParam } = req.params;
  const ids = idsParam.split(",");

  try {
    if (ids.length > 1) {
      await prisma.user.deleteMany({
        where: {
          id: { in: ids },
        },
      });
    } else {
      await prisma.user.delete({
        where: { id: ids[0] },
      });
    }

    res.status(204).send();
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: "Erro ao deletar usuário(s)." });
  }
};

module.exports = {
  register,
  login,
  getAllUsuarios,
  updateUsuario,
  deleteUsuario,
};
