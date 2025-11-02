"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { addEventSchema } from "@/schemas/pages/with-onboarding/events/events-schema";
import {
  FormControl,
  VStack,
  Radio,
  RadioGroup,
  Wrap,
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
  FormLabel,
  Box,
  Text,
} from "@chakra-ui/react";
import {
  Step,
  StepIcon,
  StepIndicator,
  StepNumber,
  StepSeparator,
  StepStatus,
  Stepper,
  useSteps,
} from "@chakra-ui/react";
import { Divider } from "@chakra-ui/react";
import { EventType, TournamentType } from "@/club-preset/event-type";
import FormInput from "@/components/common/form/FormInput";
import { MdArrowBackIos, MdArrowForwardIos } from "react-icons/md";
import { FormErrorMessage } from "@chakra-ui/react";
import { QUERY_KEYS } from "@/lib/query-keys";
import { useActionQuery } from "@/lib/tanstack-action/actions-querry";
import { getJoinedGroupsInfo, getGroupData } from "@/services/groups/api";
import ContestantsPairsEditor from "./ContestantsPairsEditor";
import SessionEditor from "./SessionEditor";

type EventFormProps = {
  isOpen: boolean;
  onClose: () => void;
};

export default function EventForm({ isOpen, onClose }: EventFormProps) {
  const form = useForm({
    resolver: zodResolver(addEventSchema),
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
      imageUrl: "",
      data: {},
    },
  });

  const selectedGroup = form.watch("group");

  const groupsQ = useActionQuery({
    queryKey: QUERY_KEYS.groups,
    action: getJoinedGroupsInfo,
  });

  const peopleQ = useActionQuery({
    queryKey: QUERY_KEYS.group(selectedGroup),
    action: () => getGroupData({ groupId: selectedGroup }),
    enabled: !!selectedGroup,
  });

  function PrimaryInfoStep() {
    return (
      <Stack spacing={4}>
        <Controller
          control={form.control}
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
          control={form.control}
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
          control={form.control}
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
          control={form.control}
          name="group"
          render={({ field, fieldState: { error } }) => (
            <FormControl isInvalid={!!error}>
              {error && (
                <FormErrorMessage mb={2}>
                  Nie wybrano grupy dla wydarzenia
                </FormErrorMessage>
              )}
              <Select
                placeholder="Grupa"
                id="group"
                value={field.value as unknown as string}
                onChange={(e) => field.onChange(e.target.value)}
              >
                {(groupsQ.data ?? []).map((group) => (
                  <option key={group.id} value={group.id}>
                    {group.name}
                  </option>
                ))}
              </Select>
            </FormControl>
          )}
        />
        <Controller
          control={form.control}
          name="organizer"
          render={({ field, fieldState: { error } }) => (
            <FormControl isInvalid={!!error}>
              {error && (
                <FormErrorMessage mb={2}>
                  Nie wybrano grupy dla wydarzenia
                </FormErrorMessage>
              )}
              <Select
                placeholder="Organizator"
                id="organizer"
                value={field.value as unknown as string}
                onChange={(e) => field.onChange(e.target.value)}
              >
                {(peopleQ.data?.members ?? []).map((member) => (
                  <option key={member.id} value={member.id}>
                    {member.nickname
                      ? member.nickname
                      : `${member.name.firstName} ${member.name.lastName}`}
                  </option>
                ))}
              </Select>
            </FormControl>
          )}
        />
        <HStack spacing={4}>
          <VStack flex={1}>
            <Text color="gray.500" alignSelf="start">
              Początek wydarzenia
            </Text>
            <Controller
              control={form.control}
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
              control={form.control}
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
        <Text color="gray.500" alignSelf="start">
          Typ Wydarzenia
        </Text>
        <Controller
          control={form.control}
          name="data.type"
          render={({ field, fieldState: { error } }) => (
            <FormControl as="fieldset" isInvalid={!!error}>
              {error && (
                <FormErrorMessage mb={2}>
                  Niepoprawny typ wydarzenia
                </FormErrorMessage>
              )}
              <RadioGroup
                onChange={(value) => field.onChange(value as EventType)}
                value={field.value as unknown as string}
              >
                <Wrap spacing="1rem">
                  <Radio value={EventType.TOURNAMENT}>TOURNAMENT</Radio>
                  <Radio value={EventType.LEAGUE_MEETING}>LEAGUE_MEETING</Radio>
                  <Radio value={EventType.TRAINING}>TRAINING</Radio>
                  <Radio value={EventType.OTHER}>OTHER</Radio>
                </Wrap>
              </RadioGroup>
            </FormControl>
          )}
        />
        <Button
          colorScheme="blue"
          onClick={async () => {
            //const valid = await trigger();
            //if (valid) {
            setActiveStep(activeStep + 1);
            //} else {
            // opcjonalnie: możesz pokazać toast lub przewinąć do pierwszego błędu
            //}
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
    const dataType = form.getValues().data?.type;

    return (
      <Stack spacing={4}>
        {dataType === EventType.TOURNAMENT ? (
          <>
            <Controller
              control={form.control}
              name="data.tournamentType"
              render={({ field, fieldState: { error } }) => (
                <FormControl isInvalid={!!error}>
                  {error && (
                    <FormErrorMessage mb={2}>
                      Niepoprawny typ turnieju
                    </FormErrorMessage>
                  )}
                  <Select
                    placeholder="Typ turnieju"
                    id="tournamentType"
                    value={field.value as unknown as string}
                    onChange={(e) =>
                      field.onChange(e.target.value as EventType)
                    }
                  >
                    <option value={TournamentType.MAX}>MAX</option>
                    <option value={TournamentType.IMPS}>IMPS</option>
                    <option value={TournamentType.CRAZY}>CRAZY</option>
                    <option value={TournamentType.TEAM}>TEAM</option>
                    <option value={TournamentType.INDIVIDUAL}>
                      INDIVIDUAL
                    </option>
                    <option value={TournamentType.BAMY}>BAMY</option>
                  </Select>
                </FormControl>
              )}
            />
            <Controller
              control={form.control}
              name="data.arbiter"
              render={({ field, fieldState: { error } }) => (
                <FormControl isInvalid={!!error}>
                  <Select
                    placeholder="Arbiter"
                    id="arbiter"
                    value={field.value as unknown as string}
                    onChange={(e) => field.onChange(e.target.value)}
                  >
                    {(peopleQ.data?.members ?? []).map((member) => (
                      <option key={member.id} value={member.id}>
                        {member.nickname
                          ? member.nickname
                          : `${member.name.firstName} ${member.name.lastName}`}
                      </option>
                    ))}
                  </Select>
                </FormControl>
              )}
            />
            {/* Editor par dla turnieju — przekazujemy listę członków z peopleQ */}
            <ContestantsPairsEditor
              control={form.control}
              name="data.contestantsPairs"
              label="Lista par"
              people={peopleQ.data?.members ?? []}
            />
          </>
        ) : dataType === EventType.LEAGUE_MEETING ? (
          <>
            {/* Edytor sesji dla spotkania ligowego */}
            <SessionEditor
              control={form.control}
              name="data.session"
              people={peopleQ.data?.members ?? []}
            />
          </>
        ) : dataType === EventType.TRAINING ? (
          <>
            <Controller
              control={form.control}
              name="data.coach"
              render={({ field, fieldState: { error } }) => (
                <FormControl isInvalid={!!error}>
                  <Select
                    placeholder="Trener"
                    id="coach"
                    value={field.value as unknown as string}
                    onChange={(e) => field.onChange(e.target.value)}
                  >
                    {(peopleQ.data?.members ?? []).map((member) => (
                      <option key={member.id} value={member.id}>
                        {member.nickname
                          ? member.nickname
                          : `${member.name.firstName} ${member.name.lastName}`}
                      </option>
                    ))}
                  </Select>
                </FormControl>
              )}
            />
            <Controller
              control={form.control}
              name="data.topic"
              render={({ field, fieldState: { error } }) => (
                <FormInput
                  placeholder="Temat treningu"
                  errorMessage="Niepoprawne coś tam coś"
                  isInvalid={!!error}
                  id="topic"
                  type="text"
                  value={field.value}
                  onChange={field.onChange}
                />
              )}
            />
          </>
        ) : (
          <></>
        )}
        <Controller
          control={form.control}
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
            onClick={async () => {
              //const valid = await trigger();
              //if (valid) {
              setActiveStep(activeStep + 1);
              //} else {
              // opcjonalnie: możesz pokazać toast lub przewinąć do pierwszego błędu
              // }
            }}
            alignSelf="flex-end"
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
        <Text>Tytuł wydarzenia: {form.getValues()?.title}</Text>
        <Text></Text>
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
