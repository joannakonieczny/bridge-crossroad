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
import type { GroupIdType } from "@/schemas/model/group/group-types";
import { TrainingGroup } from "@/club-preset/training-group";
import { PartnershipPostType } from "@/club-preset/partnership-post";
import { useTranslations } from "@/lib/typed-translations";

export default function FiltersBar() {
  const t = useTranslations("pages.FindPartner.FiltersBar");
  const [activityParamRaw, setActivityParam] = useQueryState("activity");
  const activity = activityParamRaw ? String(activityParamRaw) : "active";

  const [groupId, setGroupId] = useQueryState("groupId");
  const [frequencyParamRaw, setFrequencyParam] = useQueryState("frequency");
  const frequency = frequencyParamRaw ? String(frequencyParamRaw) : "any";

  const [experienceParamRaw, setExperienceParam] = useQueryState("experience");
  const experience = experienceParamRaw ? String(experienceParamRaw) : "any";

  const [trainingGroup, setTrainingGroup] = useQueryState("trainingGroup");
  const [biddingSystem, setBiddingSystem] = useState(""); //currently no bidding system filter

  const groupsQuery = useJoinedGroupsQuery();
  const groupsArr = Array.isArray(groupsQuery.data) ? groupsQuery.data : [];

  const mainGroupId: GroupIdType | undefined = (() => {
    const arr = Array.isArray(groupsArr) ? groupsArr : [];
    const main = (arr).find((g) => g?.isMain === true);
    if (!main) return undefined;
    return (main.id ?? undefined) as GroupIdType | undefined;
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
          <option value="active">{t("activity.active")}</option>
          <option value="inactive">{t("activity.inactive")}</option>
        </Select>

        <Select
          value={groupId ?? ""}
          onChange={(e) => setGroupId(e.target.value || null)}
          placeholder={t("placeholders.group")}
          width="160px"
        >
          <option value="">{t("allGroups")}</option>
          {groupsArr.map((g) => {
            const id = g.id;
            const label = g.name;
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
          placeholder={t("placeholders.frequency")}
          width="160px"
        >
          <option value="any">{t("frequencyOptions.any")}</option>
          <option value={PartnershipPostType.SINGLE}>{t("frequencyOptions.SINGLE")}</option>
          <option value={PartnershipPostType.PERIOD}>{t("frequencyOptions.PERIOD")}</option>
        </Select>

        <Select
          value={experience}
          onChange={(e) => setExperienceParam(e.target.value || null)}
          placeholder={t("placeholders.experience")}
          width="170px"
        >
          <option value="any">{t("experienceOptions.any")}</option>
          <option value="<1">{t("experienceOptions.<1")}</option>
          <option value="1">{t("experienceOptions.1")}</option>
          <option value="2">{t("experienceOptions.2")}</option>
          <option value="3">{t("experienceOptions.3")}</option>
          <option value="4">{t("experienceOptions.4")}</option>
          <option value="5+">{t("experienceOptions.5+")}</option>
          <option value="10+">{t("experienceOptions.10+")}</option>
          <option value="15+">{t("experienceOptions.15+")}</option>
        </Select>

        <Select
          value={trainingGroup ?? ""}
          onChange={(e) => setTrainingGroup(e.target.value || null)}
          placeholder={t("placeholders.trainingGroup")}
          width="180px"
        >
          <option value={TrainingGroup.BASIC}>{t("trainingGroupOptions.BASIC")}</option>
          <option value={TrainingGroup.INTERMEDIATE}>{t("trainingGroupOptions.INTERMEDIATE")}</option>
          <option value={TrainingGroup.ADVANCED}>{t("trainingGroupOptions.ADVANCED")}</option>
          <option value={TrainingGroup.NONE}>{t("trainingGroupOptions.NONE")}</option>
        </Select>

        <Button
          ml="auto"
          colorScheme="gray"
          variant="outline"
          onClick={() => {
            setActivityParam(null);
            setGroupId(null);
            setFrequencyParam(null);
            setExperienceParam(null);
            setTrainingGroup(null);
            setBiddingSystem("");
          }}
        >
          {t("button.clear")}
        </Button>
      </HStack>

      <Accordion
        allowToggle
        display={{ base: "block", md: "block", lg: "none" }}
      >
        <AccordionItem border="none">
          <AccordionButton px={0} _hover={{ bg: "transparent" }}>
            <Box flex="1" textAlign="left" fontWeight="semibold">
              {t("button.filtersLabel")}
            </Box>
            <AccordionIcon />
          </AccordionButton>
          <AccordionPanel px={0} pt={3}>
            <VStack spacing={3} align="stretch">
              <Select
                value={activity}
                onChange={(e) => setActivityParam(e.target.value || null)}
                width="100%"
              >
                <option value="active">{t("activity.active")}</option>
                <option value="inactive">{t("activity.inactive")}</option>
              </Select>

              <Select
                value={groupId ?? ""}
                onChange={(e) => setGroupId(e.target.value || null)}
                placeholder={t("placeholders.group")}
                width="100%"
              >
                <option value="">{t("allGroups")}</option>
                {groupsArr.map((g) => {
                  const id = g.id;
                  const label = g.name;
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
                placeholder={t("placeholders.frequency")}
                width="100%"
              >
                <option value="any">{t("frequencyOptions.any")}</option>
                <option value={PartnershipPostType.SINGLE}>{t("frequencyOptions.SINGLE")}</option>
                <option value={PartnershipPostType.PERIOD}>{t("frequencyOptions.PERIOD")}</option>
              </Select>

              <Select
                value={experience}
                onChange={(e) => setExperienceParam(e.target.value || null)}
                placeholder={t("placeholders.experience")}
                width="100%"
              >
                <option value="any">{t("experienceOptions.any")}</option>
                <option value="<1">{t("experienceOptions.<1")}</option>
                <option value="1">{t("experienceOptions.1")}</option>
                <option value="2">{t("experienceOptions.2")}</option>
                <option value="3">{t("experienceOptions.3")}</option>
                <option value="4">{t("experienceOptions.4")}</option>
                <option value="5+">{t("experienceOptions.5+")}</option>
                <option value="10+">{t("experienceOptions.10+")}</option>
                <option value="15+">{t("experienceOptions.15+")}</option>
              </Select>

              <Select
                value={trainingGroup ?? ""}
                onChange={(e) => setTrainingGroup(e.target.value || null)}
                placeholder={t("placeholders.trainingGroup")}
                width="100%"
              >
                <option value={TrainingGroup.BASIC}>{t("trainingGroupOptions.BASIC")}</option>
                <option value={TrainingGroup.INTERMEDIATE}>{t("trainingGroupOptions.INTERMEDIATE")}</option>
                <option value={TrainingGroup.ADVANCED}>{t("trainingGroupOptions.ADVANCED")}</option>
                <option value={TrainingGroup.NONE}>{t("trainingGroupOptions.NONE")}</option>
              </Select>

              <Select
                value={biddingSystem}
                onChange={(e) => setBiddingSystem(e.target.value)}
                placeholder={t("placeholders.biddingSystem")}
                width="100%"
              >
                <option value="strefa">{t("biddingSystemOptions.strefa")}</option>
                <option value="wspolny-jezyk">{t("biddingSystemOptions.wspolnyJezyk")}</option>
                <option value="dubeltowka">{t("biddingSystemOptions.dubeltowka")}</option>
                <option value="sayc">{t("biddingSystemOptions.sayc")}</option>
                <option value="lepszy-mlodszy">{t("biddingSystemOptions.lepszyMlodszy")}</option>
                <option value="sso">{t("biddingSystemOptions.sso")}</option>
                <option value="totolotek">{t("biddingSystemOptions.totolotek")}</option>
                <option value="naturalny">{t("biddingSystemOptions.naturalny")}</option>
                <option value="other">{t("biddingSystemOptions.other")}</option>
              </Select>

              <Button
                alignSelf="flex-end"
                colorScheme="gray"
                variant="outline"
                onClick={() => {
                  setActivityParam(null);
                  setGroupId(null);
                  setFrequencyParam(null);
                  setExperienceParam(null);
                  setTrainingGroup(null);
                  setBiddingSystem("");
                }}
              >
                {t("button.clear")}
              </Button>
            </VStack>
          </AccordionPanel>
        </AccordionItem>
      </Accordion>
    </Box>
  );
}
