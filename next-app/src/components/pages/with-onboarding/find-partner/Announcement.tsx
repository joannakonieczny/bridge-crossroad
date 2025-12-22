"use client";

import React, { useState } from "react";
import {
  Tr,
  Td,
  Box,
  Avatar,
  Text,
  Link,
  HStack,
  Flex,
  IconButton,
  Button,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { FiChevronDown, FiEdit } from "react-icons/fi";
import { useQueryClient } from "@tanstack/react-query";
import { useActionMutation } from "@/lib/tanstack-action/actions-mutation";
import { QUERY_KEYS } from "@/lib/queries";
import { useTranslations } from "@/lib/typed-translations";
import { addInterested, removeInterested } from "@/services/find-partner/api";
import { BiddingSystem } from "@/club-preset/partnership-post";
import { getPersonLabel, getDateLabel } from "@/util/formatters";
import SelectInput from "@/components/common/form/SelectInput";
import { PartnershipPostType } from "@/club-preset/partnership-post";
import type { PartnershipPostSchemaTypePopulated } from "@/schemas/model/partnership-post/partnership-post-types";

type AnnouncementProps = {
  post: PartnershipPostSchemaTypePopulated;
  onEdit?: (post: PartnershipPostSchemaTypePopulated) => void;
};

export default function Announcement({ post, onEdit }: AnnouncementProps) {
  const { isOpen, onToggle } = useDisclosure();
  const [selectedInterestedUser, setSelectedInterestedUser] = useState<
    string | undefined
  >(undefined);
  const [interested, setInterested] = useState<boolean>(
    post.isUserInterested || false
  );

  const toast = useToast();
  const queryClient = useQueryClient();

  const t = useTranslations("pages.FindPartner.Announcement");
  const tBiddingSystem = useTranslations("common.biddingSystem");

  const addAction = useActionMutation({
    action: addInterested,
    onSuccess: () => {
      setInterested(true);
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.partnershipPosts({}),
      });
    },
  });

  const removeAction = useActionMutation({
    action: removeInterested,
    onSuccess: () => {
      setInterested(false);
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.partnershipPosts({}),
      });
    },
  });

  const handleToggleInterest = () => {
    const payload = {
      partnershipPostId: post.id,
      groupId: post.group.id,
    };

    const action = interested ? removeAction : addAction;
    const toastKey = interested ? "remove" : "add";
    toast.promise(action.mutateAsync(payload), {
      loading: { title: t(`toast.${toastKey}.loading`) },
      success: { title: t(`toast.${toastKey}.success`) },
      error: { title: t(`toast.${toastKey}.error`) },
    });
  };

  const biddingSystemOptions = Object.values(BiddingSystem).map((value) => ({
    value,
    label: tBiddingSystem(value),
  }));

  const hasInterestedUsers =
    post.interestedUsers && post.interestedUsers.length > 0;
  const selectPlaceholder = hasInterestedUsers
    ? t("ui.select.playWith")
    : t("ui.select.noInterested");

  return (
    <>
      <Tr
        _hover={{ ".vertical-bar": { bg: "accent.500" } }}
        borderBottomWidth={isOpen ? "0" : "1px"}
        borderBottomColor={isOpen ? "transparent" : "border.200"}
      >
        <Td py={2}>
          <Flex align="center">
            <Box
              className="vertical-bar"
              bg="accent.200"
              w="6px"
              mr={3}
              transition="background-color 150ms ease"
              alignSelf="stretch"
              display={{ base: "none", md: "block" }}
            />
            <HStack spacing={3} align={{ base: "center", md: "flex-start" }}>
              <Avatar
                size="sm"
                name={getPersonLabel(post.owner)}
                display={{ base: "none", md: "flex" }}
              />
              <Box>
                <Link
                  color="accent.500"
                  fontWeight="semibold"
                  href="#"
                  _hover={{ textDecoration: "underline" }}
                >
                  {post.name}
                </Link>
                <Text fontSize="sm" color="border.500">
                  {getDateLabel(
                    post.data.type === PartnershipPostType.PERIOD
                      ? post.data.duration.endsAt
                      : post.data.event.duration.startsAt
                  )}
                </Text>
              </Box>
            </HStack>
          </Flex>
        </Td>

        <Td py={2}>
          <Text fontWeight="medium">{getPersonLabel(post.owner)}</Text>
        </Td>

        <Td py={2} display={{ base: "none", md: "table-cell" }}>
          <Text>{t(`frequency.${post.data.type}`)}</Text>
        </Td>

        <Td py={2} display={{ base: "none", md: "table-cell" }}>
          <Text>
            {
              biddingSystemOptions.find((o) => o.value === post.biddingSystem)
                ?.label
            }
          </Text>
        </Td>

        <Td py={2} textAlign="right" w="48px">
          <IconButton
            aria-label={isOpen ? "Ukryj szczegóły" : "Pokaż szczegóły"}
            icon={
              <FiChevronDown
                style={{
                  transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
                  transition: "transform 150ms ease",
                }}
              />
            }
            size="sm"
            variant="ghost"
            onClick={onToggle}
          />
        </Td>
      </Tr>

      {isOpen && (
        <Tr>
          <Td colSpan={5} p={4} bg="bg">
            <Flex
              direction={{ base: "column", md: "row" }}
              align="center"
              justify="space-between"
              gap={4}
            >
              <Text flex="1" whiteSpace="pre-wrap">
                {post.description || t("ui.noDescription")}
              </Text>

              {!post.isOwnByUser && (
                <Button
                  colorScheme={interested ? "red" : "accent"}
                  onClick={handleToggleInterest}
                  isLoading={addAction.isPending || removeAction.isPending}
                  loadingText={
                    interested
                      ? t("ui.loading.unregistering")
                      : t("ui.loading.saving")
                  }
                  size="sm"
                >
                  {interested
                    ? t("ui.button.cancel")
                    : t("ui.button.interested")}
                </Button>
              )}
            </Flex>

            {post.isOwnByUser && (
              <Flex
                mt={4}
                direction={{ base: "column", md: "row" }}
                gap={2}
                align="center"
              >
                <SelectInput
                  placeholder={selectPlaceholder}
                  value={selectedInterestedUser}
                  onChange={(e) =>
                    setSelectedInterestedUser(e.target.value || undefined)
                  }
                  isDisabled={!hasInterestedUsers}
                  options={(post.interestedUsers || []).map((u) => ({
                    value: u.id,
                    label: getPersonLabel(u),
                  }))}
                />

                <HStack spacing={2}>
                  <Button size="sm" onClick={() => {}}>
                    {t("ui.button.save")}
                  </Button>
                  {onEdit && (
                    <IconButton
                      aria-label={"edit announcement"}
                      icon={<FiEdit />}
                      size="sm"
                      colorScheme="accent"
                      onClick={() => onEdit(post)}
                    />
                  )}
                </HStack>
              </Flex>
            )}
          </Td>
        </Tr>
      )}
    </>
  );
}
