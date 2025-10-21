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
  Select,
  HStack,
  Input,
  FormLabel,
  Textarea,
  Box,
} from "@chakra-ui/react";
import { Controller, useForm, useWatch } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useActionMutation } from "@/lib/tanstack-action/actions-mutation";
import { createEvent } from "@/services/events/api";
import { useTranslations, useTranslationsWithFallback } from "@/lib/typed-translations";
import { useQueryClient } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/lib/query-keys";
import { EventType } from "@/club-preset/event-type";

/* --- lokalny schema (używamy uproszczonej, ale zgodnej struktury z discriminat union) --- */
const tournamentSchema = z.object({
  type: z.literal(EventType.TOURNAMENT),
  // proste pole: lista par w formacie "id1,id2" rozdzielonych enterem
  contestantsPairsRaw: z.string().optional(),
  arbiter: z.string().optional(),
  tournamentType: z.string().optional(),
});

const leagueSchema = z.object({
  type: z.literal(EventType.LEAGUE_MEETING),
  // prosty formularz: sesje jako tekst (można rozbudować)
  sessionRaw: z.string().optional(),
  tournamentType: z.string().optional(),
});

const trainingSchema = z.object({
  type: z.literal(EventType.TRAINING),
  coach: z.string().optional(),
  topic: z.string().nonempty("validation.model.event.data.invalid"), // use translation key
});

const otherSchema = z.object({
  type: z.literal(EventType.OTHER),
  note: z.string().optional(),
});

const baseSchema = z.object({
  title: z.string().min(1, "validation.model.event.title.required"),
  description: z.string().optional(),
  location: z.string().optional(),
  startsAt: z.string().min(1, "validation.model.event.duration.invalidRange"),
  endsAt: z.string().min(1, "validation.model.event.duration.invalidRange"),
  // discriminated union on "type"
  data: z.discriminatedUnion("type", [
    tournamentSchema,
    leagueSchema,
    trainingSchema,
    otherSchema,
  ]),
  organizer: z.string().optional(),
  group: z.string().optional(),
  additionalDescription: z.string().optional(),
  imageUrl: z.string().optional(),
}).refine((v) => new Date(v.startsAt) < new Date(v.endsAt), {
  message: "validation.model.event.duration.invalidRange",
  path: ["startsAt"],
});

type CreateEventFormType = z.infer<typeof baseSchema>;

type AddEventModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export default function AddEventModal({ isOpen, onClose }: AddEventModalProps) {
  const toast = useToast();
  const t = useTranslations("pages.GroupsPage.AddGroupModal"); // reuse keys for generic labels or replace as needed
  const tValidation = useTranslationsWithFallback();
  const queryClient = useQueryClient();

  const { handleSubmit, control, reset, setError } = useForm<CreateEventFormType>({
    resolver: zodResolver(baseSchema),
    defaultValues: {
      title: "",
      description: "",
      location: "",
      startsAt: "",
      endsAt: "",
      // pola zgodne z event-schema
      organizer: "",
      group: "",
      additionalDescription: "",
      // coach zahardcodowany w formularzu:
      data: { type: EventType.OTHER, note: "", coach: "coach-123" } as any,
    },
  });

  const selectedType = useWatch({ control, name: "data.type" }) as EventType | undefined;

  const createEventAction = useActionMutation({
    action: createEvent,
    onSuccess: () => {
      // Invalidate any events lists if you use such queries
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.groups }); // placeholder; adapt if you have events keys
      reset();
    },
    onError: (err: any) => {
      // Example server-side error handling — map message key to field if provided
      const msg = err?.message ?? "Nieznany błąd";
      toast({ title: "Błąd", description: String(msg), status: "error", duration: 3000 });
    },
  });

  const onSubmit = async (data: CreateEventFormType) => {
    // przygotuj payload zgodny z oczekiwanym shape (konwersja dat)
    const payload: any = {
      title: data.title,
      description: data.description,
      location: data.location,
      organizer: data.organizer || undefined,
      attendees: [], // tymczasowo pusta lista uczestników
      group: data.group || undefined,
      duration: {
        startsAt: new Date(data.startsAt),
        endsAt: new Date(data.endsAt),
      },
      additionalDescription: data.additionalDescription || undefined,
      imageUrl: "", // wysyłamy pusty string zamiast pola
      // minimalne mapowanie dla data w zależności od typu
      data: undefined,
    };

    switch (data.data.type) {
      case EventType.TOURNAMENT: {
        // tymczasowo nie zbieramy par z formularza — przekazujemy pustą listę
        const pairs: Array<{ first: string; second: string }> = [];

        payload.data = {
          type: EventType.TOURNAMENT,
          contestantsPairs: pairs,
          arbiter: (data.data as any).arbiter || undefined,
          tournamentType: (data.data as any).tournamentType || undefined,
        };
        break;
      }
      case EventType.LEAGUE_MEETING: {
        payload.data = {
          type: EventType.LEAGUE_MEETING,
          session: [], // for now empty; you can parse sessionRaw similarly
          tournamentType: (data.data as any).tournamentType || undefined,
        };
        break;
      }
      case EventType.TRAINING: {
        payload.data = {
          type: EventType.TRAINING,
          coach: (data.data as any).coach,
          topic: (data.data as any).topic,
        };
        break;
      }
      default: {
        payload.data = { type: EventType.OTHER };
      }
    }

    // wywołaj akcję (testowo: akcja może wymagać uprawnień/group context)
    const promise = createEventAction.mutateAsync(payload);

    toast.promise(promise, {
      loading: { title: "Tworzenie wydarzenia..." },
      success: { title: "Utworzono wydarzenie" },
      error: (err: any) => {
        return { title: "Błąd podczas tworzenia wydarzenia" };
      },
    });

    await promise.then(() => {
      reset();
      onClose();
    }).catch(() => {
      // error handled by toast
    });
  };

  return (
    <Modal isOpen={isOpen} onClose={() => { reset(); onClose(); }} size="lg">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Dodaj wydarzenie</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Stack spacing={4} mt={2}>
              <Controller
                control={control}
                name="title"
                render={({ field, fieldState: { error } }) => (
                  <>
                    <FormLabel htmlFor="title">Tytuł</FormLabel>
                    <Input id="title" {...field} placeholder="Tytuł wydarzenia" />
                    {/* minimal inline error */}
                    {error && <Box color="red.500" fontSize="sm">{tValidation(error.message)}</Box>}
                  </>
                )}
              />

              <Controller
                control={control}
                name="description"
                render={({ field }) => (
                  <>
                    <FormLabel htmlFor="description">Opis</FormLabel>
                    <Textarea id="description" {...field} placeholder="Opis (opcjonalnie)" />
                  </>
                )}
              />

              <HStack>
                <Controller
                  control={control}
                  name="startsAt"
                  render={({ field, fieldState: { error } }) => (
                    <Box flex={1}>
                      <FormLabel>Start</FormLabel>
                      <Input type="datetime-local" {...field} />
                      {error && <Box color="red.500" fontSize="sm">{tValidation(error.message)}</Box>}
                    </Box>
                  )}
                />
                <Controller
                  control={control}
                  name="endsAt"
                  render={({ field, fieldState: { error } }) => (
                    <Box flex={1}>
                      <FormLabel>Koniec</FormLabel>
                      <Input type="datetime-local" {...field} />
                      {error && <Box color="red.500" fontSize="sm">{tValidation(error.message)}</Box>}
                    </Box>
                  )}
                />
              </HStack>

              <Controller
                control={control}
                name="data.type"
                render={({ field }) => (
                  <>
                    <FormLabel>Typ wydarzenia</FormLabel>
                    <Select {...field} value={field.value} onChange={(e) => field.onChange(e.target.value)}>
                      <option value={EventType.TOURNAMENT}>Turniej</option>
                      <option value={EventType.LEAGUE_MEETING}>Zjazd ligowy</option>
                      <option value={EventType.TRAINING}>Trening</option>
                      <option value={EventType.OTHER}>Inne</option>
                    </Select>
                  </>
                )}
              />

              {/* pola warunkowe */}
              {selectedType === EventType.TOURNAMENT && (
                <>
                  <Controller
                    control={control}
                    name="data.arbiter"
                    render={({ field, fieldState: { error } }) => (
                      <>
                        <Input placeholder="Sędzia (id)" {...field} />
                        {error && <Box color="red.500" fontSize="sm">{tValidation(error.message)}</Box>}
                      </>
                    )}
                  />
                </>
              )}

              {selectedType === EventType.LEAGUE_MEETING && (
                <>
                  <FormLabel>Sesje (surowy tekst)</FormLabel>
                  <Controller
                    control={control}
                    name="data.sessionRaw"
                    render={({ field, fieldState: { error } }) => (
                      <>
                        <Textarea placeholder="session data..." {...field} />
                        {error && <Box color="red.500" fontSize="sm">{tValidation(error.message)}</Box>}
                      </>
                    )}
                  />
                </>
              )}

              {selectedType === EventType.TRAINING && (
                <>
                  {/* coach jest zahardcodowany i nieedytowalny */}
                  <Controller
                    control={control}
                    name="data.coach"
                    render={({ field }) => (
                      <Input placeholder="Trener (id)" {...field} isDisabled readOnly />
                    )}
                  />
                  <Controller
                    control={control}
                    name="data.topic"
                    render={({ field, fieldState: { error } }) => (
                      <>
                        <Input placeholder="Temat treningu" {...field} />
                        {error && <Box color="red.500" fontSize="sm">{tValidation(error.message)}</Box>}
                      </>
                    )}
                  />
                </>
              )}

              {/* organizer, attendees, group, additionalDescription, imageUrl */}
              <Controller
                control={control}
                name="organizer"
                render={({ field, fieldState: { error } }) => (
                  <>
                    <FormLabel>Organizator (id)</FormLabel>
                    <Input {...field} placeholder="Organizer id" />
                    {error && <Box color="red.500" fontSize="sm">{tValidation(error.message)}</Box>}
                  </>
                )}
              />

              <Controller
                control={control}
                name="group"
                render={({ field, fieldState: { error } }) => (
                  <>
                    <FormLabel>Grupa (id)</FormLabel>
                    <Input {...field} placeholder="Group id" />
                    {error && <Box color="red.500" fontSize="sm">{tValidation(error.message)}</Box>}
                  </>
                )}
              />

              <Controller
                control={control}
                name="additionalDescription"
                render={({ field }) => (
                  <>
                    <FormLabel>Additional description</FormLabel>
                    <Textarea {...field} placeholder="Dodatkowy opis (opcjonalnie)" />
                  </>
                )}
              />

              {/* pole imageUrl usunięte - wysyłamy pusty string na backend */}

              {/* submit */}
              <Button type="submit" colorScheme="blue">Dodaj</Button>
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
