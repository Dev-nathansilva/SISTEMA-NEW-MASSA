const permissions = {
  padrao: [
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
  admin: ["Controle"],
};

module.exports = permissions;
