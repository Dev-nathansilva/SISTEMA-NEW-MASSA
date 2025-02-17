"use client";

import { Flex, Text } from "@chakra-ui/react";
import { FiBell } from "react-icons/fi";
import { IoMenu } from "react-icons/io5";

export default function Topbar({ toggleSidebar, toggleRightPanel, pageTitle }) {
  return (
    <Flex
      bg="gray.900"
      color="white"
      p={4}
      alignItems="center"
      justifyContent="space-between"
    >
      <Flex alignItems="center">
        <IoMenu onClick={toggleSidebar} bg="transparent" color="white" />
        <Text fontSize="lg" ml={4}>
          {pageTitle}
        </Text>
      </Flex>

      <FiBell onClick={toggleRightPanel} bg="transparent" color="white" />
    </Flex>
  );
}
