import {
  SimpleGrid,
  Card,
  CardFooter,
  Image,
  Text,
  Box,
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
} from "@chakra-ui/react";
import { FiMoreVertical } from "react-icons/fi";

const groups = [
  { id: 1, name: "test group", img: "/assets/dashboard/splash-art.svg" }
];

export default function GroupsGrid() {
  return (
    <SimpleGrid
      minChildWidth="250px"
      spacing={6}           
      p={6}
    >
      {groups.map((group) => (
        <Card
          w="22rem" 
          h="22rem" 
          key={group.id}
          border="none" 
          borderRadius="lg"
          overflow="hidden"
          shadow="sm"
          _hover={{ shadow: "md" }}
        >
          <Box
            w="22rem" 
            h="15rem" 
            overflow="hidden"
            position="relative"
          >
            <Image
              src={group.img}
              alt={group.name}
              w="100%"
              h="100%"
              objectFit="cover"
              position="absolute"
            />
          </Box>
          <CardFooter>
              <Text fontWeight="bold" align="start">{group.name}</Text>
          </CardFooter>
          <Box position="absolute" bottom="4" right="4">
            <Menu placement="top-end">
              <MenuButton
                as={IconButton}
                aria-label="Options"
                icon={<FiMoreVertical />}
                variant="ghost"
                size="sm"
              />
              <MenuList>
                <MenuItem>Otwórz</MenuItem>
                <MenuItem>Edytuj</MenuItem>
                <MenuItem>Usuń</MenuItem>
              </MenuList>
            </Menu>
          </Box>
        </Card>
      ))}
    </SimpleGrid>
  );
}