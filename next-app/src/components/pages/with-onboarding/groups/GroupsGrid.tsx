"use client";

import ResponsiveText from "@/components/common/texts/ResponsiveText";
import {
  Grid,
  Card,
  CardFooter,
  Image,
  Box,
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Skeleton,
} from "@chakra-ui/react";
import { FiMoreVertical } from "react-icons/fi";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { getJoinedGroupsInfo } from "@/services/groups/api";
import { useActionQuery } from "@/lib/tanstack-action/actions-querry";
import { GroupIdType } from "@/schemas/model/group/group-types";



type Props = {
  groups?: any[];
  isLoading?: boolean;
};

export default function GroupsGrid({ groups, isLoading }: Props) {
  const router = useRouter();

  const groupsToRender = groups ?? [];
  const itemsToShow = groupsToRender;

  const goToGroup = (id: GroupIdType) => {
    router.push(`/groups/${id}`);
  };

  return (
  <Grid templateColumns={{ base: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)', lg: 'repeat(4, 1fr)' }} gap={6} p={6}>
      {isLoading ? (
        [1, 2, 3, 4].map((i) => (
          <Card
            key={`skeleton-${i}`}
            w="100%"
            h="20rem"
            border="none"
            borderRadius="lg"
            overflow="hidden"
            shadow="sm"
          >
            <Box w="100%" h="13rem" overflow="hidden" position="relative">
              <Skeleton h="100%" />
            </Box>
            <CardFooter>
              <Skeleton height="20px" width="70%" />
            </CardFooter>
          </Card>
        ))
      ) : itemsToShow.length > 0 ? (
        itemsToShow.map((group: any, idx: number) => (
        <Card
          key={`${group.id}-${idx}`}
          w="100%"
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
          <Box w="100%" h="13rem" overflow="hidden" position="relative">
            <Image
              src={group.imageUrl ?? 'https://blocks.astratic.com/img/general-img-portrait.png'}
              w="100%"
              h="100%"
              objectFit="cover"
              alt={group.name ?? 'group image'}
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
        ))
      ) : (
        <Box p={6}>Brak grup do wyświetlenia.</Box>
      )}
    </Grid>
  );
}
