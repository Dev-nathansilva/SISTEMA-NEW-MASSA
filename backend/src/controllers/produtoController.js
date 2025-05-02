const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const getAllProdutos = async (req, res) => {
  const {
    page = 1,
    limit = 10,
    search = "",
    formato,
    unidade,
    status,
    dataInicial,
    dataFinal,
  } = req.query;

  const skip = (Number(page) - 1) * Number(limit);
  const take = Number(limit);
  const searchTerm = search.toLowerCase();

  const precoVendaNumber = parseFloat(searchTerm);

  const formatos = formato
    ? Array.isArray(formato)
      ? formato
      : formato
          .split(",")
          .map((t) => t.trim())
          .filter((t) => t)
    : [];

  const unidades = unidade
    ? Array.isArray(unidade)
      ? unidade
      : unidade
          .split(",")
          .map((t) => t.trim())
          .filter((t) => t)
    : [];

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
          { descricao: { contains: searchTerm } },
          { codigoSKU: { contains: searchTerm } },
          { codigoBarrasGTIN: { contains: searchTerm } },
          { observacoes: { contains: searchTerm } },
          ...(isNaN(precoVendaNumber)
            ? []
            : [
                {
                  precoVenda: {
                    gte: precoVendaNumber - 0.01,
                    lte: precoVendaNumber + 0.01,
                  },
                },
              ]),
        ],
      },
      ...(formatos.length > 0 ? [{ formato: { in: formatos } }] : []),
      ...(unidades.length > 0 ? [{ unidade: { in: unidades } }] : []),
      ...(statusList.length === 1
        ? [{ status: { equals: statusList[0] } }]
        : []),
      ...dataFiltro,
    ],
  };

  try {
    const [produtos, total] = await Promise.all([
      prisma.produto.findMany({
        where,
        skip,
        take,
        orderBy: { id: "desc" },
        include: {
          componentes: {
            include: {
              produto: {
                select: {
                  id: true,
                  descricao: true,
                  codigoSKU: true,
                  estoque: true,
                },
              },
            },
          },
          composicoes: {
            include: {
              componente: {
                select: {
                  id: true,
                  descricao: true,
                  codigoSKU: true,
                  estoque: true,
                },
              },
            },
          },
          fornecedores: {
            include: {
              fornecedor: {
                select: {
                  id: true,
                  nome: true,
                  documento: true,
                  status: true,
                },
              },
            },
          },
        },
      }),
      prisma.produto.count({ where }),
    ]);

    const totalPages = Math.ceil(total / limit);
    const currentPage = totalPages > 0 ? Math.min(Number(page), totalPages) : 0;

    res.json({
      data: produtos,
      total,
      page: currentPage,
      totalPages,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao buscar produtos." });
  }
};

const getProdutoById = async (req, res) => {
  const { id } = req.params;

  try {
    const produto = await prisma.produto.findUnique({
      where: { id: Number(id) },
      include: {
        componentes: true,
        composicoes: true,
        fornecedores: {
          include: {
            fornecedor: {
              select: {
                id: true,
                nome: true,
                documento: true,
                cidade: true,
                status: true,
              },
            },
          },
        },
      },
    });

    if (!produto) {
      return res.status(404).json({ error: "Produto não encontrado." });
    }

    res.json(produto);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao buscar produto." });
  }
};

const createProduto = async (req, res) => {
  const data = req.body;

  try {
    const result = await prisma.produto.create({
      data: {
        ...data,
        composicoes: {
          create: data.composicoes?.map((comp) => ({
            componente: {
              connect: { id: comp.componenteId },
            },
            quantidade: comp.quantidade,
          })),
        },
        fornecedores: {
          create: data.fornecedores?.map((forn) => ({
            fornecedor: {
              connect: { id: forn.fornecedorId },
            },
          })),
        },
      },
      include: { composicoes: true, fornecedores: true },
    });

    res.status(201).json({
      message: "Produto criado com sucesso!",
      produto: result,
    });
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: "Erro ao criar produto." });
  }
};

const updateProduto = async (req, res) => {
  const { id } = req.params;
  const data = req.body;

  try {
    // Remova composicoes e fornecedores antes de usar ...data
    const { composicoes, fornecedores, ...produtoData } = data;

    const produto = await prisma.produto.update({
      where: { id: Number(id) },
      data: {
        ...produtoData,
      },
    });

    // Zera as composições
    await prisma.composicao.deleteMany({
      where: { produtoId: Number(id) },
    });

    if (composicoes?.length > 0) {
      await prisma.composicao.createMany({
        data: composicoes.map((comp) => ({
          produtoId: Number(id),
          componenteId: comp.componenteId,
          quantidade: comp.quantidade,
        })),
      });
    }

    // Zera os fornecedores
    await prisma.fornecedorProduto.deleteMany({
      where: { produtoId: Number(id) },
    });

    if (fornecedores?.length > 0) {
      await prisma.fornecedorProduto.createMany({
        data: fornecedores.map((forn) => ({
          produtoId: Number(id),
          fornecedorId: forn.fornecedorId,
        })),
      });
    }

    res.json({ message: "Produto atualizado com sucesso.", produto });
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: "Erro ao atualizar produto." });
  }
};

const deleteProduto = async (req, res) => {
  const { id: idsParam } = req.params;
  const ids = idsParam.split(",").map(Number);

  try {
    for (const id of ids) {
      // Remove composições onde o produto é o principal
      await prisma.composicao.deleteMany({
        where: { produtoId: id },
      });

      // Remove composições onde o produto é componente de outro
      await prisma.composicao.deleteMany({
        where: { componenteId: id },
      });

      // Remove fornecedores do produto
      await prisma.fornecedorProduto.deleteMany({
        where: { produtoId: id },
      });

      // Remove o produto
      await prisma.produto.delete({
        where: { id },
      });
    }

    res.status(204).send();
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: "Erro ao deletar produto(s)." });
  }
};

module.exports = {
  getAllProdutos,
  getProdutoById,
  createProduto,
  updateProduto,
  deleteProduto,
};
