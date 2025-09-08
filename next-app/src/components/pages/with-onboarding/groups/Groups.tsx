import { Box, Flex, Stack, Button, Input } from "@chakra-ui/react";
import { FaArrowAltCircleRight, FaPlus } from "react-icons/fa";
import GroupsGrid from "./GroupsGrid";

export default function Groups() {
  return (
    <Flex
      minHeight="100vh"
      width="100%"
      py={{ base: "2rem" }}
      px={{ base: "2rem" }}
      gap={{ base: "2rem" }}
      backgroundColor="border.50"
      direction="column"
    >
      <Box flex="1" width="100%">
        {/* Górny pasek */}
        <Stack
          direction={{ base: "column", md: "row" }}
          spacing={4}
          justify={{ base: "stretch", md: "space-between" }}
          align={{ base: "stretch", md: "center" }}
          width="100%"
          backgroundColor="white"
          padding="0.5rem"
          mb={4}
        >
          {/* Input + Dołącz */}
          <Flex
            direction={{ base: "column", md: "row" }}
            gap={{ base: 2, md: 0 }}
            width={{ base: "100%", md: "auto" }}
          >
            <Input
              placeholder="Wpisz kod grupy"
              borderRadius={{ base: "0.25rem", md: "0.25rem 0 0 0.25rem" }}
              w={{ base: "100%", md: "20rem" }}
            />
            <Button
              rightIcon={<FaArrowAltCircleRight size="1.5rem" />}
              colorScheme="accent"
              borderRadius={{ base: "0.25rem", md: "0 0.25rem 0.25rem 0" }}
              w={{ base: "100%", md: "auto" }}
            >
              Dołącz
            </Button>
          </Flex>

          {/* Stwórz grupę */}
          <Button
            rightIcon={<FaPlus size="1.5rem" />}
            colorScheme="accent"
            variant="outline"
            w={{ base: "100%", md: "auto" }}
          >
            Stwórz grupę
          </Button>
        </Stack>

        {/* Grid z grupami */}
        <GroupsGrid />
      </Box>
    </Flex>
  );
}
