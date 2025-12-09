"use client";

import ResponsiveText from "@/components/common/texts/ResponsiveText";
import {
  Grid,
  Card,
  CardFooter,
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
import { useTranslations } from "@/lib/typed-translations";
import { ROUTES } from "@/routes";
import type { GroupBasicType } from "@/schemas/model/group/group-types";
import { GenericImage } from "@/components/common/GenericImage";
import LandscapePlaceholder from "@/assets/fallbacks/landscape-placeholder.svg";

type GroupsGridProps = {
  groups?: GroupBasicType[];
  isLoading?: boolean;
};

export default function GroupsGrid({
  groups = [],
  isLoading,
}: GroupsGridProps) {
  const router = useRouter();
  const t = useTranslations("pages.GroupsPage.GroupsGrid");

  return (
    <Grid
      templateColumns={{
        base: "repeat(1, 1fr)",
        sm: "repeat(2, 1fr)",
        md: "repeat(3, 1fr)",
        lg: "repeat(4, 1fr)",
      }}
      gap={6}
      p={6}
    >
      {isLoading ? (
        <GroupsGridLoader />
      ) : groups.length > 0 ? (
        groups.map((group, idx) => (
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
              if (!target.closest(".menu-button")) {
                router.push(ROUTES.groups.groupDetails(group.id));
              }
            }}
            position="relative"
          >
            <Box w="100%" h="13rem" overflow="hidden" position="relative">
              <GenericImage
                fallback={LandscapePlaceholder}
                imageProps={{
                  src: group.imageUrl,
                  w: "100%",
                  h: "100%",
                  objectFit: "cover",
                  alt: group.name ?? t("imageAlt"),
                }}
              />
            </Box>
            <CardFooter>
              <ResponsiveText
                fontWeight="bold"
                align="start"
                fontSize="lg"
                noOfLines={2}
              >
                {group.name}
              </ResponsiveText>
            </CardFooter>
            <Box
              position="absolute"
              bottom="4"
              right="4"
              className="menu-button"
            >
              <Menu placement="top-end">
                <MenuButton
                  as={IconButton}
                  aria-label="Opcje"
                  icon={<FiMoreVertical />}
                  variant="ghost"
                  size="sm"
                />
                <MenuList>
                  <MenuItem>{t("menu.open")}</MenuItem>
                  <MenuItem>{t("menu.edit")}</MenuItem>
                  <MenuItem>{t("menu.delete")}</MenuItem>
                </MenuList>
              </Menu>
            </Box>
          </Card>
        ))
      ) : (
        <Box p={6}>{t("noGroups")}</Box>
      )}
    </Grid>
  );
}

export function GroupsGridLoader({ count = 4 }: { count?: number }) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
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
      ))}
    </>
  );
}
