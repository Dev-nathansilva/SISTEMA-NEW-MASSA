"use client";

import { useState } from "react";
import { Box, Flex } from "@chakra-ui/react";
import Sidebar from "@/components/Layout/Sidebar";
import Topbar from "@/components/Layout/Topbar";
import RightPanel from "@/components/Layout/RightPanel";
import DashboardPage from "@/components/pages/DashboardPage";
import ListPage from "@/components/pages/Users/ListPage";
import NewUsersPage from "../pages/users/NewUsersPage";

export default function MainLayout() {
  const [activePage, setActivePage] = useState({ main: "Dashboard", sub: "" });
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isRightPanelOpen, setIsRightPanelOpen] = useState(false);

  // Mapeamento de páginas
  const pages = {
    Dashboard: <DashboardPage />,
    Usuários: {
      Lista: <ListPage />,
      "Novo Usuário": <NewUsersPage />,
    },
  };

  // Determinar qual conteúdo renderizar
  const currentPageContent =
    activePage.sub && pages[activePage.main]?.[activePage.sub]
      ? pages[activePage.main][activePage.sub]
      : pages[activePage.main] || <DashboardPage />;

  return (
    <Flex height="100vh">
      {/* Sidebar */}
      <Sidebar
        isOpen={isSidebarOpen}
        toggle={() => setIsSidebarOpen(!isSidebarOpen)}
        setActivePage={setActivePage}
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
