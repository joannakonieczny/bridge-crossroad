import React, { useState, useEffect } from "react";
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
import { useJoinedGroupsQuery } from "@/lib/queries";
import { useQueryState } from "nuqs";
import { GroupIdType } from "@/schemas/model/group/group-types";
import { PartnershipPostType } from "@/club-preset/partnership-post";

export default function FiltersBar() {
  const [scope, setScope] = useState("all"); // "all" = Wszystkie, "mine" = Moje
  // sync activity with URL param "activity" — possible values: "active" | "inactive"
  const [activityParamRaw, setActivityParam] = useQueryState("activity");
  const activity = activityParamRaw ? String(activityParamRaw) : "active";

  // sync selected group with URL param `groupId`
  const [groupId, setGroupId] = useQueryState("groupId");
  // sync frequency with URL param `frequency` (values: "any" | "SINGLE" | "PERIOD")
  const [frequencyParamRaw, setFrequencyParam] = useQueryState("frequency");
  const frequency = frequencyParamRaw ? String(frequencyParamRaw) : "any";

  // sync experience with URL param `experience` ("any" | "SINGLE" | "PERIOD" | "<1" | "1" | "2" | ...)
  const [experienceParamRaw, setExperienceParam] = useQueryState("experience");
  const experience = experienceParamRaw ? String(experienceParamRaw) : "any";

  // sync trainingGroup with URL param `trainingGroup`
  const [trainingGroup, setTrainingGroup] = useQueryState("trainingGroup");
  const [biddingSystem, setBiddingSystem] = useState("");

  const groupsQuery = useJoinedGroupsQuery();
  const groupsRaw = groupsQuery.data as any;
  const groupsArr = Array.isArray(groupsRaw) ? groupsRaw : groupsRaw?.data ?? [];

  const mainGroupId: GroupIdType | undefined = (() => {
    const arr = Array.isArray(groupsRaw) ? groupsRaw : groupsRaw?.data ?? [];
    const main = (arr || []).find((g: any) => g?.isMain === true);
    if (!main) return undefined;
    return (main.id ?? main._id ?? main._id?.toString?.() ?? undefined) as GroupIdType | undefined;
  })();

  useEffect(() => {
    if ((groupId === null || groupId === undefined || groupId === "") && mainGroupId) {
      setGroupId(String(mainGroupId));
    }
  }, [groupId, mainGroupId, setGroupId]);

  return (
    <Box bg="bg" p={4} borderRadius="md">
      <HStack
        spacing={3}
        flexWrap="wrap"
        display={{ base: "none", md: "none", lg: "flex" }}
      >
        <Select
          value={activity}
          onChange={(e) => setActivityParam(e.target.value || null)}
          width="150px"
        >
          <option value="active">Aktywne</option>
          <option value="inactive">Nieaktywne</option>
        </Select>

        <Select
          value={groupId ?? ""}
          onChange={(e) => setGroupId(e.target.value || null)}
          placeholder="Grupa"
          width="160px"
        >
          <option value="">Wszystkie grupy</option>
          {groupsArr.map((g: any) => {
            const id = g.id ?? g._id ?? String(g._id ?? "");
            const label = g.name ?? g.title ?? g.displayName ?? id;
            return (
              <option key={id} value={id}>
                {label}
              </option>
            );
          })}
        </Select>

        <Select
          value={frequency}
          onChange={(e) => setFrequencyParam(e.target.value || null)}
          placeholder="Częstotliwość"
          width="160px"
        >
          <option value="any">Dowolna</option>
          <option value={PartnershipPostType.SINGLE}>Pojedyńcza</option>
          <option value={PartnershipPostType.PERIOD}>Okresowa</option>
        </Select>

        <Select
          value={experience}
          onChange={(e) => setExperienceParam(e.target.value || null)}
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
          value={trainingGroup ?? ""}
          onChange={(e) => setTrainingGroup(e.target.value || null)}
          placeholder="Grupa treningowa"
          width="180px"
        >
          <option value="basic">Podstawowa</option>
          <option value="intermediate">Średniozaawansowana</option>
          <option value="advanced">Zaawansowana</option>
          <option value="none">Nie biorę udziału w zajęciach</option>
        </Select>

        <Button
          ml="auto"
          colorScheme="gray"
          variant="outline"
          onClick={() => {
            setScope("all");
            setActivityParam(null);
            setGroupId(null);
            setFrequencyParam(null);
            setExperienceParam(null);
            setTrainingGroup(null);
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
                onChange={(e) => setActivityParam(e.target.value || null)}
                width="100%"
              >
                <option value="active">Aktywne</option>
                <option value="inactive">Nieaktywne</option>
              </Select>

              <Select
                value={groupId ?? ""}
                onChange={(e) => setGroupId(e.target.value || null)}
                placeholder="Grupa"
                width="100%"
              >
                <option value="">Wszystkie grupy</option>
                {groupsArr.map((g: any) => {
                  const id = g.id ?? g._id ?? String(g._id ?? "");
                  const label = g.name ?? g.title ?? g.displayName ?? id;
                  return (
                    <option key={id} value={id}>
                      {label}
                    </option>
                  );
                })}
              </Select>

              <Select
                value={frequency}
                onChange={(e) => setFrequencyParam(e.target.value || null)}
                placeholder="Częstotliwość"
                width="100%"
              >
                <option value="any">Dowolna</option>
                <option value={PartnershipPostType.SINGLE}>Pojedyńcza</option>
                <option value={PartnershipPostType.PERIOD}>Okresowa</option>
              </Select>

              <Select
                value={experience}
                onChange={(e) => setExperienceParam(e.target.value || null)}
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
                value={trainingGroup ?? ""}
                onChange={(e) => setTrainingGroup(e.target.value || null)}
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
                  setActivityParam(null);
                  setGroupId(null);
                  setFrequencyParam(null);
                  setExperienceParam(null);
                  setTrainingGroup(null);
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
