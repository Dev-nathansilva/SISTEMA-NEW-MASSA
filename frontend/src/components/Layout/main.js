"use client";

import { useState, useEffect } from "react";
import { Box, Flex } from "@chakra-ui/react";
import Sidebar from "@/components/Layout/Sidebar";
import Topbar from "@/components/Layout/Topbar";
import RightPanel from "@/components/Layout/RightPanel";
import DashboardPage from "@/components/pages/DashboardPage";
import ListPage from "@/components/pages/users/ListPage";
import NewUsersPage from "@/components/pages/users/NewUsersPage";
import SalesPage from "@/components/pages/SalesPage";

const pages = {
  Dashboard: <DashboardPage />,
  Usuários: {
    Lista: <ListPage />,
    "Novo Usuário": <NewUsersPage />,
  },
  Vendas: <SalesPage />,
};

export default function MainLayout({ user, permissions }) {
  const [activePage, setActivePage] = useState({ main: "", sub: "" });
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isRightPanelOpen, setIsRightPanelOpen] = useState(false);

  useEffect(() => {
    const mainPages = Object.keys(permissions).filter(
      (page) => permissions[page]
    );
    if (mainPages.length) setActivePage({ main: mainPages[0], sub: "" });
  }, [permissions]);

  const currentPageContent = activePage.sub
    ? pages[activePage.main]?.[activePage.sub]
    : pages[activePage.main] || null;

  return (
    <Flex height="100vh">
      <Sidebar
        isOpen={isSidebarOpen}
        toggle={() => setIsSidebarOpen(!isSidebarOpen)}
        setActivePage={setActivePage}
        permissions={permissions}
      />

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

      {isRightPanelOpen && (
        <RightPanel onClose={() => setIsRightPanelOpen(false)} />
      )}
    </Flex>
  );
}
