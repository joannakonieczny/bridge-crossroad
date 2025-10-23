"use client";
import React, { useEffect } from "react";
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
  Spinner,
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
import { useActionQuery } from "@/lib/tanstack-action/actions-querry";
import { getJoinedGroupsInfo, getGroupData } from "@/services/groups/api";
import { GroupIdType } from "@/schemas/model/group/group-types";

/* --- lokalny schema --- */
const tournamentSchema = z.object({
  type: z.literal(EventType.TOURNAMENT),
  contestantsPairsRaw: z.string().optional(),
  arbiter: z.string().optional(),
  tournamentType: z.string().optional(),
});

const leagueSchema = z.object({
  type: z.literal(EventType.LEAGUE_MEETING),
  sessionRaw: z.string().optional(),
  tournamentType: z.string().optional(),
});

const trainingSchema = z.object({
  type: z.literal(EventType.TRAINING),
  coach: z.string().optional(),
  topic: z.string().nonempty("validation.model.event.data.invalid"),
});

const otherSchema = z.object({
  type: z.literal(EventType.OTHER),
  note: z.string().optional(),
});

const baseSchema = z
  .object({
    title: z.string().min(1, "validation.model.event.title.required"),
    description: z.string().optional(),
    location: z.string().optional(),
    startsAt: z.string().min(1, "validation.model.event.duration.invalidRange"),
    endsAt: z.string().min(1, "validation.model.event.duration.invalidRange"),
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
  })
  .refine((v) => new Date(v.startsAt) < new Date(v.endsAt), {
    message: "validation.model.event.duration.invalidRange",
    path: ["startsAt"],
  });

type _ZodCreateEventForm = z.infer<typeof baseSchema>;
type CreateEventFormType = Omit<_ZodCreateEventForm, "group"> & { group?: GroupIdType };

type AddEventModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

// helper do konwersji wartości z selecta
const toGroupIdType = (val: string): GroupIdType => val as GroupIdType;

export default function AddEventModal({ isOpen, onClose }: AddEventModalProps) {
  const toast = useToast();
  const t = useTranslations("pages.GroupsPage.AddGroupModal");
  const tValidation = useTranslationsWithFallback();
  const queryClient = useQueryClient();

  // --- dostępne grupy ---
  const groupsQ = useActionQuery({
    queryKey: QUERY_KEYS.groups,
    action: getJoinedGroupsInfo,
  });

  const { handleSubmit, control, reset, setValue } = useForm<CreateEventFormType>({
    resolver: zodResolver(baseSchema),
    defaultValues: {
      title: "",
      description: "",
      location: "",
      startsAt: "",
      endsAt: "",
      organizer: "",
      group: undefined,
      additionalDescription: "",
      imageUrl: "",
      data: { type: EventType.OTHER, note: "", coach: "coach-123" } as any,
    },
  });

  const selectedGroupId = useWatch({ control, name: "group" }) as GroupIdType | undefined;
  const selectedType = useWatch({ control, name: "data.type" }) as EventType | undefined;

  const groupMembersQ = useActionQuery({
    queryKey: [QUERY_KEYS.group, selectedGroupId],
    action: async () => {
      return await getGroupData({ groupId: selectedGroupId as GroupIdType });
    },
    enabled: !!selectedGroupId,
  });

  useEffect(() => {
    if (!selectedGroupId) setValue("organizer", "");
  }, [selectedGroupId, setValue]);

  const createEventAction = useActionMutation({
    action: createEvent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.groups });
      reset();
    },
    onError: (err: any) => {
      const msg = err?.message ?? "Nieznany błąd";
      toast({ title: "Błąd", description: String(msg), status: "error", duration: 3000 });
    },
  });

  const onSubmit = async (data: CreateEventFormType) => {
    const payload: any = {
      title: data.title,
      description: data.description,
      location: data.location,
      organizer: data.organizer || undefined,
      attendees: [],
      group: data.group || undefined,
      duration: {
        startsAt: new Date(data.startsAt),
        endsAt: new Date(data.endsAt),
      },
      additionalDescription: data.additionalDescription || undefined,
      imageUrl: "",
      data: undefined,
    };

    switch (data.data.type) {
      case EventType.TOURNAMENT:
        payload.data = {
          type: EventType.TOURNAMENT,
          contestantsPairs: [],
          arbiter: (data.data as any).arbiter || undefined,
          tournamentType: (data.data as any).tournamentType || undefined,
        };
        break;
      case EventType.LEAGUE_MEETING:
        payload.data = {
          type: EventType.LEAGUE_MEETING,
          session: [],
          tournamentType: (data.data as any).tournamentType || undefined,
        };
        break;
      case EventType.TRAINING:
        payload.data = {
          type: EventType.TRAINING,
          coach: (data.data as any).coach,
          topic: (data.data as any).topic,
        };
        break;
      default:
        payload.data = { type: EventType.OTHER };
    }

    const promise = createEventAction.mutateAsync(payload);
    toast.promise(promise, {
      loading: { title: "Tworzenie wydarzenia..." },
      success: { title: "Utworzono wydarzenie" },
      error: { title: "Błąd podczas tworzenia wydarzenia" },
    });

    await promise.then(() => {
      reset();
      onClose();
    });
  };

  return (
    <Modal isOpen={isOpen} onClose={() => { reset(); onClose(); }} size="lg">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Dodaj wydarzenie</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Box position="relative">
            {groupsQ.isLoading && (
              <Box position="absolute" inset={0} display="flex" alignItems="center" justifyContent="center" zIndex={2}>
                <Spinner />
              </Box>
            )}

            <Box opacity={groupsQ.isLoading ? 0.6 : 1} pointerEvents={groupsQ.isLoading ? "none" : "auto"}>
              <form onSubmit={handleSubmit(onSubmit)}>
                <Stack spacing={4} mt={2}>
                  {/* --- Tytuł --- */}
                  <Controller
                    control={control}
                    name="title"
                    render={({ field, fieldState: { error } }) => (
                      <>
                        <FormLabel>Tytuł</FormLabel>
                        <Input {...field} placeholder="Tytuł wydarzenia" />
                        {error && <Box color="red.500" fontSize="sm">{tValidation(error.message)}</Box>}
                      </>
                    )}
                  />

                  {/* --- Opis --- */}
                  <Controller
                    control={control}
                    name="description"
                    render={({ field }) => (
                      <>
                        <FormLabel>Opis</FormLabel>
                        <Textarea {...field} placeholder="Opis (opcjonalnie)" />
                      </>
                    )}
                  />

                  {/* --- Daty --- */}
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

                  {/* --- Typ wydarzenia --- */}
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

                  {/* --- Pola warunkowe --- */}
                  {selectedType === EventType.TRAINING && (
                    <>
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

                  {/* --- Wybór grupy --- */}
                  <Controller
                    control={control}
                    name="group"
                    render={({ field, fieldState: { error } }) => (
                      <>
                        <FormLabel>Grupa</FormLabel>
                        <Select
                          value={field.value ?? ""}
                          onChange={(e) =>
                            field.onChange(e.target.value ? toGroupIdType(e.target.value) : undefined)
                          }
                        >
                          <option key="placeholder" value="">
                            {groupsQ.isLoading ? "Ładowanie grup..." : "Wybierz grupę"}
                          </option>

                          {Array.isArray(groupsQ.data) &&
                            groupsQ.data.map((g: any, idx: number) => {
                              const key = g?.id ?? g?.groupId ?? `g-${idx}`;
                              const val = String(g?.id ?? g?.groupId ?? key) as GroupIdType;
                              const label = g?.name ?? g?.title ?? val;
                              return (
                                <option key={key} value={val}>
                                  {label}
                                </option>
                              );
                            })}

                          {!groupsQ.isLoading &&
                            (!Array.isArray(groupsQ.data) || groupsQ.data.length === 0) && (
                              <option key="no-groups" value="" disabled>
                                Brak dostępnych grup
                              </option>
                            )}
                        </Select>
                        {error && <Box color="red.500" fontSize="sm">{tValidation(error.message)}</Box>}
                      </>
                    )}
                  />

                  {/* --- Organizator (członkowie grupy) --- */}
                  <Controller
                    control={control}
                    name="organizer"
                    render={({ field, fieldState: { error } }) => (
                      <>
                        <FormLabel>Organizator</FormLabel>
                        <Select
                          value={field.value ?? ""}
                          onChange={(e) => field.onChange(e.target.value || undefined)}
                          isDisabled={!selectedGroupId || groupMembersQ.isLoading}
                        >
                          <option key="org-placeholder" value="">
                            {!selectedGroupId
                              ? "Wybierz grupę, aby zobaczyć członków"
                              : groupMembersQ.isLoading
                              ? "Ładowanie członków..."
                              : "Wybierz organizatora"}
                          </option>

                          {Array.isArray(groupMembersQ.data?.members) &&
                            groupMembersQ.data!.members.map((m: any, idx: number) => {
                              const key = m?.id ?? m?._id ?? `m-${idx}`;
                              const val = String(m?.id ?? m?._id ?? key);
                              const label = m?.name ?? m?.fullName ?? m?.displayName ?? val;
                              return (
                                <option key={key} value={val}>
                                  {label}
                                </option>
                              );
                            })}

                          {!groupMembersQ.isLoading &&
                            selectedGroupId &&
                            (!Array.isArray(groupMembersQ.data?.members) ||
                              (groupMembersQ.data?.members ?? []).length === 0) && (
                              <option key="no-members" value="" disabled>
                                Brak członków w grupie
                              </option>
                            )}
                        </Select>
                        {error && <Box color="red.500" fontSize="sm">{tValidation(error.message)}</Box>}
                      </>
                    )}
                  />

                  {/* --- Dodatkowy opis --- */}
                  <Controller
                    control={control}
                    name="additionalDescription"
                    render={({ field }) => (
                      <>
                        <FormLabel>Dodatkowy opis</FormLabel>
                        <Textarea {...field} placeholder="Dodatkowy opis (opcjonalnie)" />
                      </>
                    )}
                  />

                  <Button type="submit" colorScheme="blue">
                    Dodaj
                  </Button>
                </Stack>
              </form>
            </Box>
          </Box>
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
