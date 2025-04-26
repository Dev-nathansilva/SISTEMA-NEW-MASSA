const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const getAllVendedores = async (req, res) => {
  const {
    page = 1,
    limit = 10,
    search = "",
    status,
    dataInicial,
    dataFinal,
  } = req.query;

  const skip = (Number(page) - 1) * Number(limit);
  const take = Number(limit);
  const searchTerm = search.toLowerCase();

  const statusList = status
    ? Array.isArray(status)
      ? status.map((s) => s === "true")
      : status
          .split(",")
          .map((s) => s.trim())
          .filter((s) => s === "true" || s === "false")
          .map((s) => s === "true")
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
      ...(statusList.length === 1
        ? [{ status: { equals: statusList[0] } }]
        : []),
      ...dataFiltro,
    ],
  };

  try {
    const [vendedores, total] = await Promise.all([
      prisma.vendedor.findMany({
        where,
        skip,
        take,
        orderBy: { id: "desc" },
      }),
      prisma.vendedor.count({ where }),
    ]);

    const totalPages = Math.ceil(total / limit);
    const currentPage = totalPages > 0 ? Math.min(Number(page), totalPages) : 0;

    res.json({
      data: vendedores,
      total,
      page: currentPage,
      totalPages,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao buscar vendedores." });
  }
};

const createVendedor = async (req, res) => {
  const data = req.body;

  try {
    const result = await prisma.vendedor.createMany({ data });
    res.status(201).json({
      message: "Vendedores criados com sucesso!",
      count: result.count,
    });
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: "Erro ao criar Vendedores." });
  }
};

const updateVendedor = async (req, res) => {
  const { id } = req.params;
  const data = req.body;

  try {
    const vendedor = await prisma.vendedor.update({
      where: { id: Number(id) },
      data,
    });
    res.json({ message: "Vendedor atualizado com sucesso.", vendedor });
  } catch (error) {
    res.status(400).json({ error: "Erro ao atualizar vendedor." });
  }
};

const deleteVendedor = async (req, res) => {
  const { id: idsParam } = req.params;
  const ids = idsParam.split(",").map(Number);

  try {
    if (ids.length > 1) {
      await prisma.vendedor.deleteMany({
        where: {
          id: { in: ids },
        },
      });
    } else {
      await prisma.vendedor.delete({
        where: { id: ids[0] },
      });
    }

    res.status(204).send();
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: "Erro ao deletar vendedor(es)." });
  }
};

module.exports = {
  getAllVendedores,
  createVendedor,
  updateVendedor,
  deleteVendedor,
};
