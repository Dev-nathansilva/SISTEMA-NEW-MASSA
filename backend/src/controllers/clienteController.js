const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const getAllClientes = async (req, res) => {
  const { page = 1, limit = 10, search = "", tipo, status } = req.query;

  const skip = (Number(page) - 1) * Number(limit);
  const take = Number(limit);
  const searchTerm = search.toLowerCase();

  // Normaliza `tipo` e `status` para arrays
  const tipos = tipo
    ? Array.isArray(tipo)
      ? tipo
      : tipo
          .split(",")
          .map((t) => t.trim())
          .filter((t) => t)
    : [];

  const statusList = status
    ? Array.isArray(status)
      ? status
      : status
          .split(",")
          .map((s) => s.trim())
          .filter((s) => s)
    : [];

  const where = {
    AND: [
      {
        OR: [
          { nome: { contains: searchTerm } },
          { email: { contains: searchTerm } },
          { documento: { contains: searchTerm } },
          { telefone: { contains: searchTerm } },
          { inscricaoEstadual: { contains: searchTerm } },
        ],
      },
      ...(tipos.length > 0 ? [{ tipo: { in: tipos } }] : []),
      ...(statusList.length > 0 ? [{ status: { in: statusList } }] : []),
    ],
  };

  try {
    const [clientes, total] = await Promise.all([
      prisma.cliente.findMany({
        where,
        skip,
        take,
        orderBy: { id: "desc" },
      }),
      prisma.cliente.count({ where }),
    ]);

    res.json({
      data: clientes,
      total,
      page: Number(page),
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao buscar clientes." });
  }
};

const createCliente = async (req, res) => {
  const data = req.body;

  try {
    const cliente = await prisma.cliente.create({ data });
    res.status(201).json({ message: "Cliente criado com sucesso!", cliente });
  } catch (error) {
    res.status(400).json({ error: "Erro ao criar cliente." });
  }
};

const updateCliente = async (req, res) => {
  const { id } = req.params;
  const data = req.body;

  try {
    const cliente = await prisma.cliente.update({
      where: { id: Number(id) },
      data,
    });
    res.json({ message: "Cliente atualizado com sucesso.", cliente });
  } catch (error) {
    res.status(400).json({ error: "Erro ao atualizar cliente." });
  }
};

const deleteCliente = async (req, res) => {
  const { id } = req.params;

  try {
    await prisma.cliente.delete({ where: { id: Number(id) } });
    res.status(204).send();
  } catch (error) {
    res.status(400).json({ error: "Erro ao deletar cliente." });
  }
};

module.exports = {
  getAllClientes,
  createCliente,
  updateCliente,
  deleteCliente,
};
