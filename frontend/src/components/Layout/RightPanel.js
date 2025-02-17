"use client";

import { Box, IconButton } from "@chakra-ui/react";
import { FiX } from "react-icons/fi";
import { FiXOctagon } from "react-icons/fi";

export default function RightPanel({ onClose }) {
  return (
    <Box
      width="250px"
      bg="gray.800"
      color="white"
      height="100vh"
      p={4}
      position="absolute"
      right="0"
    >
      <FiXOctagon onClick={onClose} bg="transparent" color="white" />

      <Box mt={4}>Notificações / Informações</Box>
    </Box>
  );
}
