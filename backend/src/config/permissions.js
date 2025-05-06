const permissions = {
  Admin: [
    "Dashboard",
    "Cadastros",
    "Vendas",
    "Controle",
    "Emissões",
    "CRM",
    "Relatórios",
    "Usuários",
  ],
  Vendedor: ["Vendas", "Emissões.Duplicata"],
  Padrão: ["Controle"],
};

module.exports = permissions;
