"use client";
import React from "react";
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
import FormInput from "@/components/common/form/FormInput";
import FormMainButton from "@/components/common/form/FormMainButton";

type AddEventModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export default function AddEventModal({ isOpen, onClose }: AddEventModalProps) {
  const toast = useToast();
  const { handleSubmit, control, reset } = useForm({
    defaultValues: { title: "" },
  });

  const onSubmit = (data: any) => {
    // testowo: nie wysyłamy nigdzie, tylko zamykamy modal i resetujemy formularz
    reset();
    onClose();
    toast({
      title: "Wysłano (testowo)",
      description: "Formularz został przesłany lokalnie.",
      status: "info",
      duration: 2000,
      isClosable: true,
    });
  };

  return (
    <Modal isOpen={isOpen} onClose={() => { reset(); onClose(); }} size="md">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Dodaj wydarzenie (test)</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <form id="add-event-form" onSubmit={handleSubmit(onSubmit)}>
            <Stack spacing={4} mt={2}>
              <Controller
                control={control}
                name="title"
                render={({ field, fieldState: { error } }) => (
                  <FormInput
                    placeholder="Tytuł (testowe pole)"
                    isInvalid={!!error}
                    id="title"
                    type="text"
                    value={field.value}
                    onChange={field.onChange}
                    errorMessage={undefined}
                  />
                )}
              />
              <FormMainButton text="Dodaj" type="submit" />
            </Stack>
          </form>
        </ModalBody>
        <ModalFooter>
          <Button variant="ghost" onClick={() => { reset(); onClose(); }}>
            Anuluj
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
