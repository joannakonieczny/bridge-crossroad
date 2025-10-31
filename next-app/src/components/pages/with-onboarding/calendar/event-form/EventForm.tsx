"use client";

import { ROUTES } from "@/routes";
import { useRouter } from "next/navigation";
import {
  useTranslations,
  useTranslationsWithFallback,
} from "@/lib/typed-translations";
import { zodResolver } from "@hookform/resolvers/zod";
import { useActionMutation } from "@/lib/tanstack-action/actions-mutation";
import { Controller, useForm } from "react-hook-form";
import { addModifyEventSchema } from "@/schemas/pages/with-onboarding/events/events-schema";
import {
  TabList,
  TabPanel,
  TabPanels,
  useToast,
  VStack,
} from "@chakra-ui/react";
import { createEvent } from "@/services/events/api";
import {
  ActionInput,
  MutationOrQuerryError,
} from "@/lib/tanstack-action/types";
import { getMessageKeyFromError } from "@/lib/tanstack-action/helpers";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  Stack,
  Button,
  Select,
  HStack,
  Input,
  FormLabel,
  Textarea,
  Box,
  Spinner,
  Tabs,
  Text,
} from "@chakra-ui/react";
import {
  Step,
  StepDescription,
  StepIcon,
  StepIndicator,
  StepNumber,
  StepSeparator,
  StepStatus,
  StepTitle,
  Stepper,
  useSteps,
  Progress,
} from "@chakra-ui/react";
import { Divider } from "@chakra-ui/react";
import { EventType } from "@/club-preset/event-type";
import FormInput from "@/components/common/form/FormInput";
import { MdArrowBackIos, MdArrowForwardIos } from "react-icons/md";

type EventFormProps = {
  isOpen: boolean;
  onClose: () => void;
};

export default function EventForm({ isOpen, onClose }: EventFormProps) {
  //const t = useTranslations("");
  //const tValidation = useTranslationsWithFallback();
  const {
    handleSubmit: handleFormSubmit,
    control: formControl,
    setError: setFormError,
  } = useForm({
    resolver: zodResolver(addModifyEventSchema),
    defaultValues: {
      title: "",
      description: "",
      location: "",
      organizer: "",
      duration: {
        startsAt: new Date(),
        endsAt: new Date(),
      },
      additionalDescription: "",
      imageUrl: "",
      data: {},
    },
  });

  const toast = useToast();

  const createEventAction = useActionMutation({
    action: createEvent,
    onSuccess: () => {},
    onError: (err) => {},
  });

  function handleWithToast(data: ActionInput<typeof createEvent>) {
    const promise = createEventAction.mutateAsync(data);
    toast.promise(promise, {
      loading: { title: "Tworzenie wydarzenia..." },
      success: { title: "Wydarzenie zostało utworzone." },
      error: (err: MutationOrQuerryError<typeof createEventAction>) => {
        const messageKey = getMessageKeyFromError(err);
        return { title: "Wystąpił błąd podczas tworzenia wydarzenia." };
      },
    });
  }

  function PrimaryInfoStep() {
    return (
      <Stack spacing={4}>
        <Controller
          control={formControl}
          name="title"
          render={({ field, fieldState: { error } }) => (
            <FormInput
              placeholder="Tytuł wydarzenia"
              errorMessage="Niepoprawne coś tam coś"
              isInvalid={!!error}
              id="title"
              type="text"
              value={field.value}
              onChange={field.onChange}
            />
          )}
        />
        <Controller
          control={formControl}
          name="description"
          render={({ field, fieldState: { error } }) => (
            <FormInput
              placeholder="Opis wydarzenia"
              errorMessage="Niepoprawne coś tam coś"
              isInvalid={!!error}
              id="description"
              type="textarea"
              value={field.value}
              onChange={field.onChange}
            />
          )}
        />
        <Controller
          control={formControl}
          name="additionalDescription"
          render={({ field, fieldState: { error } }) => (
            <FormInput
              placeholder="Dodatkowy opis wydarzenia"
              errorMessage="Niepoprawne coś tam coś"
              isInvalid={!!error}
              id="additionalDescription"
              type="textarea"
              value={field.value}
              onChange={field.onChange}
            />
          )}
        />
        <Controller
          control={formControl}
          name="location"
          render={({ field, fieldState: { error } }) => (
            <FormInput
              placeholder="Lokalizacja wydarzenia"
              errorMessage="Niepoprawne coś tam coś"
              isInvalid={!!error}
              id="location"
              type="text"
              value={field.value}
              onChange={field.onChange}
            />
          )}
        />
        <Controller
          control={formControl}
          name="organizer"
          render={({ field, fieldState: { error } }) => (
            <FormInput
              placeholder="Organizator wydarzenia"
              errorMessage="Niepoprawne coś tam coś"
              isInvalid={!!error}
              id="organizer"
              type="text"
              value={field.value}
              onChange={field.onChange}
            />
          )}
        />
        <HStack spacing={4}>
          <VStack flex={1}>
            <Text color="gray.500" alignSelf="start">
              Początek wydarzenia
            </Text>
            <Controller
              control={formControl}
              name="duration.startsAt"
              render={({ field, fieldState: { error } }) => (
                <FormInput
                  placeholder="Start wydarzenia"
                  errorMessage="Niepoprawne coś tam coś"
                  isInvalid={!!error}
                  id="startsAt"
                  type="datetime"
                  value={field.value.toString()}
                  onChange={field.onChange}
                />
              )}
            />
          </VStack>
          <VStack flex={1}>
            <Text color="gray.500" alignSelf="start">
              Koniec wydarzenia
            </Text>
            <Controller
              control={formControl}
              name="duration.endsAt"
              render={({ field, fieldState: { error } }) => (
                <FormInput
                  placeholder="Koniec wydarzenia"
                  errorMessage="Niepoprawne coś tam coś"
                  isInvalid={!!error}
                  id="endsAt"
                  type="datetime"
                  value={field.value.toString()}
                  onChange={field.onChange}
                />
              )}
            />
          </VStack>
        </HStack>
        <Controller
          control={formControl}
          name="data.type"
          render={({ field, fieldState: { error } }) => (
            <Select
              placeholder="Typ wydarzenia"
              value={field.value}
              onChange={field.onChange}
              focusBorderColor="accent.500"
              _focus={{ borderColor: "accent.500" }}
            >
              <option value={EventType.TOURNAMENT}>Turniej</option>
              <option value={EventType.LEAGUE_MEETING}>Spotkanie ligowe</option>
              <option value={EventType.TRAINING}>Trening</option>
              <option value={EventType.OTHER}>Inne</option>
            </Select>
          )}
        />
        <Button
          colorScheme="blue"
          onClick={() => {
            setActiveStep(activeStep + 1);
          }}
          alignSelf="flex-end"
          rightIcon={<MdArrowForwardIos />}
        >
          Dalej
        </Button>
      </Stack>
    );
  }

  function DetailedInfoStep() {
    return (
      <Stack spacing={4}>
        <HStack justifyContent="space-between" width="100%">
          <Button
            variant="outline"
            onClick={() => {
              setActiveStep(activeStep - 1);
            }}
            leftIcon={<MdArrowBackIos />}
          >
            Cofnij
          </Button>
          <Button
            colorScheme="blue"
            onClick={() => {
              setActiveStep(activeStep + 1);
            }}
            rightIcon={<MdArrowForwardIos />}
          >
            Dalej
          </Button>
        </HStack>
      </Stack>
    );
  }

  function SummaryStep() {
    return (
      <Stack spacing={4}>
        <Button
          variant="outline"
          alignSelf="flex-start"
          onClick={() => {
            setActiveStep(activeStep - 1);
          }}
          leftIcon={<MdArrowBackIos />}
        >
          Cofnij
        </Button>
      </Stack>
    );
  }

  const steps = [
    { title: "Podstawowe informacje", content: <PrimaryInfoStep /> },
    { title: "Szczegóły wydarzenia", content: <DetailedInfoStep /> },
    { title: "Podsumowanie", content: <SummaryStep /> },
  ];

  const { activeStep, setActiveStep } = useSteps({
    index: 0,
    count: steps.length,
  });

  const max = steps.length - 1;

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Dodaj wydarzenie</ModalHeader>
        <ModalCloseButton />
        <Divider />
        <ModalBody>
          <FormLabel htmlFor="title">{steps[activeStep].title}</FormLabel>
          <Box position="relative">
            <Stepper size="lg" index={activeStep}>
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
        </ModalBody>
        <ModalFooter>
          <Button
            colorScheme={activeStep == max ? "blue" : "gray"}
            variant={activeStep == max ? "solid" : "outline"}
            disabled={activeStep != max}
          >
            Dodaj wydarzenie
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
