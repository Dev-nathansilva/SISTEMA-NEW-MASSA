const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const getAllClientes = async (req, res) => {
  try {
    const clientes = await prisma.cliente.findMany();
    res.json(clientes);
  } catch (error) {
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
