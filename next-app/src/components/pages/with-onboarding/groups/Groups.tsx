import { Box, Flex, HStack, Button, Input } from "@chakra-ui/react";
import { BiLogIn } from "react-icons/bi";
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
    >
      <Box flex="1" width="100%">
        <Flex
          direction="row"      
          justify="space-between" 
          align="center"
          width="100%"
          backgroundColor="white"
          padding="0.5rem"
        >
          <Flex>
            <Input placeholder="Wpisz kod grupy" borderRadius={"0.25rem 0 0 0.25rem"}/>
            <Button rightIcon={<FaArrowAltCircleRight size={"1.5rem"} />} colorScheme="accent" borderRadius={"0 0.25rem 0.25rem 0"}>
              Dołącz
            </Button>
          </Flex>
          <Button rightIcon={<FaPlus size="1.5rem" />} colorScheme="accent">
            Stwórz grupę
          </Button>
        </Flex>
        <GroupsGrid/>
      </Box>
    </Flex>
  );
}