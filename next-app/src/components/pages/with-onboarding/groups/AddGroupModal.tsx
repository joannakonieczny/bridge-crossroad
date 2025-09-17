"use client";

import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  Stack,
  useToast,
  Button,
} from "@chakra-ui/react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useActionMutation } from "@/lib/tanstack-action/actions-mutation";
import { getMessageKeyFromError } from "@/lib/tanstack-action/helpers";
import type { MutationOrQuerryError } from "@/lib/tanstack-action/types";
import FormInput from "../../../common/form/FormInput";
import FormMainButton from "../../../common/form/FormMainButton";

import { z } from "zod";
import { createGroupFormSchema } from "@/schemas/pages/with-onboarding/groups/create-group-form-schema";
import { create } from "domain";

// Losowy kod zaproszenia
function generateInvitationCode(length: number = 8) {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  return Array.from({ length }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
}

type CreateGroupInput = z.infer<typeof createGroupFormSchema>;

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

export default function AddGroupModal({ isOpen, onClose }: Props) {
  const toast = useToast();

  const { handleSubmit, control, setError } = useForm<CreateGroupInput>({
    resolver: zodResolver(createGroupFormSchema),
    defaultValues: {
      name: "",
      description: "",
      imageUrl: "",
      invitationCode: generateInvitationCode(),
    },
  });

  const createGroupAction = useActionMutation({
    action: async (data: CreateGroupInput) => {
      console.log("Tworzenie grupy:", data);
      try {
        // Tutaj dodaj logikę tworzenia grupy
        return { data: true };
      } catch (error) {
        return { error };
      }
    },
    onSuccess: () => {
      toast({
        title: "Utworzono grupę!",
        status: "success",
      });
      onClose();
    },
    onError: (err) => {
      const errKey = getMessageKeyFromError(err);
      setError("name", { type: "server", message: errKey });
    },
  });

  const onSubmit = (data: CreateGroupInput) => {
    const promise = createGroupAction.mutateAsync(data);
    toast.promise(promise, {
      loading: { title: "Tworzenie grupy..." },
      success: { title: "Utworzono grupę!" },
      error: (err: MutationOrQuerryError<typeof createGroupAction>) => {
        const errKey = getMessageKeyFromError(err);
        return { title: errKey };
      },
    });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Dodaj grupę</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
            <form onSubmit={handleSubmit(onSubmit)}>
              <Stack spacing={4} mt={4}>
                <Controller
                  control={control}
                  name="name"
                  render={({ field, fieldState: { error } }) => (
                    <FormInput
                      placeholder="Nazwa grupy"
                      errorMessage={error?.message}
                      isInvalid={!!error}
                      id="name"
                      type="text"
                      value={field.value}
                      onChange={field.onChange}
                    />
                  )}
                />

                <Controller
                  control={control}
                  name="description"
                  render={({ field, fieldState: { error } }) => (
                    <FormInput
                      type="textarea"
                      placeholder="Opis grupy (opcjonalnie)"
                      errorMessage={error?.message}
                      isInvalid={!!error}
                      id="description"
                      value={field.value}
                      onChange={field.onChange}
                    />
                  )}
                />



                <Controller
                  control={control}
                  name="imageUrl"
                  render={({ field, fieldState: { error } }) => (
                    <FormInput
                      placeholder="Link do zdjęcia grupy (opcjonalnie)"
                      errorMessage={error?.message}
                      isInvalid={!!error}
                      id="imageUrl"
                      type="text"
                      value={field.value}
                      onChange={field.onChange}
                    />
                  )}
                />
                <FormMainButton text="Utwórz" type="submit" />
              </Stack>
            </form>
        </ModalBody>
        <ModalFooter>
          <Button variant="ghost" onClick={onClose}>
            Anuluj
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
