"use client";
import React from "react";
import { Box, VStack, Button, useDisclosure } from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import SidebarCard from "@/components/common/SidebarCard";
// import AddEventModal from "@/components/pages/with-onboarding/calendar/AddEventModal";
import { FiPlus } from "react-icons/fi"; // added

export default function Sidebar() {
  // lewy sidebar ma szerokość 16.5rem i minimalną wysokość calc(100vh - 6rem)
  const router = useRouter();
  const { isOpen, onOpen, onClose } = useDisclosure();

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
      {/* przycisk otwierający modal dodania wydarzenia */}
      <Box mb={4} width="100%">
        <Button
          w="100%"
          size="sm" // increased size
          color="white"
          bg="accent.500"
          _hover={{ bg: "accent.600" }}
          onClick={onOpen}
          rightIcon={<FiPlus size={30} />} // icon on the right and larger
        >
          Dodaj wydarzenie
        </Button>
      </Box>

      <VStack spacing={4} align="stretch" mb="6rem">
        {/* ...wstaw dowolną liczbę kart; poniżej przykładowe 2 */}
        <SidebarCard title="Letnia Stasikówka" />
        <SidebarCard title="Zimowy Zjazd" />
      </VStack>

      {/* przycisk 2rem od dołu przenoszący do upcoming-events/ */}
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

      {/* modal formularza dodawania wydarzenia */}
      {/* <AddEventModal isOpen={isOpen} onClose={onClose} /> */}
    </Box>
  );
}
