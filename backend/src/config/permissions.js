const permissions = {
  admin: [
    "Dashboard",
    "Cadastros",
    "Vendas",
    "Controle",
    "Emissões",
    "CRM",
    "Relatórios",
    "Usuários",
  ],
  vendedor: ["Vendas", "Emissões.Duplicata"],
  padrao: ["Controle"],
};

module.exports = permissions;
