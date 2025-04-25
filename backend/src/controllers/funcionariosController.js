const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const getAllFuncionarios = async (req, res) => {
  const {
    page = 1,
    limit = 10,
    search = "",
    cargo,
    dataInicial,
    dataFinal,
  } = req.query;

  const skip = (Number(page) - 1) * Number(limit);
  const take = Number(limit);
  const searchTerm = search.toLowerCase();

  const cargos = cargo
    ? Array.isArray(cargo)
      ? cargo
      : cargo
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
          { nome: { contains: searchTerm } },
          { email: { contains: searchTerm } },
          { telefone: { contains: searchTerm } },
        ],
      },
      ...(cargos.length > 0 ? [{ cargo: { in: cargos } }] : []),
      ...dataFiltro,
    ],
  };

  try {
    const [funcionarios, total] = await Promise.all([
      prisma.funcionario.findMany({
        where,
        skip,
        take,
        orderBy: { id: "desc" },
      }),
      prisma.funcionario.count({ where }),
    ]);

    const totalPages = Math.ceil(total / limit);
    const currentPage = totalPages > 0 ? Math.min(Number(page), totalPages) : 0;

    res.json({
      data: funcionarios,
      total,
      page: currentPage,
      totalPages,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao buscar funcionarios." });
  }
};
const createFuncionario = async (req, res) => {
  const data = req.body;

  try {
    const funcionario = await prisma.funcionario.create({ data });
    res
      .status(201)
      .json({ message: "Funcionário criado com sucesso!", funcionario });
  } catch (error) {
    res.status(400).json({ error: "Erro ao criar funcionário." });
  }
};

const updateFuncionario = async (req, res) => {
  const { id } = req.params;
  const data = req.body;

  try {
    const funcionario = await prisma.funcionario.update({
      where: { id: Number(id) },
      data,
    });
    res.json({ message: "Funcionário atualizado com sucesso.", funcionario });
  } catch (error) {
    console.log("erro funcionario", error);
    res.status(400).json({ error: "Erro ao atualizar funcionário." });
  }
};

const deleteFuncionario = async (req, res) => {
  const { id: idsParam } = req.params;
  const ids = idsParam.split(",").map(Number);

  try {
    if (ids.length > 1) {
      await prisma.funcionario.deleteMany({
        where: {
          id: { in: ids },
        },
      });
    } else {
      await prisma.funcionario.delete({
        where: { id: ids[0] },
      });
    }

    res.status(204).send();
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: "Erro ao deletar funcionario(s)." });
  }
};

module.exports = {
  getAllFuncionarios,
  createFuncionario,
  updateFuncionario,
  deleteFuncionario,
};
