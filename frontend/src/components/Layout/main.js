"use client";

import { useState, useEffect, useMemo } from "react";
import "rsuite/dist/rsuite.min.css";

import { Box, Flex } from "@chakra-ui/react";
import Sidebar from "@/components/Layout/Sidebar";
import Topbar from "@/components/Layout/Topbar";
import RightPanel from "@/components/Layout/RightPanel";
import DashboardPage from "@/components/pages/DashboardPage";
import ClientesPage from "../pages/cadastros/ClientesPage";
import FornecedoresPage from "../pages/cadastros/FornecedoresPage";
import ProdutosPage from "../pages/cadastros/ProdutosPage";
import VendedoresPage from "../pages/cadastros/VendedoresPage";
import FuncionariosPage from "../pages/cadastros/FuncionariosPage";
import TeladeVendasPage from "../pages/vendas/TeladeVendasPage";
import ExtratoPage from "../pages/vendas/ExtratoPage";
import ComissoesPage from "../pages/vendas/ComissoesPage";
import EstoquePage from "../pages/controle/EstoquePage";
import FinanceiroPage from "../pages/controle/FinanceiroPage";
import RotasPage from "../pages/controle/RotasPage";
import ContasPage from "../pages/controle/ContasPage";
import BoletoPage from "../pages/emissoes/BoletoPage";
import NotaFiscalPage from "../pages/emissoes/NotaFiscalPage";
import DuplicataPage from "../pages/emissoes/DuplicataPage";
import ChequePage from "../pages/emissoes/ChequePage";
import CRMPage from "../pages/CRMPage";
import RelatoriosPage from "../pages/RelatoriosPage";
import UsuariosPage from "../pages/UsuariosPage";

const pages = {
  Dashboard: <DashboardPage />,
  "Cadastros.Clientes": <ClientesPage />,
  "Cadastros.Fornecedores": <FornecedoresPage />,
  "Cadastros.Produtos": <ProdutosPage />,
  "Cadastros.Vendedores": <VendedoresPage />,
  "Cadastros.Funcionários": <FuncionariosPage />,
  "Vendas.Tela de Vendas": <TeladeVendasPage />,
  "Vendas.Extrato": <ExtratoPage />,
  "Vendas.Comissões": <ComissoesPage />,
  "Controle.Estoque": <EstoquePage />,
  "Controle.Financeiro / Transações": <FinanceiroPage />,
  "Controle.Rotas": <RotasPage />,
  "Controle.Contas": <ContasPage />,
  "Emissões.Boleto": <BoletoPage />,
  "Emissões.Nota Fiscal": <NotaFiscalPage />,
  "Emissões.Duplicata": <DuplicataPage />,
  "Emissões.Cheque": <ChequePage />,
  CRM: <CRMPage />,
  Relatórios: <RelatoriosPage />,
  Usuários: <UsuariosPage />,
};

export default function MainLayout({ user, permissions }) {
  const [activePage, setActivePage] = useState({ main: "", sub: "" });
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isRightPanelOpen, setIsRightPanelOpen] = useState(false);

  useEffect(() => {
    if (permissions.length) {
      let firstPage = permissions[0];

      // Se for uma categoria, buscar o primeiro submenu correspondente
      if (!pages[firstPage]) {
        const category = permissions.find((perm) => !perm.includes("."));
        if (category) {
          const firstSubmenu = Object.keys(pages).find((page) =>
            page.startsWith(`${category}.`)
          );
          if (firstSubmenu) {
            firstPage = firstSubmenu;
          }
        }

        // Se não encontrar submenu, pegar o primeiro disponível na lista
        if (!firstPage || !pages[firstPage]) {
          firstPage =
            permissions.find((perm) => perm.includes(".")) || firstPage;
        }
      }

      const [main, sub] = firstPage.split(".");
      setActivePage({ main, sub: sub || "" });
    }
  }, [permissions]);

  const getPageContent = useMemo(() => {
    if (activePage.sub) {
      return pages[`${activePage.main}.${activePage.sub}`] || null;
    }
    return pages[activePage.main] || null;
  }, [activePage]);

  return (
    <Flex className="bg-principal">
      <Sidebar
        isOpen={isSidebarOpen}
        toggle={() => setIsSidebarOpen(!isSidebarOpen)}
        setActivePage={setActivePage}
        permissions={permissions}
      />

      <Box
        flex="1"
        display="flex"
        flexDirection="column"
        pl={isSidebarOpen ? "220px" : "100px"}
        transition="padding 0.3s"
      >
        <Topbar
          user={user}
          mainTitle={activePage.main}
          subTitle={activePage.sub}
          toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
          toggleRightPanel={() => setIsRightPanelOpen(!isRightPanelOpen)}
        />
        <Box flex="1">{getPageContent}</Box>
      </Box>

      {isRightPanelOpen && (
        <RightPanel onClose={() => setIsRightPanelOpen(false)} />
      )}
    </Flex>
  );
}
