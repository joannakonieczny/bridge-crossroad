import { Box, Flex, HStack, Button, Input } from "@chakra-ui/react";
import { BiLogIn } from "react-icons/bi";
import { FaPlus } from "react-icons/fa";
import GroupsGrid from "./GroupsGrid";

export default function Groups() {
  return (
    <Flex
      minHeight="100vh"
      width="100%"
      py={{ base: "2rem", md: "3rem" }}
      px={{ base: "1rem", md: "4rem", lg: "6rem", xl: "10rem" }}
      gap={{ base: "2rem", lg: "4rem" }}
    >
      <Box flex="1" width="100%">
        <Flex
          direction="row"      
          justify="space-between" 
          align="center"
          width="100%"
        >
          <HStack>
            <Input placeholder="Wpisz kod grupy" />
            <Button rightIcon={<BiLogIn />} colorScheme="accent">
              Dołącz
            </Button>
          </HStack>
          <Button rightIcon={<FaPlus />} colorScheme="accent">
            Stwórz grupę
          </Button>
        </Flex>
        <GroupsGrid/>
      </Box>
    </Flex>
  );
}