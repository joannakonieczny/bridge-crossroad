"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, FormProvider } from "react-hook-form";
import { addEventSchema } from "@/schemas/pages/with-onboarding/events/events-schema";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  FormLabel,
  Box,
  Step,
  StepIcon,
  StepIndicator,
  StepNumber,
  StepSeparator,
  StepStatus,
  Stepper,
  useSteps,
  useToast,
} from "@chakra-ui/react";
import { Divider } from "@chakra-ui/react";
import { PrimaryInfoStep } from "./step/PrimaryInfoStep";
import { DetailedInfoStep } from "./step/DetailedInfoStep/DetailedInfoStep";
import { SummaryStep } from "./step/SummaryStep";
import { useActionMutation } from "@/lib/tanstack-action/actions-mutation";
import { createEvent } from "@/services/events/api";
import type {
  ActionInput,
  MutationOrQuerryError,
} from "@/lib/tanstack-action/types";
import { getMessageKeyFromError } from "@/lib/tanstack-action/helpers";
import {
  useTranslations,
  useTranslationsWithFallback,
} from "@/lib/typed-translations";
import { useQueryClient } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/lib/queries";
import { EventType } from "@/club-preset/event-type";
import { withEmptyToUndefined } from "@/schemas/common";

type EventFormProps = {
  isOpen: boolean;
  onClose: () => void;
};

export default function EventForm({ isOpen, onClose }: EventFormProps) {
  const form = useForm({
    mode: "onChange",
    reValidateMode: "onChange",
    resolver: zodResolver(withEmptyToUndefined(addEventSchema)),
    defaultValues: {
      title: "",
      description: "",
      location: "",
      group: "",
      organizer: "",
      duration: {
        startsAt: new Date(),
        endsAt: new Date(),
      },
      additionalDescription: "",
      imageUrl: undefined, //TODO add image upload in future
      data: {
        type: EventType.OTHER,
      },
    },
  });
  const toast = useToast();
  const t = useTranslations("pages.EventFormPage");
  const tValidation = useTranslationsWithFallback();
  const queryClient = useQueryClient();

  const { activeStep, setActiveStep } = useSteps({
    index: 0,
    count: 3,
  });

  const steps = [
    {
      title: t("steps.primary"),
      content: <PrimaryInfoStep setNextStep={() => setActiveStep(1)} />,
    },
    {
      title: t("steps.detailed"),
      content: (
        <DetailedInfoStep
          setNextStep={() => setActiveStep(2)}
          setPrevStep={() => setActiveStep(0)}
        />
      ),
    },
    {
      title: t("steps.summary"),
      content: <SummaryStep setPrevStep={() => setActiveStep(1)} />,
    },
  ];

  const createEventAction = useActionMutation({
    action: createEvent,
    onSuccess: (d) => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.calendarEvents(
          d.duration.startsAt,
          d.duration.endsAt
        ),
      });
      form.reset();
      setActiveStep(0);
      onClose();
    },
  });

  function handleWithToast(data: ActionInput<typeof createEvent>) {
    const promise = createEventAction.mutateAsync(data);
    toast.promise(promise, {
      loading: { title: t("toast.loading") },
      success: { title: t("toast.success") },
      error: (err: MutationOrQuerryError<typeof createEvent>) => {
        const errKey = getMessageKeyFromError(err, {
          fallbackKey: "pages.EventFormPage.toast.errorDefault",
        });
        return { title: tValidation(errKey) };
      },
    });
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Dodaj wydarzenie</ModalHeader>
        <ModalCloseButton />
        <Divider />
        <ModalBody>
          <FormProvider {...form}>
            <form
              onSubmit={form.handleSubmit((d) =>
                handleWithToast({ ...d, groupId: d.group })
              )}
            >
              <FormLabel htmlFor="title">{steps[activeStep].title}</FormLabel>
              <Box position="relative">
                <Stepper size="lg" index={activeStep} colorScheme="accent">
                  {steps.map((_, index) => (
                    <Step key={index}>
                      <StepIndicator>
                        <StepStatus
                          complete={<StepIcon />}
                          incomplete={<StepNumber />}
                          active={<StepNumber />}
                        />
                      </StepIndicator>
                      <StepSeparator />
                    </Step>
                  ))}
                </Stepper>
              </Box>
              <Box mt={8}>{steps[activeStep].content}</Box>
            </form>
          </FormProvider>
        </ModalBody>
        <ModalFooter></ModalFooter>
      </ModalContent>
    </Modal>
  );
}
