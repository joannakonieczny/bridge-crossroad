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
  const tTournamentTypes = useTranslations("common.tournamentType");
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
    case EventType.TOURNAMENT_PAIRS: {
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
                  ? tTournamentTypes(eventData.tournamentType)
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

    case EventType.TOURNAMENT_TEAMS: {
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
                  ? tTournamentTypes(eventData.tournamentType)
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

          <ResponsiveText fontWeight="bold">{t("teams")}</ResponsiveText>
          <Center>
            <OrderedList mt={1} spacing={2}>
              {eventData.teams.map((t, i) => (
                <ListItem
                  key={`${t.name}-${i}`}
                  sx={{
                    "::-webkit-list-marker": {
                      color: "var(--chakra-colors-accent-500)",
                    },
                    "::marker": { color: "var(--chakra-colors-accent-500)" },
                  }}
                >
                  <ResponsiveText as="span">
                    {t.members.map(getPersonLabel).join(" / ")}
                  </ResponsiveText>
                </ListItem>
              ))}
            </OrderedList>
          </Center>
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
              ? tTournamentTypes(eventData.tournamentType)
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
                {(() => {
                  const sessions = eventData.session ?? [];
                  const matches = Math.ceil(sessions.length / 2);
                  const rows: React.ReactNode[] = [];

                  for (let pairIdx = 0; pairIdx < matches; pairIdx++) {
                    const baseIdx = pairIdx * 2;
                    const sFirst = sessions[baseIdx];
                    const sSecond = sessions[baseIdx + 1];
                    const matchNumber = pairIdx + 1;

                    if (sFirst) {
                      rows.push(
                        <Tr key={`session-${pairIdx}-half-0`}>
                          <Td
                            w="1%"
                            whiteSpace="nowrap"
                            bg={
                              matchNumber % 2 === 1
                                ? "accent.300"
                                : "secondary.300"
                            }
                            color="bg"
                            fontWeight="semibold"
                            textAlign="center"
                          >
                            {matchNumber}
                          </Td>
                          <Td
                            w="1%"
                            whiteSpace="nowrap"
                            bg={
                              (pairIdx * 2) % 2 === 1
                                ? "border.50"
                                : "border.100"
                            }
                          >
                            {t("half.first")}
                          </Td>
                          <Td>
                            <PairInline
                              first={sFirst.contestants.firstPair.first}
                              second={sFirst.contestants.firstPair.second}
                            />
                          </Td>
                          <Td>
                            <PairInline
                              first={sFirst.contestants.secondPair.first}
                              second={sFirst.contestants.secondPair.second}
                            />
                          </Td>
                          <Td>
                            <ResponsiveText as="span">
                              {sFirst.opponentTeamName ?? "-"}
                            </ResponsiveText>
                          </Td>
                        </Tr>
                      );
                    }
                    if (sSecond) {
                      rows.push(
                        <Tr key={`session-${pairIdx}-half-1`}>
                          <Td
                            w="1%"
                            whiteSpace="nowrap"
                            bg={
                              matchNumber % 2 === 1
                                ? "accent.300"
                                : "secondary.300"
                            }
                            color="bg"
                            fontWeight="semibold"
                            textAlign="center"
                          >
                            {matchNumber}
                          </Td>
                          <Td
                            w="1%"
                            whiteSpace="nowrap"
                            bg={
                              (pairIdx * 2 + 1) % 2 === 1
                                ? "border.50"
                                : "border.100"
                            }
                          >
                            {t("half.second")}
                          </Td>
                          <Td>
                            <PairInline
                              first={sSecond.contestants.firstPair.first}
                              second={sSecond.contestants.firstPair.second}
                            />
                          </Td>
                          <Td>
                            <PairInline
                              first={sSecond.contestants.secondPair.first}
                              second={sSecond.contestants.secondPair.second}
                            />
                          </Td>
                          <Td>
                            <ResponsiveText as="span">
                              {sSecond.opponentTeamName ?? "-"}
                            </ResponsiveText>
                          </Td>
                        </Tr>
                      );
                    }
                  }

                  return rows;
                })()}
              </Tbody>
            </Table>
          </TableContainer>

          <Box display={{ base: "block", md: "block", lg: "none" }} mt={3}>
            <Stack spacing={3}>
              {(() => {
                const sessions = eventData.session ?? [];
                const matches = Math.ceil(sessions.length / 2);
                const cards: React.ReactNode[] = [];

                for (let pairIdx = 0; pairIdx < matches; pairIdx++) {
                  const baseIdx = pairIdx * 2;
                  const sFirst = sessions[baseIdx];
                  const sSecond = sessions[baseIdx + 1];
                  const matchNumber = pairIdx + 1;
                  const isMatchOdd = matchNumber % 2 === 1;

                  cards.push(
                    <Box
                      key={`match-${pairIdx}`}
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
                          <ResponsiveText
                            fontSize="xs"
                            color="bg"
                            lineHeight="1"
                          >
                            {t("league.table.match")}
                          </ResponsiveText>
                          <ResponsiveText
                            fontWeight="semibold"
                            fontSize="lg"
                            lineHeight="1"
                          >
                            {matchNumber}
                          </ResponsiveText>
                        </Box>
                        <Box p={2} borderRadius="sm">
                          <ResponsiveText fontSize="xs" color="border.500">
                            {t("league.table.half")}
                          </ResponsiveText>
                          <ResponsiveText>
                            {sFirst ? t("half.first") : "-"}
                          </ResponsiveText>
                        </Box>
                        <Box>
                          <ResponsiveText fontSize="xs" color="border.500">
                            {t("league.table.opponent")}
                          </ResponsiveText>
                          <ResponsiveText>
                            {sFirst?.opponentTeamName ?? "-"}
                          </ResponsiveText>
                        </Box>
                      </SimpleGrid>

                      <Box mb={2}>
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
                              first={sFirst?.contestants.firstPair.first}
                              second={sFirst?.contestants.firstPair.second}
                            />
                          </Box>
                          <ResponsiveText as="span" mx={2} color="border.400">
                            -
                          </ResponsiveText>
                          <Box ml={2}>
                            <PairInline
                              first={sFirst?.contestants.secondPair.first}
                              second={sFirst?.contestants.secondPair.second}
                            />
                          </Box>
                        </Box>
                      </Box>

                      {/* second half within same card */}
                      {sSecond && (
                        <>
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
                              <ResponsiveText
                                fontSize="xs"
                                color="bg"
                                lineHeight="1"
                              >
                                {t("league.table.match")}
                              </ResponsiveText>
                              <ResponsiveText
                                fontWeight="semibold"
                                fontSize="lg"
                                lineHeight="1"
                              >
                                {matchNumber}
                              </ResponsiveText>
                            </Box>
                            <Box
                              p={2}
                              borderRadius="sm"
                              bg={
                                (pairIdx * 2 + 1) % 2 === 1
                                  ? "border.50"
                                  : "border.100"
                              }
                            >
                              <ResponsiveText fontSize="xs" color="border.500">
                                {t("league.table.half")}
                              </ResponsiveText>
                              <ResponsiveText>
                                {t("half.second")}
                              </ResponsiveText>
                            </Box>
                            <Box>
                              <ResponsiveText fontSize="xs" color="border.500">
                                {t("league.table.opponent")}
                              </ResponsiveText>
                              <ResponsiveText>
                                {sSecond.opponentTeamName ?? "-"}
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
                                  first={sSecond.contestants.firstPair.first}
                                  second={sSecond.contestants.firstPair.second}
                                />
                              </Box>
                              <ResponsiveText
                                as="span"
                                mx={2}
                                color="border.400"
                              >
                                -
                              </ResponsiveText>
                              <Box ml={2}>
                                <PairInline
                                  first={sSecond.contestants.secondPair.first}
                                  second={sSecond.contestants.secondPair.second}
                                />
                              </Box>
                            </Box>
                          </Box>
                        </>
                      )}
                    </Box>
                  );
                }

                return cards;
              })()}
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
