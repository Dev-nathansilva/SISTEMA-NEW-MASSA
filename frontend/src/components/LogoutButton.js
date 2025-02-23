"use client";

import { Toaster, toaster } from "@/components/ui/toaster";
import { Box, Button, Flex, Text } from "@chakra-ui/react";
import { RiLogoutBoxRFill } from "react-icons/ri";

export default function LogoutButton({ isOpen }) {
  const handleLogout = async () => {
    try {
      const res = await fetch("/api/logout", { method: "POST" });

      if (res.ok) {
        toaster.create({
          description: "Logout realizado com sucesso!",
          type: "success",
          duration: 1300,
        });
        setTimeout(() => {
          window.location.href = "/login";
        }, 1000);
      } else {
        throw new Error("Erro ao fazer logout");
      }
    } catch (error) {
      console.error(error);
      toaster.create({
        title: "Erro ao fazer logout",
        type: "error",
      });
    }
  };

  return (
    <>
      <Button
        onClick={handleLogout}
        _hover={{ bg: "gray.300" }}
        className={`flex ${
          isOpen ? "justify-start" : "justify-center"
        } button-padrao-sidebar`}
      >
        <Flex align="center" gap={2}>
          <Box className="icon-sidebar">
            <RiLogoutBoxRFill size={20} color="red" />
          </Box>
          {isOpen && <Text>Sair</Text>}
        </Flex>
      </Button>
      <Toaster />
    </>
  );
}
