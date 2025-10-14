"use client";

import { Box, Flex, Stack, Button, Input, useToast } from "@chakra-ui/react";
import { FaArrowAltCircleRight, FaPlus } from "react-icons/fa";
import GroupsGrid from "./GroupsGrid";
import AddGroupModal from "./AddGroupModal";
import { useState } from "react";
import { useActionQuery } from "@/lib/tanstack-action/actions-querry";
import { useActionMutation } from "@/lib/tanstack-action/actions-mutation";
import { getJoinedGroupsInfo, addUserToGroupByInvitationCode } from "@/services/groups/api";
import { getMessageKeyFromError } from "@/lib/tanstack-action/helpers";
import { useTranslationsWithFallback } from "@/lib/typed-translations";
import type { ActionError } from "@/lib/tanstack-action/types";
import { useQueryClient } from "@tanstack/react-query";
import type { InvitationCodeType } from "@/schemas/model/group/group-types";
import { QUERY_KEYS } from "@/lib/query-keys";

export default function Groups() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [invitationCode, setInvitationCode] = useState("");
  const toast = useToast();
  const tValidation = useTranslationsWithFallback();
  const t = useTranslationsWithFallback("pages.GroupsPage.Groups");

  const queryClient = useQueryClient();

  const groupsQ = useActionQuery({
    queryKey: QUERY_KEYS.groups,
    action: () => getJoinedGroupsInfo(),
    retry: false,
  });
  
  const joinMutation = useActionMutation({
    action: async (data: { invitationCode: InvitationCodeType }) => {
      return await addUserToGroupByInvitationCode(data);
    },
  });
  

  return (
  <Box
    width="100%"
    py={{ base: "2rem" }}
    px={{ base: "2rem" }}
    gap={{ base: "2rem" }}
    display="flex"
    flexDirection="column"
    overflowY="visible"
    minHeight="calc(100vh - 5rem)"
    backgroundColor="border.50"
  >
  <Box width="100%">
        {/* Górny pasek */}
        <Stack
          direction={{ base: "column", md: "row" }}
          spacing={4}
          justify={{ base: "stretch", md: "space-between" }}
          align={{ base: "stretch", md: "center" }}
          width="100%"
          backgroundColor="white"
          padding="0.5rem"
          mb={4}
        >
          <Flex
            direction={{ base: "column", md: "row" }}
            gap={{ base: 2, md: 0 }}
            width={{ base: "100%", md: "auto" }}
          >
            <Input
              placeholder={t("input.invitationPlaceholder")}
              borderRadius={{ base: "0.25rem", md: "0.25rem 0 0 0.25rem" }}
              w={{ base: "100%", md: "20rem" }}
              value={invitationCode}
              onChange={(e) => setInvitationCode(e.target.value)}
            />
            <Button
              rightIcon={<FaArrowAltCircleRight size="1.5rem" />}
              colorScheme="accent"
              borderRadius={{ base: "0.25rem", md: "0 0.25rem 0.25rem 0" }}
              w={{ base: "100%", md: "auto" }}
              type="button"
              disabled={joinMutation.status === "pending"}
              onClick={async () => {
                const promise = joinMutation.mutateAsync({ invitationCode });
                toast.promise(promise, {
                  loading: { title: t("toast.loading") },
                  success: { title: t("toast.success") },
                  error: (err: ActionError) => {
                    const errKey = getMessageKeyFromError(err);
                    return { title: tValidation(errKey) };
                  },
                });
                promise.then(() => {
                  queryClient.invalidateQueries({ queryKey: ["groups"] });
                  setInvitationCode("");
                });
              }}
            >
              Dołącz
            </Button>
          </Flex>

          {/* Stwórz grupę */}
          <Button
            rightIcon={<FaPlus size="1.5rem" />}
            colorScheme="accent"
            variant="outline"
            w={{ base: "100%", md: "auto" }}
            onClick={() => setIsModalOpen(true)}
          >
            {t("createButton")}
           </Button>
        </Stack>

        {/* Grid z grupami */}
        <GroupsGrid groups={groupsQ.data} isLoading={groupsQ.isLoading} />
      </Box>

      {/* Modal grupy */}
      <AddGroupModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCreated={async () => {
          try {
            await groupsQ.refetch();
          } catch {
            // ignore
          }
        }}
      />
      {/* join result now shown via toasts */}
    </Box>
  );
}
