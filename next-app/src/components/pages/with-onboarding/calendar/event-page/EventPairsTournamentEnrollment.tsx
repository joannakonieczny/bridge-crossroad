"use client";

import {
  Box,
  VStack,
  Button,
  Icon,
  useToast,
  HStack,
  Text,
  useDisclosure,
  Divider,
} from "@chakra-ui/react";
import { FaUserPlus, FaUserMinus } from "react-icons/fa";
import { useForm, Controller } from "react-hook-form";
import ResponsiveHeading from "@/components/common/texts/ResponsiveHeading";
import type {
  EventSchemaTypePopulated,
  TournamentPairsDataTypePopulated,
} from "@/schemas/model/event/event-types";
import { useActionMutation } from "@/lib/tanstack-action/actions-mutation";
import { useQueryClient } from "@tanstack/react-query";
import type { TKey } from "@/lib/typed-translations";
import {
  useTranslations,
  useTranslationsWithFallback,
} from "@/lib/typed-translations";
import type { MutationOrQuerryError } from "@/lib/tanstack-action/types";
import { getMessageKeyFromError } from "@/lib/tanstack-action/helpers";
import { useGroupQuery, useUserInfoQuery } from "@/lib/queries";
import { getPersonLabel } from "@/util/formatters";
import {
  enrollToEventTournament,
  unenrollFromEventTournament,
} from "@/services/events/api";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { withEmptyToUndefined } from "@/schemas/common";
import SelectInput from "@/components/common/form/SelectInput";
import { useMemo } from "react";
import { EventType } from "@/club-preset/event-type";
import ConfirmationModal from "@/components/common/ConfirmationModal";
import { FiAlertCircle, FiHelpCircle, FiInfo } from "react-icons/fi";

type EventPairsTournamentEnrollmentProps = {
  event: EventSchemaTypePopulated;
};

const formSchema = z.object({
  partnerId: z
    .string({
      message:
        "validation.model.event.data.type.pair.partnerId.required" satisfies TKey,
    })
    .nonempty(
      "validation.model.event.data.type.pair.partnerId.required" satisfies TKey
    ),
});

type FormSchemaType = z.infer<typeof formSchema>;

export default function EventPairsTournamentEnrollment({
  event,
}: EventPairsTournamentEnrollmentProps) {
  const t = useTranslations("pages.EventPage.EventPairsTournamentEnrollment");
  const tValidation = useTranslationsWithFallback();

  const {
    handleSubmit: handleFormSubmit,
    control: formControl,
    reset,
  } = useForm({
    resolver: zodResolver(withEmptyToUndefined(formSchema)),
  });

  const querryClient = useQueryClient();
  const toast = useToast();

  const userInfoQ = useUserInfoQuery();
  const groupQ = useGroupQuery(event.group.id);

  const currentUserId = userInfoQ.data?.id;

  const { isUserEnrolled, userPartner } = useMemo(() => {
    if (!currentUserId || event.data.type !== EventType.TOURNAMENT_PAIRS)
      return { isUserEnrolled: false, userPartner: null };

    const pairs =
      (event.data as TournamentPairsDataTypePopulated).contestantsPairs ?? [];

    const userPair = pairs.find(
      (pair) =>
        pair.first.id === currentUserId || pair.second.id === currentUserId
    );

    if (!userPair) return { isUserEnrolled: false, userPartner: null };

    const partner =
      userPair.first.id === currentUserId ? userPair.second : userPair.first;

    return { isUserEnrolled: true, userPartner: partner };
  }, [currentUserId, event.data]);

  const availablePartners = useMemo(() => {
    if (!groupQ.data || !currentUserId) return [];
    if (event.data.type !== EventType.TOURNAMENT_PAIRS) return [];

    const members = groupQ.data.members;
    const pairs =
      (event.data as TournamentPairsDataTypePopulated).contestantsPairs ?? [];

    return members
      .filter((m) => {
        const isPaired = pairs.some(
          (pair) => pair.first.id === m.id || pair.second.id === m.id
        );
        return !isPaired;
      })
      .filter((m) => m.id !== currentUserId);
  }, [groupQ.data, currentUserId, event.data]);

  const isDisabled =
    !groupQ.data ||
    !availablePartners.length ||
    !userInfoQ.data ||
    isUserEnrolled;

  const { isOpen, onOpen, onClose } = useDisclosure();

  const enrollMutation = useActionMutation({
    action: enrollToEventTournament,
    onSuccess: () => {
      querryClient.invalidateQueries({
        queryKey: ["event"],
      });
      reset();
    },
  });

  const unenrollMutation = useActionMutation({
    action: unenrollFromEventTournament,
    onSuccess: () => {
      querryClient.invalidateQueries({
        queryKey: ["event"],
      });
    },
  });

  function handleEnroll(data: FormSchemaType) {
    const promise = enrollMutation.mutateAsync({
      eventId: event.id,
      groupId: event.group.id,
      pair: {
        first: currentUserId || "",
        second: data.partnerId,
      },
    });

    toast.promise(promise, {
      loading: { title: t("toast.loading") },
      success: { title: t("toast.success") },
      error: (err: MutationOrQuerryError<typeof enrollToEventTournament>) => {
        const errKey = getMessageKeyFromError(err, {
          generalErrorKey:
            "pages.EventPage.EventPairsTournamentEnrollment.toast.errorDefault",
        });
        return { title: tValidation(errKey) };
      },
    });
  }

  function handleUnenroll() {
    const promise = unenrollMutation.mutateAsync({
      eventId: event.id,
      groupId: event.group.id,
    });

    toast.promise(promise, {
      loading: { title: t("unenrollToast.loading") },
      success: { title: t("unenrollToast.success") },
      error: (
        err: MutationOrQuerryError<typeof unenrollFromEventTournament>
      ) => {
        const errKey = getMessageKeyFromError(err, {
          generalErrorKey:
            "pages.EventPage.EventPairsTournamentEnrollment.unenrollToast.errorDefault",
        });
        return { title: tValidation(errKey) };
      },
    });
  }

  return (
    <>
      <ConfirmationModal
        isOpen={isOpen}
        onClose={onClose}
        onConfirm={handleUnenroll}
        title={t("confirmationModal.title")}
        body={
          <VStack align="start" spacing={3} pr="2em">
            <HStack spacing={4}>
              <Icon as={FiAlertCircle} color="red.400" fontSize={"xl"} />
              <Text fontSize={"sm"}>{t("confirmationModal.message.main")}</Text>
            </HStack>
            <Divider />
            <HStack spacing={4}>
              <Icon as={FiInfo} color="blue.400" fontSize={"xl"} />
              <Text fontSize={"sm"}>{t("confirmationModal.message.info")}</Text>
            </HStack>
            <Divider />
            <HStack spacing={4}>
              <Icon as={FiHelpCircle} color="yellow.500" fontSize={"xl"} />
              <Text fontSize={"sm"}>
                {t("confirmationModal.message.regret")}
              </Text>
            </HStack>
          </VStack>
        }
        confirmText={t("confirmationModal.confirm")}
        cancelText={t("confirmationModal.cancel")}
        isLoading={unenrollMutation.isPending}
      />

      <Box bg="bg" borderRadius="md" boxShadow="sm" p={4} w="100%">
        {isUserEnrolled ? (
          <VStack align="start" spacing={4}>
            <ResponsiveHeading
              text={t("heading")}
              fontSize="sm"
              barOrientation="horizontal"
            />

            <Box
              bg="green.50"
              color="green.700"
              p={3}
              borderRadius="md"
              w="100%"
              fontSize="sm"
            >
              <HStack spacing={2}>
                <Text fontWeight="medium">{t("alreadyEnrolled")}</Text>
                <Text fontWeight="bold">
                  {userPartner ? getPersonLabel(userPartner) : ""}
                </Text>
              </HStack>
            </Box>

            <Button
              leftIcon={<Icon as={FaUserMinus} />}
              colorScheme="red"
              variant="solid"
              w="100%"
              fontSize={{ base: "sm", md: "md" }}
              onClick={onOpen}
              isLoading={unenrollMutation.isPending}
            >
              {t("unenrollButton")}
            </Button>
          </VStack>
        ) : (
          <form onSubmit={handleFormSubmit(handleEnroll)}>
            <VStack align="start" spacing={4}>
              <ResponsiveHeading
                text={t("heading")}
                fontSize="sm"
                barOrientation="horizontal"
              />

              <Controller
                control={formControl}
                name="partnerId"
                render={({ field, fieldState: { error } }) => (
                  <SelectInput
                    emptyValueLabel={t("selectPartner.placeholder")}
                    isInvalid={!!error}
                    errorMessage={tValidation(error?.message)}
                    options={availablePartners.map((m) => ({
                      value: m.id,
                      label: getPersonLabel(m),
                    }))}
                    value={field.value}
                    onSelectProps={{
                      ...field,
                    }}
                    isDisabled={isDisabled}
                    isLoading={groupQ.isLoading || userInfoQ.isLoading}
                  />
                )}
              />

              <Button
                leftIcon={<Icon as={FaUserPlus} />}
                colorScheme="accent"
                variant="solid"
                w="100%"
                type="submit"
                fontSize={{ base: "sm", md: "md" }}
                isDisabled={isDisabled}
              >
                {t("button")}
              </Button>
            </VStack>
          </form>
        )}
      </Box>
    </>
  );
}
