import ResponsiveText from "@/components/common/texts/ResponsiveText";
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
  { id: 1, name: "test group test grouptest grouptest grouptest grouptest grouptest grouptest grouptest group", img: "https://occ-0-8407-116.1.nflxso.net/dnm/api/v6/E8vDc_W8CLv7-yMQu8KMEC7Rrr8/AAAABcoYPuBqXkTl88_2Bq9qiYs2iTcQhagYIIAPAEevDP93tXqCnbXslyTy0YpOlu9r64DFdeN4_kCeqpX1bMgCsXzcgqrxU37ClodX.jpg?r=ce7" },
  { id: 2, name: "test group test grouptest grouptest grouptest grouptest grouptest grouptest grouptest group", img: "https://occ-0-8407-116.1.nflxso.net/dnm/api/v6/E8vDc_W8CLv7-yMQu8KMEC7Rrr8/AAAABcoYPuBqXkTl88_2Bq9qiYs2iTcQhagYIIAPAEevDP93tXqCnbXslyTy0YpOlu9r64DFdeN4_kCeqpX1bMgCsXzcgqrxU37ClodX.jpg?r=ce7" },
  { id: 3, name: "test group test grouptest grouptest grouptest grouptest grouptest grouptest grouptest group", img: "https://occ-0-8407-116.1.nflxso.net/dnm/api/v6/E8vDc_W8CLv7-yMQu8KMEC7Rrr8/AAAABcoYPuBqXkTl88_2Bq9qiYs2iTcQhagYIIAPAEevDP93tXqCnbXslyTy0YpOlu9r64DFdeN4_kCeqpX1bMgCsXzcgqrxU37ClodX.jpg?r=ce7" },
  { id: 4, name: "test group test grouptest grouptest grouptest grouptest grouptest grouptest grouptest group", img: "https://occ-0-8407-116.1.nflxso.net/dnm/api/v6/E8vDc_W8CLv7-yMQu8KMEC7Rrr8/AAAABcoYPuBqXkTl88_2Bq9qiYs2iTcQhagYIIAPAEevDP93tXqCnbXslyTy0YpOlu9r64DFdeN4_kCeqpX1bMgCsXzcgqrxU37ClodX.jpg?r=ce7" },
  { id: 5, name: "test group test grouptest grouptest grouptest grouptest grouptest grouptest grouptest group", img: "https://occ-0-8407-116.1.nflxso.net/dnm/api/v6/E8vDc_W8CLv7-yMQu8KMEC7Rrr8/AAAABcoYPuBqXkTl88_2Bq9qiYs2iTcQhagYIIAPAEevDP93tXqCnbXslyTy0YpOlu9r64DFdeN4_kCeqpX1bMgCsXzcgqrxU37ClodX.jpg?r=ce7" },
  { id: 6, name: "test group test grouptest grouptest grouptest grouptest grouptest grouptest grouptest group", img: "https://occ-0-8407-116.1.nflxso.net/dnm/api/v6/E8vDc_W8CLv7-yMQu8KMEC7Rrr8/AAAABcoYPuBqXkTl88_2Bq9qiYs2iTcQhagYIIAPAEevDP93tXqCnbXslyTy0YpOlu9r64DFdeN4_kCeqpX1bMgCsXzcgqrxU37ClodX.jpg?r=ce7" }
];

export default function GroupsGrid() {
  return (
    <SimpleGrid minChildWidth="21rem" spacing={3} p={2} marginTop="1rem">
      {groups.map((group) => (
        <Card
          w="20rem" 
          h="20rem" 
          key={group.id}
          border="none" 
          borderRadius="lg"
          overflow="hidden"
          shadow="sm"
          _hover={{ shadow: "md" }}
          marginBottom="1rem"
        >
          <Box
            w="20rem" 
            h="13rem" 
            overflow="hidden"
            position="relative"
          >
            <Image
              src={group.img}
              h="100%"
              objectFit="cover"
              position="absolute"
            />
          </Box>
          <CardFooter>
            <ResponsiveText fontWeight="bold" align="start" fontSize="lg" noOfLines={2}>{group.name}</ResponsiveText>
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