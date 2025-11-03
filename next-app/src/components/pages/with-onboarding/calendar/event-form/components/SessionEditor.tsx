import React from "react";
import { Controller, useFieldArray, useFormContext } from "react-hook-form";
import {
  VStack,
  HStack,
  Button,
  Select,
  Box,
  Text,
  IconButton,
  NumberInput,
  NumberInputField,
  Input,
} from "@chakra-ui/react";
import { MdAdd, MdDelete } from "react-icons/md";
import { Half } from "@/club-preset/event-type";
// import { useTranslationsWithFallback } from "@/lib/typed-translations";
import type { UserTypeBasic } from "@/schemas/model/user/user-types";
import type { AddEventSchemaType } from "@/schemas/pages/with-onboarding/events/events-types";

type Props = {
  label?: string;
  people: UserTypeBasic[];
};

export function SessionEditor(props: Props) {
  const form = useFormContext<AddEventSchemaType>();
  // const tValidation = useTranslationsWithFallback();

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "data.session",
  });

  const appendDefault = () =>
    append({
      matchNumber: 1,
      half: Half.FIRST,
      contestants: {
        firstPair: { first: "", second: "" },
        secondPair: { first: "", second: "" },
      },
      opponentTeamName: "",
    });

  return (
    <Box>
      <Text color="gray.500" mb={2}>
        {props.label}
      </Text>

      <VStack spacing={4} align="stretch">
        {fields.map((field, idx) => (
          <Box key={field.id} borderWidth="1px" p={3} borderRadius="md">
            <VStack spacing={3} align="stretch">
              <HStack spacing={3}>
                <Controller
                  control={form.control}
                  name={`data.session.${idx}.matchNumber`}
                  //defaultValue={field.matchNumber ?? 1}
                  render={({ field: f }) => (
                    <NumberInput
                      min={1}
                      value={f.value}
                      onChange={(v) => f.onChange(Number(v))}
                    >
                      <NumberInputField placeholder="Numer meczu" />
                    </NumberInput>
                  )}
                />

                <Controller
                  control={form.control}
                  name={`data.session.${idx}.half`}
                  //defaultValue={field.half ?? Half.FIRST}
                  render={({ field: f }) => (
                    <Select
                      value={f.value}
                      onChange={(e) => f.onChange(e.target.value as Half)}
                    >
                      <option value={Half.FIRST}>{Half.FIRST}</option>
                      <option value={Half.SECOND}>{Half.SECOND}</option>
                    </Select>
                  )}
                />

                <IconButton
                  aria-label="Usuń sesję"
                  icon={<MdDelete />}
                  colorScheme="red"
                  onClick={() => remove(idx)}
                />
              </HStack>

              <Text fontSize="sm">Pierwsza para</Text>
              <HStack spacing={2}>
                <Controller
                  control={form.control}
                  name={`data.session.${idx}.contestants.firstPair.first`}
                  //defaultValue={field.contestants?.firstPair?.first ?? ""}
                  render={({ field: f }) => (
                    <Select
                      placeholder="Zawodnik A"
                      value={f.value}
                      onChange={(e) => f.onChange(e.target.value)}
                    >
                      {(props.people ?? []).map((m) => (
                        <option key={m.id} value={m.id}>
                          {m.nickname
                            ? m.nickname
                            : `${m.name.firstName} ${m.name.lastName}`}
                        </option>
                      ))}
                    </Select>
                  )}
                />
                <Controller
                  control={form.control}
                  name={`data.session.${idx}.contestants.firstPair.second`}
                  //defaultValue={field.contestants?.firstPair?.second ?? ""}
                  render={({ field: f }) => (
                    <Select
                      placeholder="Zawodnik B"
                      value={f.value}
                      onChange={(e) => f.onChange(e.target.value)}
                    >
                      {(props.people ?? []).map((m) => (
                        <option key={m.id} value={m.id}>
                          {m.nickname
                            ? m.nickname
                            : `${m.name.firstName} ${m.name.lastName}`}
                        </option>
                      ))}
                    </Select>
                  )}
                />
              </HStack>

              <Text fontSize="sm">Druga para</Text>
              <HStack spacing={2}>
                <Controller
                  control={form.control}
                  name={`data.session.${idx}.contestants.secondPair.first`}
                  //defaultValue={field.contestants?.secondPair?.first ?? ""}
                  render={({ field: f }) => (
                    <Select
                      placeholder="Zawodnik C"
                      value={f.value}
                      onChange={(e) => f.onChange(e.target.value)}
                    >
                      {(props.people ?? []).map((m) => (
                        <option key={m.id} value={m.id}>
                          {m.nickname
                            ? m.nickname
                            : `${m.name.firstName} ${m.name.lastName}`}
                        </option>
                      ))}
                    </Select>
                  )}
                />
                <Controller
                  control={form.control}
                  name={`data.session.${idx}.contestants.secondPair.second`}
                  // defaultValue={field.contestants?.secondPair?.second ?? ""}
                  render={({ field: f }) => (
                    <Select
                      placeholder="Zawodnik D"
                      value={f.value}
                      onChange={(e) => f.onChange(e.target.value)}
                    >
                      {(props.people ?? []).map((m) => (
                        <option key={m.id} value={m.id}>
                          {m.nickname
                            ? m.nickname
                            : `${m.name.firstName} ${m.name.lastName}`}
                        </option>
                      ))}
                    </Select>
                  )}
                />
              </HStack>

              <Controller
                control={form.control}
                name={`data.session.${idx}.opponentTeamName`}
                //defaultValue={field.opponentTeamName ?? ""}
                render={({ field: f }) => (
                  <Input
                    placeholder="Nazwa zespołu przeciwnika (opcjonalne)"
                    {...f}
                  />
                )}
              />
            </VStack>
          </Box>
        ))}

        <HStack>
          <Button leftIcon={<MdAdd />} onClick={appendDefault} size="sm">
            Dodaj sesję
          </Button>
        </HStack>
      </VStack>
    </Box>
  );
}
