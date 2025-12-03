import React, { useMemo, useState } from "react";
import { Tr, Td, Box, Avatar, Text, Link, HStack, Flex, IconButton, Button, useDisclosure } from "@chakra-ui/react";
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
import type { GroupIdType } from "@/schemas/model/group/group-types";
import SelectInput from "@/components/common/form/SelectInput";

type Announcement = {
  id: number | string;
  title: string;
  date?: Date; 
  owner?: UserTypeBasic;
  characteristics?: string[]; //for future use (user tags)
  frequency: string;
  preferredSystem: string;
  isOwnByUser: boolean;
  description?: string;
  interestedUsers?: Array<UserTypeBasic>;
  isUserInterested?: boolean;
  groupId?: GroupIdType;
};

export default function Annoucment({ a }: { a: Announcement }) {
  const { isOpen, onToggle } = useDisclosure();
  const [selectedInterestedUser, setSelectedInterestedUser] = useState<string | undefined>(
    undefined
  );
  const [interested, setInterested] = useState<boolean>(
    a.isUserInterested ?? false
  );
  
  const toast = useToast();
  const queryClient = useQueryClient();
  const t = useTranslations("pages.FindPartner.Announcement");
  // system translations (pl.ts -> system)
  const tSystem = useTranslations("common.biddingSystem");
  
  const addAction = useActionMutation({
    action: addInterested,
    onSuccess: () => {
      setInterested(true);
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.partnershipPosts() });
      // note: keep logic in onSuccess; toast now handled via toast.promise in handler
    },
    onError: () => {
      // onError kept for any side-effects; toast handled via toast.promise
    },
  });

  const removeAction = useActionMutation({
    action: removeInterested,
    onSuccess: () => {
      setInterested(false);
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.partnershipPosts() });
      // toast handled via toast.promise
    },
    onError: () => {
      // onError kept for any side-effects
    },
  });

  const handleToggleInterest = () => {
    const payload = { partnershipPostId: String(a.id), groupId: String(a.groupId ?? "") };
    const promise = !interested
      ? addAction.mutateAsync(payload)
      : removeAction.mutateAsync(payload);

    toast.promise(promise, {
      loading: { title: !interested ? t("toast.add.loading") : t("toast.remove.loading") },
      success: { title: !interested ? t("toast.add.success") : t("toast.remove.success") },
      error: { title: !interested ? t("toast.add.error") : t("toast.remove.error") },
    });
  };
  
  const ariaLabel = isOpen ? "Hide details" : "Show details";
  const freqKey =
    a.frequency === "SINGLE" ? "SINGLE" :
    a.frequency === "PERIOD" ? "PERIOD" :
    null;
  const frequencyLabel = freqKey ? t(`frequency.${freqKey}`) : a.frequency;

  const biddingSystemOptions = useMemo(
    () =>
      Object.values(BiddingSystem).map((value) => ({
        value,
        label: tSystem(value),
      })),
    [tSystem]
  );

  const systemLabel =
    biddingSystemOptions.find((o) => o.value === a.preferredSystem)?.label ??
    a.preferredSystem;
  
  const noDescription = t("ui.noDescription");
  const interestButtonLabel = interested ? t("ui.button.cancel") : t("ui.button.interested");
  const interestButtonLoadingText = interested ? t("ui.loading.unregistering") : t("ui.loading.saving");
  const selectPlaceholder = (a.interestedUsers && a.interestedUsers.length) ? t("ui.select.playWith") : t("ui.select.noInterested");

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
            <Flex direction={{ base: "column", md: "row" }} align="center" justify="space-between" gap={4}>
              <Box flex="1">
                <Text whiteSpace="pre-wrap">{a.description ?? noDescription}</Text>
              </Box>

              <Box>
                {!a.isOwnByUser && <Button
                  colorScheme={interested ? "red" : "accent"}
                  onClick={handleToggleInterest}
                  isLoading={addAction.isPending || removeAction.isPending}
                  loadingText={interestButtonLoadingText}
                  size="sm"
                >
                  {interestButtonLabel}
                </Button>}
              </Box>
            </Flex>
            
            {a.isOwnByUser && <Box mt={4}>
              <Flex direction={{ base: "column", md: "row" }} gap={2} align="center">
                <SelectInput
                  placeholder={selectPlaceholder}
                  value={selectedInterestedUser}
                  onChange={(e) => setSelectedInterestedUser(e.target.value || undefined)}
                  isDisabled={!a.interestedUsers || a.interestedUsers.length === 0}
                  options={(a.interestedUsers || []).map((u: UserTypeBasic) => {
                    const id = (u && (u.id ?? u)) as string;
                    return { value: String(id), label: getPersonLabel(u) || String(id) };
                  })}
                />

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
