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
import { createEvent, updateEvent } from "@/services/events/api";
import type { MutationOrQuerryError } from "@/lib/tanstack-action/types";
import { getMessageKeyFromError } from "@/lib/tanstack-action/helpers";
import {
  useTranslations,
  useTranslationsWithFallback,
} from "@/lib/typed-translations";
import { useQueryClient } from "@tanstack/react-query";
import { EventType } from "@/club-preset/event-type";
import { withEmptyToUndefined } from "@/schemas/common";
import dayjs from "dayjs";
import type { AddEventSchemaType } from "@/schemas/pages/with-onboarding/events/events-types";
import { useEffect } from "react";

type EventFormProps = {
  isOpen: boolean;
  onClose: () => void;
  mode?: "create" | "modify";
  eventId?: string;
  groupId?: string;
  initialData?: AddEventSchemaType;
};

type EventActionInput =
  | {
      mode: "create";
      data: AddEventSchemaType & { groupId: string };
    }
  | {
      mode: "modify";
      data: { eventId: string; groupId: string; changes: AddEventSchemaType };
    };

export default function EventForm({
  isOpen,
  onClose,
  mode = "create",
  eventId,
  groupId,
  initialData,
}: EventFormProps) {
  const isModifyMode = mode === "modify";

  const form = useForm({
    mode: "onChange",
    reValidateMode: "onChange",
    resolver: zodResolver(withEmptyToUndefined(addEventSchema)),
    defaultValues: initialData || {
      title: "",
      description: "",
      location: "",
      group: groupId || "",
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
    setInitialPreview,
    isUploading,
    isError: isUploadError,
    preview,
    fileName,
  } = useImageUpload({
    text: {
      toast: {
        loading: { title: t("imageToast.loading") },
        success: { title: t("imageToast.success") },
        error: { title: t("imageToast.error") },
      },
    },
  });

  useEffect(() => {
    if (isModifyMode && initialData) {
      form.reset(initialData);
      if (initialData.imageUrl) {
        setInitialPreview(initialData.imageUrl);
      } else {
        resetImage();
      }
    } else if (!isModifyMode) {
      form.reset();
      resetImage();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isModifyMode, initialData, form.reset]);

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

  const eventAction = useActionMutation({
    action: ({ mode, data }: EventActionInput) => {
      if (mode === "create") {
        return createEvent(data);
      }
      return updateEvent(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["event"],
      });
      onCloseWithReset();
    },
  });

  async function handleWithToast(data: AddEventSchemaType) {
    const uploadedPath = await uploadImage();

    // Check upload error
    if (selectedImage && !uploadedPath) return;

    const eventData =
      selectedImage && uploadedPath
        ? { ...data, imageUrl: uploadedPath }
        : data;

    const promise =
      isModifyMode && eventId && groupId
        ? eventAction.mutateAsync({
            mode: "modify",
            data: { eventId, groupId, changes: eventData },
          })
        : eventAction.mutateAsync({
            mode: "create",
            data: { ...eventData, groupId: data.group },
          });

    toast.promise(promise, {
      loading: {
        title: isModifyMode
          ? t("modify.toast.loading")
          : t("create.toast.loading"),
      },
      success: {
        title: isModifyMode
          ? t("modify.toast.success")
          : t("create.toast.success"),
      },
      error: (err: MutationOrQuerryError<typeof eventAction>) => {
        const errKey = getMessageKeyFromError(err, {
          fallbackKey: isModifyMode
            ? "pages.EventFormPage.modify.toast.errorDefault"
            : "pages.EventFormPage.create.toast.errorDefault",
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
        <ModalHeader>
          {isModifyMode ? t("modify.header") : t("create.header")}
        </ModalHeader>
        <ModalCloseButton />
        <Divider />
        <ModalBody>
          <FormProvider {...form}>
            <form onSubmit={form.handleSubmit((d) => handleWithToast(d))}>
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
                  value={preview || undefined}
                  fileName={fileName || undefined}
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
                  text: isLastStep
                    ? isModifyMode
                      ? t("modify.submitButton")
                      : t("create.submitButton")
                    : t("buttons.next"),
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
                        form.handleSubmit((d) => handleWithToast(d))();
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
