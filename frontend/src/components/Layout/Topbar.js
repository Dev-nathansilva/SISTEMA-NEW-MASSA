"use client";

import { Flex, Text } from "@chakra-ui/react";
import { FiBell } from "react-icons/fi";
import { PiSidebarLight } from "react-icons/pi";

export default function Topbar({ toggleSidebar, toggleRightPanel, pageTitle }) {
  return (
    <Flex
      bg="#F5F5F6"
      color="white"
      p={4}
      alignItems="center"
      justifyContent="space-between"
    >
      <Flex alignItems="center">
        <PiSidebarLight
          onClick={toggleSidebar}
          color="black"
          className=" icone-open-close"
        />
        <Text className="title-page">{pageTitle}</Text>
      </Flex>

      <FiBell onClick={toggleRightPanel} bg="transparent" color="black" />
    </Flex>
  );
}
