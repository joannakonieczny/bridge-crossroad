"use client";

import { Box, Flex, Stack, Button, Input, useToast } from "@chakra-ui/react";
import { FaArrowAltCircleRight, FaPlus } from "react-icons/fa";
import GroupsGrid from "./GroupsGrid";
import AddGroupModal from "./AddGroupModal";
import { useEffect, useState } from "react";
import { useActionQuery } from "@/lib/tanstack-action/actions-querry";
import { useActionMutation } from "@/lib/tanstack-action/actions-mutation";
import { getGroupData, getJoinedGroupsInfo, addUserToGroupByInvitationCode } from "@/services/groups/api";
import { getMessageKeyFromError } from "@/lib/tanstack-action/helpers";
import { useTranslationsWithFallback } from "@/lib/typed-translations";

export default function Groups() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [invitationCode, setInvitationCode] = useState("");
  const toast = useToast();
  const tValidation = useTranslationsWithFallback();

  const groupsQ = useActionQuery({
    queryKey: ["groups"],
    action: () => getJoinedGroupsInfo(),
    retry: false,
  });
  const joinMutation = useActionMutation({
    action: async (data: { invitationCode: string }) => {
      return await addUserToGroupByInvitationCode(data);
    },
    // keep handlers local to the submit flow to avoid re-triggering toasts on re-renders
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
          {/* Input + Dołącz */}
          <Flex
            direction={{ base: "column", md: "row" }}
            gap={{ base: 2, md: 0 }}
            width={{ base: "100%", md: "auto" }}
          >
            <Input
              placeholder="Wpisz kod grupy"
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
                  loading: { title: "Dołączanie..." },
                  success: { title: "Dołączono" },
                  error: (err: any) => {
                    const errKey = getMessageKeyFromError(err);
                    return { title: tValidation(errKey) };
                  },
                });
                try {
                  await promise;
                  try {
                    await groupsQ.refetch();
                  } catch (e) {
                    // ignore refetch errors
                  }
                  setInvitationCode("");
                } catch (e) {
                  // error toast already shown via toast.promise
                }
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
            Stwórz grupę
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
          } catch (e) {
            // ignore
          }
        }}
      />
      {/* debug removed */}
      {/* join result now shown via toasts */}
    </Box>
  );
}
