import React, { useState } from "react";
import { Tr, Td, Box, Avatar, Text, Link, HStack, Flex, IconButton, Button, Select } from "@chakra-ui/react";
import { FiChevronDown } from "react-icons/fi";
import { addInterested, removeInterested } from "@/services/find-partner/api";
import { useActionMutation } from "@/lib/tanstack-action/actions-mutation";
import { useQueryClient } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/lib/queries";
import { useToast } from "@chakra-ui/react";
import { useTranslations } from "@/lib/typed-translations";
import { BiddingSystem } from "@/club-preset/partnership-post";
import type { UserTypeBasic } from "@/schemas/model/user/user-types";
import { getPersonLabel, getDateLabel } from "@/util/formatters";

type Announcement = {
  id: number | string;
  title: string;
  date?: Date; 
  owner?: UserTypeBasic;
  characteristics?: string[]; 
  frequency: string;
  preferredSystem: string;
  isOwnByUser: boolean;
  description?: string;
  interestedUsers?: Array<UserTypeBasic>;
  isUserInterested?: boolean;
  isInterested?: boolean;
  groupId?: string;
};

export default function Annoucment({ a }: { a: Announcement }) {
  const [open, setOpen] = useState(false);
  const [selectedInterestedUser, setSelectedInterestedUser] = useState<string | undefined>(
    undefined
  );
  const [interested, setInterested] = useState<boolean>(
    a.isInterested ?? false
  );
  const [pending, setPending] = useState(false);
  
  const toast = useToast();
  const queryClient = useQueryClient();
  const t = useTranslations("pages.FindPartner.Announcement");

  const addAction = useActionMutation({
    action: addInterested,
    onSuccess: () => {
      setInterested(true);
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.partnershipPosts });
      toast({ status: "success", title: t("toast.add.success") });
    },
    onError: () => {
      toast({ status: "error", title: t("toast.add.error") });
    },
  });

  const removeAction = useActionMutation({
    action: removeInterested,
    onSuccess: () => {
      setInterested(false);
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.partnershipPosts });
      toast({ status: "success", title: t("toast.remove.success") });
    },
    onError: () => {
      toast({ status: "error", title: t("toast.remove.error") });
    },
  });

  const handleToggleInterest = async () => {
    if (pending) return;
    setPending(true);
    const payload = { partnershipPostId: String(a.id), groupId: String(a.groupId ?? "") };
    try {
      if (!interested) {
        await addAction.mutateAsync(payload);
      } else {
        await removeAction.mutateAsync(payload);
      }
    } catch {
    } finally {
      setPending(false);
    }
  };
  
  const ariaLabel = open ? "Hide details" : "Show details";
  const freqKey =
    a.frequency === "SINGLE" ? "SINGLE" :
    a.frequency === "PERIOD" ? "PERIOD" :
    null;
  const frequencyLabel = freqKey ? t(`frequency.${freqKey}`) : a.frequency;

  const biddingSystemLabels: Record<BiddingSystem, string> = {
    [BiddingSystem.ZONE]: t("system.ZONE"),
    [BiddingSystem.COMMON_LANGUAGE]: t("system.COMMON_LANGUAGE"),
    [BiddingSystem.DOUBLETON]: t("system.DOUBLETON"),
    [BiddingSystem.SAYC]: t("system.SAYC"),
    [BiddingSystem.BETTER_MINOR]: t("system.BETTER_MINOR"),
    [BiddingSystem.WEAK_OPENINGS_SSO]: t("system.WEAK_OPENINGS_SSO"),
    [BiddingSystem.TOTOLOTEK]: t("system.TOTOLOTEK"),
    [BiddingSystem.NATURAL]: t("system.NATURAL"),
    [BiddingSystem.OTHER]: t("system.OTHER"),
  };

  const systemLabel = biddingSystemLabels[a.preferredSystem as BiddingSystem] ?? a.preferredSystem;
  
  const noDescription = t("ui.noDescription");
  const interestButtonLabel = interested ? t("ui.button.cancel") : t("ui.button.interested");
  const interestButtonLoadingText = interested ? t("ui.loading.unregistering") : t("ui.loading.saving");
  const selectPlaceholder = (a.interestedUsers && a.interestedUsers.length) ? t("ui.select.playWith") : t("ui.select.noInterested");

  return (
    <>
      <Tr
        _hover={{ ".vertical-bar": { bg: "accent.500" } }}
        borderBottomWidth={open ? "0" : "1px"}
        borderBottomColor={open ? "transparent" : "border.200"}
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
                name={
                  a.owner && a.owner.name
                    ? `${a.owner.name.firstName} ${a.owner.name.lastName}`
                    : a.title
                }
                display={{ base: "none", md: "flex" }}
              />
              <Box>
                <Link color="accent.500" fontWeight="semibold" href="#" _hover={{ textDecoration: "underline" }}>
                  {a.title}
                </Link>
                <Text fontSize="sm" color="border.500">{getDateLabel(a.date)}</Text>
              </Box>
            </HStack>
          </Flex>
        </Td>

        <Td py={2}>
          <Box>
            <Text fontWeight="medium">{getPersonLabel(a.owner)}</Text>
          </Box>
        </Td>

        <Td py={2} display={{ base: "none", md: "table-cell" }}>
          <Text>{frequencyLabel}</Text>
        </Td>

        <Td py={2} display={{ base: "none", md: "table-cell" }}>
          <Text>{systemLabel}</Text>
        </Td>

        <Td py={2} textAlign="right" w="48px">
          <IconButton
            aria-label={ariaLabel}
            icon={
              <FiChevronDown
                style={{
                  transform: open ? "rotate(180deg)" : "rotate(0deg)",
                  transition: "transform 150ms ease",
                }}
              />
            }
            size="sm"
            variant="ghost"
            onClick={() => setOpen(!open)}
          />
        </Td>
      </Tr>

      {open && (
        <Tr>
          <Td colSpan={5} p={4} bg="bg">
            <Flex direction={{ base: "column", md: "row" }} align="center" justify="space-between" gap={4}>
              <Box flex="1">
                <Text whiteSpace="pre-wrap">{a.description ?? noDescription}</Text>
              </Box>

              <Box>
                {a.isOwnByUser && <Button
                  colorScheme={interested ? "red" : "accent"}
                  onClick={handleToggleInterest}
                  isLoading={pending}
                  loadingText={interestButtonLoadingText}
                  size="sm"
                >
                  {interestButtonLabel}
                </Button>}
              </Box>
            </Flex>
            
            {!a.isOwnByUser && <Box mt={4}>
              <Flex direction={{ base: "column", md: "row" }} gap={2} align="center">
                <Select
                  flex={1}
                  placeholder={selectPlaceholder}
                  value={selectedInterestedUser}
                  onChange={(e) => setSelectedInterestedUser(e.target.value || undefined)}
                  isDisabled={!a.interestedUsers || a.interestedUsers.length === 0}
                  size="sm"
                >
                  {(a.interestedUsers || []).map((u: UserTypeBasic) => {
                    const id = (u && (u.id ?? u)) as string;
                    const label = getPersonLabel(u);
                    return (
                      <option key={String(id)} value={String(id)}>
                        {label || String(id)}
                      </option>
                    );
                  })}
                </Select>

                <Button size="sm" onClick={() => {}}>
                  {t("ui.button.save")}
                </Button>
              </Flex>
            </Box>}
          </Td>
        </Tr>
      )}
    </>
  );
}
