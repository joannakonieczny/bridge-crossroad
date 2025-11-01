import React from "react";
import { Controller, Control, useFieldArray } from "react-hook-form";
import {
  VStack,
  HStack,
  Button,
  Select,
  Box,
  Text,
  IconButton,
} from "@chakra-ui/react";
import { MdAdd, MdDelete } from "react-icons/md";
import type { UserTypeBasic } from "@/schemas/model/user/user-types";

type Props = {
  control: Control<any>;
  name: string;
  label?: string;
  people: UserTypeBasic[];
};

export default function ContestantsPairsEditor(props: Props) {
  const { fields, append, remove } = useFieldArray({
    control: props.control,
    name: props.name,
  });

  return (
    <Box>
      <Text color="gray.500" mb={2}>
        {props.label}
      </Text>
      <VStack spacing={3} align="stretch">
        {fields.map((field, idx) => (
          <HStack key={field.id} spacing={2}>
            <Controller
              control={props.control}
              name={`${props.name}.${idx}.first`}
              //defaultValue={field.first ?? ""}
              render={({ field: f }) => (
                <Select placeholder="Zawodnik A" {...f}>
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
              control={props.control}
              name={`${props.name}.${idx}.second`}
              //defaultValue={field.second ?? ""}
              render={({ field: f }) => (
                <Select placeholder="Zawodnik B" {...f}>
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
            <IconButton
              aria-label="Usuń parę"
              icon={<MdDelete />}
              colorScheme="red"
              onClick={() => remove(idx)}
              size="sm"
            />
          </HStack>
        ))}

        <HStack>
          <Button
            leftIcon={<MdAdd />}
            onClick={() => append({ first: "", second: "" })}
            size="sm"
          >
            Dodaj parę
          </Button>
        </HStack>
      </VStack>
    </Box>
  );
}
