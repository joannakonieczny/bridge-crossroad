"use client";
import React from "react";
import { Box, VStack, Button, useDisclosure } from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import SidebarCard from "@/components/common/SidebarCard";
import { FiPlus } from "react-icons/fi";

export default function Sidebar() {
  const router = useRouter();
  const { onOpen } = useDisclosure();

  return (
    <Box
      w="16.5rem"
      minH="calc(100vh - 5rem)"
      bg="bg"
      flex="0 0 16.5rem"
      p={4}
      overflowY="auto"
      position="relative"
    >
      <Box mb={4} width="100%">
        <Button
          w="100%"
          size="sm" 
          color="white"
          bg="accent.500"
          _hover={{ bg: "accent.600" }}
          onClick={onOpen}
          rightIcon={<FiPlus size={30} />}
        >
          Dodaj wydarzenie
        </Button>
      </Box>

      <VStack spacing={4} align="stretch" mb="6rem">
        <SidebarCard title="Letnia Stasikówka" />
        <SidebarCard title="Zimowy Zjazd" />
      </VStack>

      <Box position="absolute" bottom="2rem" left={4} right={8}>
        <Button
          w="100%"
          size="sm"
          color="white"
          bg="accent.500"
          _hover={{ bg: "accent.600" }}
          onClick={() => router.push("/upcoming-events/")}
        >
          Zobacz więcej
        </Button>
      </Box>
    </Box>
  );
}
