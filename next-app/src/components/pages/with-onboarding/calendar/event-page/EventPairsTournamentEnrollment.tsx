"use client";

import { Box, VStack, Button, Icon, useToast, Select } from "@chakra-ui/react";
import { FaUserPlus } from "react-icons/fa";
import { useState } from "react";
import ResponsiveHeading from "@/components/common/texts/ResponsiveHeading";
import type { EventSchemaTypePopulated } from "@/schemas/model/event/event-types";
import { useActionMutation } from "@/lib/tanstack-action/actions-mutation";
import { useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "@/lib/typed-translations";

type EventPairsTournamentEnrollmentProps = {
  event: EventSchemaTypePopulated;
};

export default function EventPairsTournamentEnrollment({
  event,
}: EventPairsTournamentEnrollmentProps) {
  const [selectedPartnerId, setSelectedPartnerId] = useState<string>("");

  const t = useTranslations("pages.EventPage.EventPairsTournamentEnrollment");

  const querryClient = useQueryClient();
  const toast = useToast();

  // TODO: Replace with actual tournament enrollment action
  const enrollMutation = useActionMutation({
    action: async () => {
      // Placeholder for tournament enrollment logic
      return Promise.resolve();
    },
    onSuccess: () => {
      querryClient.invalidateQueries({
        queryKey: ["event"],
      });
    },
  });

  const handleEnroll = () => {
    if (!selectedPartnerId) {
      toast({
        title: "Wybierz partnera",
        status: "warning",
      });
      return;
    }

    const promise = enrollMutation.mutateAsync({});
    toast.promise(promise, {
      loading: { title: t("toast.loading") },
      success: { title: t("toast.success") },
      error: { title: t("toast.errorDefault") },
    });
  };

  // TODO: Fetch available partners from group members
  const availablePartners = event.group.members || [];

  return (
    <Box bg="bg" borderRadius="md" boxShadow="sm" p={4} w="100%">
      <VStack align="start" spacing={4}>
        <ResponsiveHeading
          text={t("heading")}
          fontSize="sm"
          barOrientation="horizontal"
        />

        <Select
          placeholder={t("selectPartner.placeholder")}
          value={selectedPartnerId}
          onChange={(e) => setSelectedPartnerId(e.target.value)}
          bg="white"
        >
          {availablePartners.map((member) => (
            <option key={member.id} value={member.id}>
              {member.name.firstName} {member.name.lastName}
            </option>
          ))}
        </Select>

        <Button
          leftIcon={<Icon as={FaUserPlus} />}
          colorScheme="accent"
          variant="solid"
          w="100%"
          onClick={handleEnroll}
          fontSize={{ base: "sm", md: "md" }}
        >
          {t("button")}
        </Button>
      </VStack>
    </Box>
  );
}
