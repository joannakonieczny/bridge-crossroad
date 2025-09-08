"use client";

import ResponsiveText from "@/components/common/texts/ResponsiveText";
import {
  SimpleGrid,
  Card,
  CardFooter,
  Image,
  Box,
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
} from "@chakra-ui/react";
import { FiMoreVertical } from "react-icons/fi";
import { useRouter } from "next/navigation";

const groups = [
  {
    id: 1,
    name: "test group test grouptest grouptest grouptest grouptest grouptest grouptest grouptest group",
    img: "https://occ-0-8407-116.1.nflxso.net/dnm/api/v6/E8vDc_W8CLv7-yMQu8KMEC7Rrr8/AAAABcoYPuBqXkTl88_2Bq9qiYs2iTcQhagYIIAPAEevDP93tXqCnbXslyTy0YpOlu9r64DFdeN4_kCeqpX1bMgCsXzcgqrxU37ClodX.jpg?r=ce7"
  },
  // dodaj resztę grup
];

export default function GroupsGrid() {
  const router = useRouter();

  const goToGroup = (id: number) => {
    router.push(`/groups/${id}`);
  };

  return (
    <SimpleGrid minChildWidth="200px" spacing={6} p={6}>
      {groups.map((group) => (
        <Card
          key={group.id}
          w="20rem"
          h="20rem"
          border="none"
          borderRadius="lg"
          overflow="hidden"
          shadow="sm"
          _hover={{ shadow: "md", cursor: "pointer" }}
          onClick={(e) => {
            const target = e.target as HTMLElement;
            if (!target.closest('.menu-button')) {
              goToGroup(group.id);
            }
          }}
          position="relative"
        >
          <Box w="20rem" h="13rem" overflow="hidden" position="relative">
            <Image
              src={group.img}
              h="100%"
              objectFit="cover"
              position="absolute"
              top={0}
              left={0}
            />
          </Box>
          <CardFooter>
            <ResponsiveText fontWeight="bold" align="start" fontSize="lg" noOfLines={2}>
              {group.name}
            </ResponsiveText>
          </CardFooter>
          <Box position="absolute" bottom="4" right="4" className="menu-button">
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
