"use client";

import {
  Box,
  Flex,
  Stack,
  Button,
  Input,
  useToast,
  useDisclosure,
} from "@chakra-ui/react";
import { FaArrowAltCircleRight, FaPlus } from "react-icons/fa";
import GroupsGrid from "./GroupsGrid";
import { AddGroupModal } from "./AddGroupModal";
import { useState } from "react";
import { useActionMutation } from "@/lib/tanstack-action/actions-mutation";
import { addUserToGroupByInvitationCode } from "@/services/groups/api";
import { getMessageKeyFromError } from "@/lib/tanstack-action/helpers";
import { useTranslationsWithFallback } from "@/lib/typed-translations";
import { useQueryClient } from "@tanstack/react-query";
import { useJoinedGroupsQuery } from "@/lib/queries";
import type { ActionError } from "@/lib/tanstack-action/types";
import type { InvitationCodeType } from "@/schemas/model/group/group-types";

export default function Groups() {
  const [invitationCode, setInvitationCode] = useState(""); // TODO: use form
  const modalControl = useDisclosure();
  const toast = useToast();
  const tValidation = useTranslationsWithFallback();
  const t = useTranslationsWithFallback("pages.GroupsPage.Groups");

  const queryClient = useQueryClient();

  const groupsQ = useJoinedGroupsQuery();

  const joinMutation = useActionMutation({
    action: (data: { invitationCode: InvitationCodeType }) =>
      addUserToGroupByInvitationCode(data),
  });

  function onSubmit() {
    const promise = joinMutation.mutateAsync({ invitationCode }).then(() => {
      queryClient.invalidateQueries({ queryKey: ["groups"] });
      setInvitationCode("");
    });
    toast.promise(promise, {
      loading: { title: t("toast.loading") },
      success: { title: t("toast.success") },
      error: (err: ActionError) => {
        const errKey = getMessageKeyFromError(err);
        return { title: tValidation(errKey) };
      },
    });
  }

  return (
    <>
      {/* Modal grupy */}
      <AddGroupModal
        isOpen={modalControl.isOpen}
        onClose={modalControl.onClose}
      />
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
            backgroundColor="bg"
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
                disabled={joinMutation.isPending}
                onClick={onSubmit}
              >
                {t("joinButton")}
              </Button>
            </Flex>

            {/* Stwórz grupę */}
            <Button
              rightIcon={<FaPlus size="1.5rem" />}
              colorScheme="accent"
              variant="outline"
              w={{ base: "100%", md: "auto" }}
              onClick={modalControl.onOpen}
            >
              {t("createButton")}
            </Button>
          </Stack>

          {/* Grid z grupami */}
          <GroupsGrid
            groups={groupsQ.data ?? []}
            isLoading={groupsQ.isLoading}
          />
        </Box>
      </Box>
    </>
  );
}
