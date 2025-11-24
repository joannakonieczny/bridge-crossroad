import React, { useState } from "react";
import {
  Box,
  HStack,
  VStack,
  Select,
  Button,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
} from "@chakra-ui/react";

export default function FiltersBar() {
  const [scope, setScope] = useState("all"); // "all" = Wszystkie, "mine" = Moje
  const [activity, setActivity] = useState("active"); // "active" | "inactive" | "all"
  const [group, setGroup] = useState("");
  const [frequency, setFrequency] = useState("");
  const [experience, setExperience] = useState("");
  const [trainingGroup, setTrainingGroup] = useState("");
  const [biddingSystem, setBiddingSystem] = useState("");

  return (
    <Box bg="bg" p={4} borderRadius="md">
      {/* large screens: horizontal filters */}
      <HStack
        spacing={3}
        flexWrap="wrap"
        display={{ base: "none", md: "none", lg: "flex" }}
      >
        <Select
          value={scope}
          onChange={(e) => setScope(e.target.value)}
          width="150px"
        >
          <option value="all">Wszystkie</option>
          <option value="mine">Moje</option>
        </Select>
        <Select
          value={activity}
          onChange={(e) => setActivity(e.target.value)}
          width="150px"
        >
          <option value="active">Aktywne</option>
          <option value="inactive">Nieaktywne</option>
          <option value="all">Wszystkie</option>
        </Select>
        <Select
          value={group}
          onChange={(e) => setGroup(e.target.value)}
          placeholder="Grupa"
          width="160px"
        >
          <option value="akademicka">Akademicka</option>
          <option value="lokalna">Lokalna</option>
          <option value="regionalna">Regionalna</option>
        </Select>
        <Select
          value={frequency}
          onChange={(e) => setFrequency(e.target.value)}
          placeholder="Częstotliwość"
          width="160px"
        >
          <option value="any">Dowolna</option>
          <option value="one-off">Jednorazowo</option>
          <option value="recurring">Cyklicznie lub kilka razy</option>
          <option value="seasonal">Sezon lub dłużej</option>
        </Select>
        <Select
          value={experience}
          onChange={(e) => setExperience(e.target.value)}
          placeholder="Doświadczenie"
          width="170px"
        >
          <option value="any">Dowolne</option>
          <option value="<1">mniej niż rok</option>
          <option value="1">1 rok</option>
          <option value="2">2 lata</option>
          <option value="3">3 lata</option>
          <option value="4">4 lata</option>
          <option value="5+">5+ lat</option>
          <option value="10+">10+ lat</option>
          <option value="15+">15+ lat</option>
        </Select>
        <Select
          value={trainingGroup}
          onChange={(e) => setTrainingGroup(e.target.value)}
          placeholder="Grupa treningowa"
          width="180px"
        >
          <option value="basic">Podstawowa</option>
          <option value="intermediate">Średniozaawansowana</option>
          <option value="advanced">Zaawansowana</option>
          <option value="none">Nie biorę udziału w zajęciach</option>
        </Select>
        <Select
          value={biddingSystem}
          onChange={(e) => setBiddingSystem(e.target.value)}
          placeholder="System licytacyjny"
          width="200px"
        >
          <option value="strefa">Strefa</option>
          <option value="wspolny-jezyk">Wspólny Język</option>
          <option value="dubeltowka">Dubeltówka</option>
          <option value="sayc">SAYC (Standard American Yellow Card)</option>
          <option value="lepszy-mlodszy">Lepszy Młodszy</option>
          <option value="sso">SSO (System słabych otwarć)</option>
          <option value="totolotek">Totolotek</option>
          <option value="naturalny">Naturalny</option>
          <option value="other">Własny / inny</option>
        </Select>
        <Button
          ml="auto"
          colorScheme="gray"
          variant="outline"
          onClick={() => {
            setScope("all");
            setActivity("active");
            setGroup("");
            setFrequency("");
            setExperience("");
            setTrainingGroup("");
            setBiddingSystem("");
          }}
        >
          Wyczyść
        </Button>
      </HStack>

      {/* md and smaller: accordion with column layout */}
      <Accordion
        allowToggle
        display={{ base: "block", md: "block", lg: "none" }}
      >
        <AccordionItem border="none">
          <AccordionButton px={0} _hover={{ bg: "transparent" }}>
            <Box flex="1" textAlign="left" fontWeight="semibold">
              Filtry
            </Box>
            <AccordionIcon />
          </AccordionButton>
          <AccordionPanel px={0} pt={3}>
            <VStack spacing={3} align="stretch">
              <Select
                value={scope}
                onChange={(e) => setScope(e.target.value)}
                width="100%"
              >
                <option value="all">Wszystkie</option>
                <option value="mine">Moje</option>
              </Select>
              <Select
                value={activity}
                onChange={(e) => setActivity(e.target.value)}
                width="100%"
              >
                <option value="active">Aktywne</option>
                <option value="inactive">Nieaktywne</option>
                <option value="all">Wszystkie</option>
              </Select>
              <Select
                value={group}
                onChange={(e) => setGroup(e.target.value)}
                placeholder="Grupa"
                width="100%"
              >
                <option value="akademicka">Akademicka</option>
                <option value="lokalna">Lokalna</option>
                <option value="regionalna">Regionalna</option>
              </Select>
              <Select
                value={frequency}
                onChange={(e) => setFrequency(e.target.value)}
                placeholder="Częstotliwość"
                width="100%"
              >
                <option value="any">Dowolna</option>
                <option value="one-off">Jednorazowo</option>
                <option value="recurring">Cyklicznie lub kilka razy</option>
                <option value="seasonal">Sezon lub dłużej</option>
              </Select>
              <Select
                value={experience}
                onChange={(e) => setExperience(e.target.value)}
                placeholder="Doświadczenie"
                width="100%"
              >
                <option value="any">Dowolne</option>
                <option value="<1">mniej niż rok</option>
                <option value="1">1 rok</option>
                <option value="2">2 lata</option>
                <option value="3">3 lata</option>
                <option value="4">4 lata</option>
                <option value="5+">5+ lat</option>
                <option value="10+">10+ lat</option>
                <option value="15+">15+ lat</option>
              </Select>
              <Select
                value={trainingGroup}
                onChange={(e) => setTrainingGroup(e.target.value)}
                placeholder="Grupa treningowa"
                width="100%"
              >
                <option value="basic">Podstawowa</option>
                <option value="intermediate">Średniozaawansowana</option>
                <option value="advanced">Zaawansowana</option>
                <option value="none">Nie biorę udziału w zajęciach</option>
              </Select>
              <Select
                value={biddingSystem}
                onChange={(e) => setBiddingSystem(e.target.value)}
                placeholder="System licytacyjny"
                width="100%"
              >
                <option value="strefa">Strefa</option>
                <option value="wspolny-jezyk">Wspólny Język</option>
                <option value="dubeltowka">Dubeltówka</option>
                <option value="sayc">SAYC (Standard American Yellow Card)</option>
                <option value="lepszy-mlodszy">Lepszy Młodszy</option>
                <option value="sso">SSO (System słabych otwarć)</option>
                <option value="totolotek">Totolotek</option>
                <option value="naturalny">Naturalny</option>
                <option value="other">Własny / inny</option>
              </Select>
              <Button
                alignSelf="flex-end"
                colorScheme="gray"
                variant="outline"
                onClick={() => {
                  setScope("all");
                  setActivity("active");
                  setGroup("");
                  setFrequency("");
                  setExperience("");
                  setTrainingGroup("");
                  setBiddingSystem("");
                }}
              >
                Wyczyść
              </Button>
            </VStack>
          </AccordionPanel>
        </AccordionItem>
      </Accordion>
    </Box>
  );
}
