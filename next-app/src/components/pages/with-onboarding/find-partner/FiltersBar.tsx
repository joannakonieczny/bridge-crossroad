import React, { useState, useEffect } from "react";
import {
  Box,
  Grid,
  VStack,
  Button,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
} from "@chakra-ui/react";
import { useJoinedGroupsQuery } from "@/lib/queries";
import { useQueryState } from "nuqs";
import { TrainingGroup } from "@/club-preset/training-group";
import {
  BiddingSystem,
  PartnershipPostType,
} from "@/club-preset/partnership-post";
import { useTranslations } from "@/lib/typed-translations";
import SelectInput from "@/components/common/form/SelectInput";

export default function FiltersBar() {
  const t = useTranslations("pages.FindPartner.FiltersBar");
  const tTrainingGroup = useTranslations("common.trainingGroup");
  const tBiddingSystem = useTranslations("common.biddingSystem");

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
  const mainGroupId = groupsArr.find((g) => g?.isMain === true)?.id;

  useEffect(() => {
    if (
      (groupId === null || groupId === undefined || groupId === "") &&
      mainGroupId
    ) {
      setGroupId(String(mainGroupId));
    }
  }, [groupId, mainGroupId, setGroupId]);

  return (
    <Box bg="bg" p={4} borderRadius="md">
      <Grid
        gap={3}
        alignItems="center"
        display={{ base: "none", md: "none", lg: "grid" }}
        templateColumns={{ lg: "150px 160px 160px 170px 180px auto" }}
      >
        <SelectInput
          value={activity}
          onChange={(e) => setActivityParam(e.target.value || null)}
          options={[
            { value: "active", label: t("activity.active") },
            { value: "inactive", label: t("activity.inactive") },
          ]}
          onSelectProps={{ width: "150px" }}
        />

        <SelectInput
          value={groupId ?? ""}
          onChange={(e) => setGroupId(e.target.value || null)}
          placeholder={t("placeholders.group")}
          emptyValueLabel={t("allGroups")}
          options={groupsArr.map((g) => ({
            value: String(g.id),
            label: g.name,
          }))}
          onSelectProps={{ width: "160px" }}
        />

        <SelectInput
          value={frequency}
          onChange={(e) => setFrequencyParam(e.target.value || null)}
          placeholder={t("placeholders.frequency")}
          options={[
            { value: "any", label: t("frequencyOptions.any") },
            {
              value: PartnershipPostType.SINGLE,
              label: t("frequencyOptions.SINGLE"),
            },
            {
              value: PartnershipPostType.PERIOD,
              label: t("frequencyOptions.PERIOD"),
            },
          ]}
          onSelectProps={{ width: "160px" }}
        />

        <SelectInput
          value={experience}
          onChange={(e) => setExperienceParam(e.target.value || null)}
          placeholder={t("placeholders.experience")}
          options={[
            { value: "any", label: t("experienceOptions.any") },
            { value: "<1", label: t("experienceOptions.<1") },
            { value: "1", label: t("experienceOptions.1") },
            { value: "2", label: t("experienceOptions.2") },
            { value: "3", label: t("experienceOptions.3") },
            { value: "4", label: t("experienceOptions.4") },
            { value: "5+", label: t("experienceOptions.5+") },
            { value: "10+", label: t("experienceOptions.10+") },
            { value: "15+", label: t("experienceOptions.15+") },
          ]}
          onSelectProps={{ width: "170px" }}
        />

        <SelectInput
          value={trainingGroup ?? ""}
          onChange={(e) => setTrainingGroup(e.target.value || null)}
          placeholder={t("placeholders.trainingGroup")}
          options={[
            TrainingGroup.BASIC,
            TrainingGroup.INTERMEDIATE,
            TrainingGroup.ADVANCED,
            TrainingGroup.NONE,
          ].map((tg) => ({
            value: tg,
            label: tTrainingGroup(tg),
          }))}
          onSelectProps={{ width: "180px" }}
        />

        <Button
          justifySelf="end"
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
      </Grid>

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
              <SelectInput
                value={activity}
                onChange={(e) => setActivityParam(e.target.value || null)}
                options={[
                  { value: "active", label: t("activity.active") },
                  { value: "inactive", label: t("activity.inactive") },
                ]}
                onSelectProps={{ width: "100%" }}
              />

              <SelectInput
                value={groupId ?? ""}
                onChange={(e) => setGroupId(e.target.value || null)}
                placeholder={t("placeholders.group")}
                emptyValueLabel={t("allGroups")}
                options={groupsArr.map((g) => ({
                  value: String(g.id),
                  label: g.name,
                }))}
                onSelectProps={{ width: "100%" }}
              />

              <SelectInput
                value={frequency}
                onChange={(e) => setFrequencyParam(e.target.value || null)}
                placeholder={t("placeholders.frequency")}
                options={[
                  { value: "any", label: t("frequencyOptions.any") },
                  {
                    value: PartnershipPostType.SINGLE,
                    label: t("frequencyOptions.SINGLE"),
                  },
                  {
                    value: PartnershipPostType.PERIOD,
                    label: t("frequencyOptions.PERIOD"),
                  },
                ]}
                onSelectProps={{ width: "100%" }}
              />

              <SelectInput
                value={experience}
                onChange={(e) => setExperienceParam(e.target.value || null)}
                placeholder={t("placeholders.experience")}
                options={[
                  { value: "any", label: t("experienceOptions.any") },
                  { value: "<1", label: t("experienceOptions.<1") },
                  { value: "1", label: t("experienceOptions.1") },
                  { value: "2", label: t("experienceOptions.2") },
                  { value: "3", label: t("experienceOptions.3") },
                  { value: "4", label: t("experienceOptions.4") },
                  { value: "5+", label: t("experienceOptions.5+") },
                  { value: "10+", label: t("experienceOptions.10+") },
                  { value: "15+", label: t("experienceOptions.15+") },
                ]}
                onSelectProps={{ width: "100%" }}
              />

              <SelectInput
                value={trainingGroup ?? ""}
                onChange={(e) => setTrainingGroup(e.target.value || null)}
                placeholder={t("placeholders.trainingGroup")}
                options={[
                  TrainingGroup.BASIC,
                  TrainingGroup.INTERMEDIATE,
                  TrainingGroup.ADVANCED,
                  TrainingGroup.NONE,
                ].map((tg) => ({
                  value: tg,
                  label: tTrainingGroup(tg),
                }))}
                onSelectProps={{ width: "100%" }}
              />

              <SelectInput
                value={biddingSystem}
                onChange={(e) => setBiddingSystem(e.target.value)}
                placeholder={t("placeholders.biddingSystem")}
                options={[
                  BiddingSystem.ZONE,
                  BiddingSystem.COMMON_LANGUAGE,
                  BiddingSystem.DOUBLETON,
                  BiddingSystem.SAYC,
                  BiddingSystem.BETTER_MINOR,
                  BiddingSystem.WEAK_OPENINGS_SSO,
                  BiddingSystem.TOTOLOTEK,
                  BiddingSystem.NATURAL,
                  BiddingSystem.OTHER,
                ].map((bs) => ({
                  value: bs,
                  label: tBiddingSystem(bs),
                }))}
                onSelectProps={{ width: "100%" }}
              />

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
