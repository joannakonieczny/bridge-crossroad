import React, { useState } from "react";
import { Box, HStack, Select, Button, Wrap, WrapItem, Tag } from "@chakra-ui/react";

export default function FiltersBar() {
  const [group, setGroup] = useState("");
  const [frequency, setFrequency] = useState("");
  const [experience, setExperience] = useState("");
  const [trainingGroup, setTrainingGroup] = useState("");

  return (
    <Box bg="bg" p={4} borderRadius="md" boxShadow="sm">
      <HStack spacing={3} flexWrap="wrap">
        <Select
          value={group}
          onChange={(e) => setGroup(e.target.value)}
          placeholder="Grupa"
          width="220px"
        >
          <option value="open">Open</option>
          <option value="women">Kobiety</option>
          <option value="students">Studenci</option>
        </Select>

        <Select
          value={frequency}
          onChange={(e) => setFrequency(e.target.value)}
          placeholder="Częstotliwość"
          width="180px"
        >
          <option value="weekly">Cotygodniowo</option>
          <option value="monthly">Miesięcznie</option>
        </Select>

        <Select
          value={experience}
          onChange={(e) => setExperience(e.target.value)}
          placeholder="Doświadczenie"
          width="220px"
        >
          <option value="beginner">Początkujący</option>
          <option value="intermediate">Średniozaawansowany</option>
          <option value="advanced">Zaawansowany</option>
        </Select>

        <Select
          value={trainingGroup}
          onChange={(e) => setTrainingGroup(e.target.value)}
          placeholder="Grupa treningowa"
          width="220px"
        >
          <option value="basic">Podstawowa</option>
          <option value="coach">Trener</option>
        </Select>

        <Button ml="auto" colorScheme="gray" variant="outline" onClick={() => {
          setGroup("");
          setFrequency("");
          setExperience("");
          setTrainingGroup("");
        }}>
          Wyczyść
        </Button>
      </HStack>

      <Wrap mt={3} spacing={2}>
        <WrapItem>
          <Tag>System: Standard</Tag>
        </WrapItem>
        <WrapItem>
          <Tag>Płeć: Dowolna</Tag>
        </WrapItem>
        <WrapItem>
          <Tag>Online</Tag>
        </WrapItem>
      </Wrap>
    </Box>
  );
}
