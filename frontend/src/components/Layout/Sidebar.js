"use client";

import { useState } from "react";
import { Box, Text, VStack } from "@chakra-ui/react";
import { FiUsers, FiShoppingCart } from "react-icons/fi";
import { BiSolidDashboard } from "react-icons/bi";

const menuItems = [
  { name: "Dashboard", icon: <BiSolidDashboard /> },
  {
    name: "Usuários",
    icon: <FiUsers />,
    submenu: ["Lista", "Novo Usuário"],
  },
  { name: "Vendas", icon: <FiShoppingCart /> },
];

// Verifica se o usuário tem permissão para acessar um menu principal ou submenu
const hasPermission = (permissions, menu, submenu = null) => {
  // Se o usuário tem permissão para o menu principal, ele pode acessar qualquer submenu
  if (permissions.includes(menu)) return true;

  // Caso tenha permissão específica para um submenu
  if (submenu) {
    return permissions.includes(`${menu}.${submenu}`);
  }

  // Se o usuário tem permissão para qualquer submenu, o menu principal precisa ser exibido
  const hasAnySubmenuPermission = permissions.some((perm) =>
    perm.startsWith(`${menu}.`)
  );
  return hasAnySubmenuPermission;
};

export default function Sidebar({
  isOpen,
  toggle,
  setActivePage,
  permissions,
}) {
  const [hoveredMenu, setHoveredMenu] = useState(null);

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
          // Se o usuário não tiver permissão para o menu, ele não será exibido
          if (!hasPermission(permissions, item.name)) return null;

          return (
            <Box
              key={item.name}
              position="relative"
              onMouseEnter={() =>
                item.submenu?.length > 0 && setHoveredMenu(item.name)
              }
              onMouseLeave={() =>
                item.submenu?.length > 0 && setHoveredMenu(null)
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
                  !item.submenu?.length &&
                  setActivePage({ main: item.name, sub: "" })
                }
              >
                {item.icon}
                {isOpen && <Text ml={3}>{item.name}</Text>}
              </Box>

              {/* Submenu */}
              {item.submenu && hoveredMenu === item.name && (
                <Box
                  position="absolute"
                  left={isOpen ? "100%" : "60px"}
                  top="0"
                  bg="gray.700"
                  borderRadius="md"
                  p={2}
                  zIndex={10}
                  minWidth="150px"
                  onMouseEnter={() => setHoveredMenu(item.name)}
                  onMouseLeave={() => setHoveredMenu(null)}
                >
                  {item.submenu.map((sub) => {
                    if (!hasPermission(permissions, item.name, sub))
                      return null;
                    return (
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
                    );
                  })}
                </Box>
              )}
            </Box>
          );
        })}
      </VStack>
    </Box>
  );
}
