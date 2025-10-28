"use client";

import { ROUTES } from "@/routes";
import { useRouter } from "next/navigation";
import {
  useTranslations,
  useTranslationsWithFallback,
} from "@/lib/typed-translations";
import { zodResolver } from "@hookform/resolvers/zod";
import { useActionMutation } from "@/lib/tanstack-action/actions-mutation";
import { useForm } from "react-hook-form";
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
} from "@chakra-ui/react";
import { Divider } from "@chakra-ui/react";

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
        <FormLabel htmlFor="title">Tytuł</FormLabel>
        <Input id="title" placeholder="Tytuł wydarzenia" />
        <FormLabel htmlFor="description">Opis</FormLabel>
        <Textarea id="description" placeholder="Opis wydarzenia" />
        <FormLabel htmlFor="location">Lokalizacja</FormLabel>
        <Input id="location" placeholder="Lokalizacja wydarzenia" />
        <FormLabel htmlFor="organizer">Organizator</FormLabel>
        <Input id="organizer" placeholder="Organizator wydarzenia" />
        <FormLabel htmlFor="duration">Czas trwania</FormLabel>
        <HStack spacing={4}>
          <Input type="datetime-local" id="startsAt" />
          <Input type="datetime-local" id="endsAt" />
        </HStack>
        <Button mt={4} colorScheme="blue">
          Dalej
        </Button>
      </Stack>
    );
  }

  const steps = [
    { title: "Podstawowe informacje", content: <PrimaryInfoStep /> },
    { title: "Szczegóły wydarzenia", content: <Box>Step 2 Content</Box> },
    { title: "Podsumowanie", content: <Box>Step 3 Content</Box> },
  ];

  const { activeStep } = useSteps({
    index: 0,
    count: steps.length,
  });

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Dodaj wydarzenie</ModalHeader>
        <ModalCloseButton />
        <Divider />
        <ModalBody>
          <Stepper index={activeStep}>
            {steps.map((step, index) => (
              <Step key={index}>
                <StepIndicator>
                  <StepStatus
                    complete={<StepIcon />}
                    incomplete={<StepNumber />}
                    active={<StepNumber />}
                  />
                </StepIndicator>
              </Step>
            ))}
          </Stepper>
          <Divider mt={4} />
          <PrimaryInfoStep />
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="blue">Dodaj wydarzenie</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
