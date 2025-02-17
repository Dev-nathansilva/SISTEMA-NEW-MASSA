"use client";

import { useState } from "react";
import { Box, IconButton, VStack, Text } from "@chakra-ui/react";
import { FiMenu, FiSettings, FiUsers } from "react-icons/fi";
import { BiSolidDashboard } from "react-icons/bi";

export default function Sidebar({ isOpen, toggle, setActivePage }) {
  const [hoveredMenu, setHoveredMenu] = useState(null);

  // Itens do menu
  const menuItems = [
    { name: "Dashboard", icon: <BiSolidDashboard />, hasSubmenu: false },
    {
      name: "Usuários",
      icon: <FiUsers />,
      hasSubmenu: true,
      submenu: ["Lista", "Novo Usuário"],
    },
  ];

  return (
    <Box
      width={isOpen ? "250px" : "65px"}
      transition="width 0.3s"
      bg="gray.800"
      color="white"
      height="100vh"
      p={4}
      position="relative"
    >
      {/* Botão de Toggle */}
      <IconButton
        icon={<FiMenu />}
        onClick={toggle}
        bg="transparent"
        color="white"
        mb={4}
      />

      {/* Menu de Itens */}
      <VStack spacing={4} align="stretch">
        {menuItems.map((item) => (
          <Box key={item.name} position="relative">
            {/* Item principal do menu */}
            <Box
              display="flex"
              alignItems="center"
              p={2}
              borderRadius="md"
              cursor="pointer"
              bg={hoveredMenu === item.name ? "gray.700" : "transparent"}
              _hover={{ bg: "gray.700" }}
              onClick={() => {
                if (!item.hasSubmenu) {
                  setActivePage({ main: item.name, sub: "" });
                }
              }}
              onMouseEnter={() => item.hasSubmenu && setHoveredMenu(item.name)}
              onMouseLeave={() => item.hasSubmenu && setHoveredMenu(null)}
            >
              {item.icon}
              {isOpen && <Text ml={3}>{item.name}</Text>}
            </Box>

            {/* Submenu */}
            {item.hasSubmenu && hoveredMenu === item.name && (
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
        ))}
      </VStack>
    </Box>
  );
}
