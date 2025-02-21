"use client";

import { useState } from "react";
import { Box, Text, VStack } from "@chakra-ui/react";
import { FiUsers, FiShoppingCart } from "react-icons/fi";
import { BiSolidDashboard } from "react-icons/bi";

export default function Sidebar({
  isOpen,
  toggle,
  setActivePage,
  permissions,
}) {
  const [hoveredMenu, setHoveredMenu] = useState(null);

  // Verifica se o usuário tem permissão para acessar um menu principal
  const hasPermission = (menu) => {
    return (
      permissions[menu] === true ||
      (Array.isArray(permissions[menu]) && permissions[menu].length > 0)
    );
  };

  // Verifica se o usuário tem permissão para acessar um submenu
  const hasSubPermission = (menu, sub) => {
    return Array.isArray(permissions[menu]) && permissions[menu].includes(sub);
  };

  // Estrutura do menu com submenus
  const menuItems = [
    { name: "Dashboard", icon: <BiSolidDashboard />, submenu: [] },
    {
      name: "Usuários",
      icon: <FiUsers />,
      submenu: permissions["Usuários"] || [],
    },
    { name: "Vendas", icon: <FiShoppingCart />, submenu: [] },
  ];

  return (
    <Box
      width={isOpen ? "200px" : "70px"}
      transition="width 0.3s"
      bg="gray.800"
      color="white"
      height="100vh"
      p={4}
      position="relative"
    >
      {/* Menu de Itens */}
      <VStack spacing={4} align="stretch">
        {menuItems.map((item) => {
          if (!hasPermission(item.name)) return null; // Esconde itens sem permissão

          return (
            <Box
              key={item.name}
              position="relative"
              onMouseEnter={() =>
                item.submenu.length > 0 && setHoveredMenu(item.name)
              }
              onMouseLeave={() =>
                item.submenu.length > 0 && setHoveredMenu(null)
              }
            >
              {/* Item principal do menu */}
              <Box
                display="flex"
                alignItems="center"
                p={2}
                borderRadius="md"
                cursor="pointer"
                bg={hoveredMenu === item.name ? "gray.700" : "transparent"}
                _hover={{ bg: "gray.700" }}
                onClick={() =>
                  item.submenu.length === 0 &&
                  setActivePage({ main: item.name, sub: "" })
                }
              >
                {item.icon}
                {isOpen && <Text ml={3}>{item.name}</Text>}
              </Box>

              {/* Submenu */}
              {item.submenu.length > 0 && hoveredMenu === item.name && (
                <Box
                  position="absolute"
                  left={isOpen ? "100%" : "60px"}
                  top="0"
                  bg="gray.700"
                  borderRadius="md"
                  p={2}
                  zIndex={10}
                  minWidth="150px"
                  onMouseEnter={() => setHoveredMenu(item.name)} // Mantém visível ao passar o mouse
                  onMouseLeave={() => setHoveredMenu(null)} // Esconde ao sair
                >
                  {item.submenu.map((sub) => (
                    <Box
                      key={sub}
                      p={2}
                      borderRadius="md"
                      cursor="pointer"
                      _hover={{ bg: "gray.600" }}
                      onClick={() => setActivePage({ main: item.name, sub })}
                    >
                      {sub}
                    </Box>
                  ))}
                </Box>
              )}
            </Box>
          );
        })}
      </VStack>
    </Box>
  );
}
