const permissions = {
  admin: {
    Dashboard: true,
    Usuários: ["Lista", "Novo Usuário"],
    Vendas: true,
  },
  vendedor: {
    Vendas: true,
  },
  padrao: {
    Dashboard: true,
    Usuários: ["Lista"],
    Vendas: true,
  },
};

module.exports = permissions;
