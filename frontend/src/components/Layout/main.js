"use client";

import { useState, useEffect } from "react";
import { Box, Flex } from "@chakra-ui/react";
import Sidebar from "@/components/Layout/Sidebar";
import Topbar from "@/components/Layout/Topbar";
import RightPanel from "@/components/Layout/RightPanel";
import DashboardPage from "@/components/pages/DashboardPage";
import ListPage from "@/components/pages/users/ListPage";
import NewUsersPage from "../pages/users/NewUsersPage";
import SalesPage from "@/components/pages/SalesPage";

export default function MainLayout({ user }) {
  const [activePage, setActivePage] = useState({ main: "", sub: "" });
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isRightPanelOpen, setIsRightPanelOpen] = useState(false);

  // Permissões por tipo de usuário
  const permissions = {
    admin: [
      "Dashboard",
      "Usuários",
      "Vendas",
      "Usuários - Lista",
      "Usuários - Novo Usuário",
    ],
    vendedor: ["Vendas"],
    padrao: ["Dashboard", "Vendas", "Usuários - Lista"],
  };

  const userPermissions = permissions[user.nivel] || permissions["padrao"];

  // Definição das páginas e submenus
  const pages = {
    Dashboard: <DashboardPage />,
    Usuários: {
      Lista: <ListPage />,
      "Novo Usuário": <NewUsersPage />,
    },
    Vendas: <SalesPage />,
  };

  // Gerar lista de páginas acessíveis
  const accessiblePages = Object.keys(pages).reduce((acc, mainPage) => {
    if (userPermissions.includes(mainPage)) {
      acc.push({ main: mainPage, sub: "" });
    }
    if (typeof pages[mainPage] === "object") {
      Object.keys(pages[mainPage]).forEach((subPage) => {
        if (userPermissions.includes(`${mainPage} - ${subPage}`)) {
          acc.push({ main: mainPage, sub: subPage });
        }
      });
    }
    return acc;
  }, []);

  // Escolher a primeira página disponível ao carregar
  useEffect(() => {
    if (accessiblePages.length > 0) {
      setActivePage(accessiblePages[0]); // Define a primeira página permitida
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user.nivel]);

  // Determinar qual conteúdo renderizar
  const currentPageContent =
    activePage.sub && pages[activePage.main]?.[activePage.sub]
      ? pages[activePage.main][activePage.sub]
      : pages[activePage.main] || null;

  return (
    <Flex height="100vh">
      {/* Sidebar */}
      <Sidebar
        isOpen={isSidebarOpen}
        toggle={() => setIsSidebarOpen(!isSidebarOpen)}
        setActivePage={setActivePage}
        accessiblePages={accessiblePages.map((p) =>
          p.sub ? `${p.main} - ${p.sub}` : p.main
        )} // Passa as páginas acessíveis para a sidebar
      />

      {/* Conteúdo Principal */}
      <Box flex="1" display="flex" flexDirection="column">
        <Topbar
          pageTitle={
            activePage.sub
              ? `${activePage.main} / ${activePage.sub}`
              : activePage.main
          }
          toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
          toggleRightPanel={() => setIsRightPanelOpen(!isRightPanelOpen)}
        />
        <Box flex="1" p={4}>
          {currentPageContent}
        </Box>
      </Box>

      {/* Painel Lateral Direito */}
      {isRightPanelOpen && (
        <RightPanel onClose={() => setIsRightPanelOpen(false)} />
      )}
    </Flex>
  );
}
