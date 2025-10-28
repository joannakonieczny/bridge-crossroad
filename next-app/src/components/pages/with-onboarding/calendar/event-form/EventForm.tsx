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
import { eventSchema } from "@/schemas/model/event/event-schema";
import { useToast } from "@chakra-ui/react";
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
} from "@chakra-ui/react";

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
    resolver: zodResolver(eventSchema),
    defaultValues: {
      title: "",
      description: "",
      // ... other default values
    },
  });

  const router = useRouter();
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

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Dodaj wydarzenie</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Stack spacing={4}>
            <FormLabel htmlFor="title">Tytuł</FormLabel>
            <Input id="title" placeholder="Tytuł wydarzenia" />
            <FormLabel htmlFor="description">Opis</FormLabel>
            <Textarea id="description" placeholder="Opis wydarzenia" />
          </Stack>
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="blue">Dodaj wydarzenie</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
