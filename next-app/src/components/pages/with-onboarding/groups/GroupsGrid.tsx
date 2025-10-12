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
import type { GroupIdType } from "@/schemas/model/group/group-types";
import { z } from "zod";
import { idPropSchema } from "@/schemas/common";
import {
  nameSchema,
  descriptionSchema,
  invitationCodeSchema,
  imageUrlSchema,
} from "@/schemas/model/group/group-schema";
import { useTranslationsWithFallback } from "@/lib/typed-translations";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const GroupSchema = z.object({
  id: idPropSchema,
  name: nameSchema,
  description: descriptionSchema.optional(),
  imageUrl: imageUrlSchema.optional(),
  invitationCode: invitationCodeSchema.optional(),
  isMain: z.boolean().optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
  members: z.array(z.any()).optional(),
  admins: z.array(z.any()).optional(),
});

type Group = z.infer<typeof GroupSchema>;

type Props = {
  groups?: Group[];
  isLoading?: boolean;
};

export default function GroupsGrid({ groups = [], isLoading }: Props) {
  const router = useRouter();
  const t = useTranslationsWithFallback("pages.GroupsPage.GroupsGrid");

  const goToGroup = (id: GroupIdType) => {
    router.push(`/groups/${id}`);
  };

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
                goToGroup(group.id);
              }
            }}
            position="relative"
          >
            <Box w="100%" h="13rem" overflow="hidden" position="relative">
              <Image
                src={
                  group.imageUrl ??
                  "https://blocks.astratic.com/img/general-img-portrait.png"
                }
                w="100%"
                h="100%"
                objectFit="cover"
                alt={group.name ?? t("imageAlt")}
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
                  aria-label={t("menu.ariaLabel")}
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
