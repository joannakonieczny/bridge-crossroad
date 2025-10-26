"use client";
import React from "react";
import { Box, VStack, Button, useDisclosure, useBreakpointValue } from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import SidebarCard from "@/components/common/SidebarCard";
import { FiPlus } from "react-icons/fi";
import { useTranslations } from "@/lib/typed-translations";

export default function Sidebar() {
  const router = useRouter();
  const { onOpen } = useDisclosure();
  const isVisible = useBreakpointValue({ base: false, md: true }) ?? false;

  const t = useTranslations("pages.CalendarPage.Sidebar");
  if (!isVisible) return null;
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
      <Box mb={4} width="100%" pr={2}>
        <Button
          w="100%"
          size="sm" 
          color="white"
          bg="accent.500"
          _hover={{ bg: "accent.600" }}
          onClick={onOpen}
          rightIcon={<FiPlus size={30} />}
        >
          {t("addEvent")}
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
          onClick={() => router.push("calendar/upcoming-events/")}
        >
          {t("seeMore")}
        </Button>
      </Box>
    </Box>
  );
}
