import React from "react";
import {
  Box,
  OrderedList,
  ListItem,
  SimpleGrid,
  Spinner,
  Center,
  Stack,
} from "@chakra-ui/react";
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
} from "@chakra-ui/react";
import { EventType } from "@/club-preset/event-type";
import ResponsiveHeading from "@/components/common/texts/ResponsiveHeading";
import ResponsiveText from "@/components/common/texts/ResponsiveText";
import { useTranslations } from "@/lib/typed-translations";
import { getPersonLabel } from "@/util/formatters";
import type { EventDataTypePopulated } from "@/schemas/model/event/event-types";
import type { UserTypeBasic } from "@/schemas/model/user/user-types";

function PairInline({
  first,
  second,
}: {
  first?: UserTypeBasic;
  second?: UserTypeBasic;
}) {
  return (
    <>
      <ResponsiveText as="span">{getPersonLabel(first)}</ResponsiveText>
      <ResponsiveText as="span" mx={1} color="border.400">
        /
      </ResponsiveText>
      <ResponsiveText as="span">{getPersonLabel(second)}</ResponsiveText>
    </>
  );
}

export default function EventSpecificData({
  eventData,
  loading,
}: {
  eventData?: EventDataTypePopulated;
  loading?: boolean;
}) {
  const t = useTranslations("components.EventPage.EventSpecificData");
  const tTurnamentTypes = useTranslations("common.tournamentType");
  if (loading || !eventData) {
    return (
      <Box bgColor="bg" p={4}>
        <Center py={6}>
          <Spinner />
        </Center>
      </Box>
    );
  }

  switch (eventData.type) {
    case EventType.TOURNAMENT: {
      return (
        <Box bgColor="bg" p={4}>
          <ResponsiveHeading
            text={t("tournamentHeading")}
            fontSize="sm"
            barOrientation="horizontal"
          />

          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4} mb={2}>
            <Box>
              <ResponsiveText>
                <b>{t("labels.type")}</b>{" "}
                {eventData?.tournamentType
                  ? tTurnamentTypes(eventData.tournamentType)
                  : "-"}
              </ResponsiveText>
            </Box>
            <Box>
              <ResponsiveText>
                <b>{t("labels.arbiter")}</b>{" "}
                {eventData?.arbiter ? getPersonLabel(eventData.arbiter) : "-"}
              </ResponsiveText>
            </Box>
          </SimpleGrid>

          <ResponsiveText fontWeight="bold">{t("pairs")}</ResponsiveText>
          <OrderedList mt={1} spacing={2}>
            {eventData.contestantsPairs.map((p, i) => (
              <ListItem
                key={`${p.first?.id ?? `f${i}`}-${p.second?.id ?? `s${i}`}`}
                sx={{
                  "::-webkit-list-marker": {
                    color: "var(--chakra-colors-accent-500)",
                  },
                  "::marker": { color: "var(--chakra-colors-accent-500)" },
                }}
              >
                <PairInline first={p.first} second={p.second} />
              </ListItem>
            ))}
          </OrderedList>
        </Box>
      );
    }

    case EventType.LEAGUE_MEETING: {
      return (
        <Box bgColor="bg" p={4}>
          <ResponsiveHeading
            text={t("leagueHeading")}
            fontSize="sm"
            barOrientation="horizontal"
          />
          <ResponsiveText mb={3}>
            <b>{t("labels.type")}</b>{" "}
            {eventData?.tournamentType
              ? tTurnamentTypes(eventData.tournamentType)
              : "-"}
          </ResponsiveText>

          <TableContainer
            mt={3}
            display={{ base: "none", md: "none", lg: "block" }}
          >
            <Table variant="simple" size="sm">
              <Thead>
                <Tr>
                  <Th w="1%" whiteSpace="nowrap">
                    {t("league.table.match")}
                  </Th>
                  <Th w="1%" whiteSpace="nowrap">
                    {t("league.table.half")}
                  </Th>
                  <Th>{t("league.table.pair1")}</Th>
                  <Th>{t("league.table.pair2")}</Th>
                  <Th>{t("league.table.opponent")}</Th>
                </Tr>
              </Thead>
              <Tbody>
                {eventData.session.map((s, idx) => {
                  const isMatchOdd = (s.matchNumber ?? 0) % 2 === 1;
                  const isRowOdd = idx % 2 === 1;
                  return (
                    // the "1%" trick makes the column shrink to fit content
                    <Tr key={s.id ?? idx}>
                      <Td
                        w="1%"
                        whiteSpace="nowrap"
                        bg={isMatchOdd ? "accent.300" : "secondary.300"}
                        color="white"
                        fontWeight="semibold"
                        textAlign="center"
                      >
                        {s.matchNumber}
                      </Td>

                      <Td
                        w="1%"
                        whiteSpace="nowrap"
                        bg={isRowOdd ? "border.50" : "border.100"}
                      >
                        {s.half === Half.FIRST
                          ? t("half.first")
                          : s.half === Half.SECOND
                          ? t("half.second")
                          : s.half}
                      </Td>

                      <Td>
                        <PairInline
                          first={s.contestants.firstPair.first}
                          second={s.contestants.firstPair.second}
                        />
                      </Td>
                      <Td>
                        <PairInline
                          first={s.contestants.secondPair.first}
                          second={s.contestants.secondPair.second}
                        />
                      </Td>
                      <Td>
                        <ResponsiveText as="span">
                          {s.opponentTeamName ?? "-"}
                        </ResponsiveText>
                      </Td>
                    </Tr>
                  );
                })}
              </Tbody>
            </Table>
          </TableContainer>

          <Box display={{ base: "block", md: "block", lg: "none" }} mt={3}>
            <Stack spacing={3}>
              {eventData.session.map((s, idx) => {
                const isMatchOdd = (s.matchNumber ?? 0) % 2 === 1;
                const isRowOdd = idx % 2 === 1;
                return (
                  <Box
                    key={s.id ?? idx}
                    p={3}
                    borderWidth={1}
                    borderColor="border.100"
                    borderRadius="md"
                    bg="bg"
                  >
                    <SimpleGrid
                      columns={3}
                      spacing={2}
                      alignItems="center"
                      mb={2}
                    >
                      <Box
                        bg={isMatchOdd ? "accent.300" : "secondary.300"}
                        color="bg"
                        w="48px"
                        h="48px"
                        minW="48px"
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                        flexDirection="column"
                        borderRadius="md"
                      >
                        <ResponsiveText fontSize="xs" color="bg" lineHeight="1">
                          {t("league.table.match")}
                        </ResponsiveText>
                        <ResponsiveText
                          fontWeight="semibold"
                          fontSize="lg"
                          lineHeight="1"
                        >
                          {s.matchNumber}
                        </ResponsiveText>
                      </Box>
                      <Box
                        bg={isRowOdd ? "border.50" : "border.100"}
                        p={2}
                        borderRadius="sm"
                      >
                        <ResponsiveText fontSize="xs" color="border.500">
                          {t("league.table.half")}
                        </ResponsiveText>
                        <ResponsiveText>
                          {s.half === Half.FIRST
                            ? t("half.first")
                            : s.half === Half.SECOND
                            ? t("half.second")
                            : s.half}
                        </ResponsiveText>
                      </Box>
                      <Box>
                        <ResponsiveText fontSize="xs" color="border.500">
                          {t("league.table.opponent")}
                        </ResponsiveText>
                        <ResponsiveText>
                          {s.opponentTeamName ?? "-"}
                        </ResponsiveText>
                      </Box>
                    </SimpleGrid>
                    <Box>
                      <ResponsiveText fontSize="xs" color="border.500">
                        {t("pairs")}
                      </ResponsiveText>
                      <Box
                        mt={1}
                        display="flex"
                        alignItems="center"
                        flexWrap="wrap"
                      >
                        <Box mr={2}>
                          <PairInline
                            first={s.contestants.firstPair.first}
                            second={s.contestants.firstPair.second}
                          />
                        </Box>
                        <ResponsiveText as="span" mx={2} color="border.400">
                          -
                        </ResponsiveText>
                        <Box ml={2}>
                          <PairInline
                            first={s.contestants.secondPair.first}
                            second={s.contestants.secondPair.second}
                          />
                        </Box>
                      </Box>
                    </Box>
                  </Box>
                );
              })}
            </Stack>
          </Box>
        </Box>
      );
    }

    case EventType.TRAINING: {
      return (
        <Box bgColor="bg" p={4}>
          <ResponsiveHeading
            text={t("trainingHeading")}
            fontSize="sm"
            barOrientation="horizontal"
          />
          <ResponsiveText>
            <b>{t("labels.coach")}</b>{" "}
            {eventData?.coach ? getPersonLabel(eventData.coach) : "-"}
          </ResponsiveText>
          <ResponsiveText>
            <b>{t("labels.topic")}</b> {eventData?.topic}
          </ResponsiveText>
        </Box>
      );
    }

    default: {
      return null;
    }
  }
}
