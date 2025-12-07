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
  Stack,
} from "@chakra-ui/react";
import { Divider } from "@chakra-ui/react";
import { PrimaryInfoStep } from "./step/PrimaryInfoStep";
import { DetailedInfoStep } from "./step/DetailedInfoStep/DetailedInfoStep";
import { SummaryStep } from "./step/SummaryStep";
import { SteeringButtons } from "./components/SteeringButtons";
import {
  useValidatePrimaryInfoStep,
  useValidateDetailedInfoStep,
} from "./hooks";
import FileUploader from "@/components/common/form/FileUploader/FileUploader";
import { useImageUpload } from "@/components/common/form/FileUploader/useImageUpload";
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
import dayjs from "dayjs";

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
        endsAt: dayjs().add(1, "hour").toDate(),
      },
      additionalDescription: "",
      imageUrl: "",
      data: {
        type: EventType.OTHER,
      },
    },
  });
  const toast = useToast();
  const t = useTranslations("pages.EventFormPage");
  const tValidation = useTranslationsWithFallback();
  const queryClient = useQueryClient();

  const onCloseWithReset = () => {
    form.reset();
    resetImage();
    setActiveStep(0);
    onClose();
  };

  const {
    selectedImage,
    uploadImage,
    resetImage,
    handleImageChange,
    isUploading,
    isError: isUploadError,
  } = useImageUpload({
    text: {
      toast: {
        loading: { title: t("imageToast.loading") },
        success: { title: t("imageToast.success") },
        error: { title: t("imageToast.error") },
      },
    },
  });

  const { activeStep, setActiveStep } = useSteps({
    index: 0,
    count: 3,
  });

  const validatePrimaryInfoStep = useValidatePrimaryInfoStep(form);
  const validateDetailedInfoStep = useValidateDetailedInfoStep(form);

  const steps = [
    {
      title: t("steps.primary"),
      content: PrimaryInfoStep,
      validate: validatePrimaryInfoStep,
    },
    {
      title: t("steps.detailed"),
      content: DetailedInfoStep,
      validate: validateDetailedInfoStep,
    },
    {
      title: t("steps.summary"),
      content: SummaryStep,
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
      onCloseWithReset();
    },
  });

  async function handleWithToast(data: ActionInput<typeof createEvent>) {
    const uploadedPath = await uploadImage();

    // Check upload error
    if (selectedImage && !uploadedPath) return;

    const eventData = { ...data, imageUrl: uploadedPath, groupId: data.group };

    const promise = createEventAction.mutateAsync(eventData);
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

  const StepComponent = steps[activeStep].content;
  const isLastStep = activeStep === steps.length - 1;

  return (
    <Modal isOpen={isOpen} onClose={onCloseWithReset} size="xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{t("header")}</ModalHeader>
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
              <Stack my={8} spacing={6}>
                <StepComponent />
                <FileUploader
                  genericFileType="image"
                  onChange={handleImageChange}
                  isUploadError={isUploadError}
                  text={{
                    label: t("primaryInfoStep.image.label"),
                    additionalLabel: t("primaryInfoStep.image.additionalLabel"),
                    placeholder: t("primaryInfoStep.image.placeholder"),
                    errorUpload: t("primaryInfoStep.image.errorUpload"),
                  }}
                  onElementWrapperProps={
                    activeStep === 1 ? { h: 0, overflow: "hidden" } : {}
                  }
                />
              </Stack>
              <SteeringButtons
                prevButton={
                  activeStep > 0
                    ? {
                        text: t("buttons.prev"),
                        onClick: () => setActiveStep(activeStep - 1),
                      }
                    : undefined
                }
                nextButton={{
                  text: isLastStep ? t("buttons.submit") : t("buttons.next"),
                  onClick: !isLastStep
                    ? async () => {
                        const currentStepValidate = steps[activeStep].validate;
                        const isValid = currentStepValidate
                          ? await currentStepValidate()
                          : true;

                        if (isValid) {
                          setActiveStep(activeStep + 1);
                        }
                      }
                    : async () => {
                        form.handleSubmit((d) =>
                          handleWithToast({ ...d, groupId: d.group })
                        )();
                      },
                  onElementProps: {
                    isLoading: isLastStep ? isUploading : false,
                  },
                }}
              />
            </form>
          </FormProvider>
        </ModalBody>
        <ModalFooter></ModalFooter>
      </ModalContent>
    </Modal>
  );
}
