import React from "react";
import { Box, OrderedList, ListItem, SimpleGrid, Spinner, Center, Stack } from "@chakra-ui/react";
import { Table, Thead, Tbody, Tr, Th, Td, TableContainer } from "@chakra-ui/react";
import { EventType, TournamentType, Half } from "@/club-preset/event-type";
import ResponsiveHeading from "@/components/common/texts/ResponsiveHeading";
import ResponsiveText from "@/components/common/texts/ResponsiveText";
import { useTranslations } from "@/lib/typed-translations";
import type { EventDataTypePopulated, LeagueMeetingDataTypePopulated, TournamentDataTypePopulated, TrainingDataTypePopulated } from "@/schemas/model/event/event-types";
import type { UserTypeBasic } from "@/schemas/model/user/user-types";

export default function EventSpecificData({
  eventType,
  eventData,
  loading,
}: {
  eventType?: EventType;
  eventData?: EventDataTypePopulated;
  loading?: boolean;
}) {
  const t = useTranslations("components.EventPage.EventSpecificData");
  if (loading) {
    return (
      <Box bgColor="bg" p={4}>
        <Center py={6}><Spinner /></Center>
      </Box>
    );
  }
  if (!eventType || !eventData) return null;

  const tournamentTypeOptions = Object.values(TournamentType).map((value) => ({
    value,
    label: t(`tournamentTypes.${value}`),
  }));

  type PairMember = UserTypeBasic | undefined;
  const PairInline = ({ first, second }: { first?: PairMember; second?: PairMember }) => {
    const f = first;
    const s = second;

    const leftLabel: string = f?.name ? `${f.name.firstName ?? ""} ${f.name.lastName ?? ""}`.trim() : "";
    const rightLabel: string = s?.name ? `${s.name.firstName ?? ""} ${s.name.lastName ?? ""}`.trim() : "";
    
    return (
      <>
        <ResponsiveText as="span">{leftLabel}</ResponsiveText>
        <ResponsiveText as="span" mx={1} color="border.400">/</ResponsiveText>
        <ResponsiveText as="span">{rightLabel}</ResponsiveText>
      </>
    );
  };

  switch (eventType) {
    case EventType.TOURNAMENT: {
      const d = eventData as TournamentDataTypePopulated;
      const tournamentTypeLabel = tournamentTypeOptions.find(o => o.value === d.tournamentType)?.label ?? String(d.tournamentType);
      return (
        <Box bgColor="bg" p={4}>
          <ResponsiveHeading text={t("tournamentHeading")} fontSize="sm" barOrientation="horizontal" />

          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4} mb={2}>
            <Box>
              <ResponsiveText><b>{t("labels.type")}</b> {tournamentTypeLabel}</ResponsiveText>
            </Box>
            <Box>
              {(() => {
                const arb = d.arbiter as UserTypeBasic | string | undefined;
                const arbLabel =
                  typeof arb === "string"
                    ? arb
                    : arb?.name
                    ? `${arb.name.firstName ?? ""} ${arb.name.lastName ?? ""}`.trim()
                    : arb?.id
                    ? String(arb.id)
                    : undefined;
                return <ResponsiveText><b>{t("labels.arbiter")}</b> {arbLabel ?? t("noArbiter")}</ResponsiveText>;
              })()}
            </Box>
          </SimpleGrid>

          <ResponsiveText fontWeight="bold">{t("pairs")}</ResponsiveText>
          <OrderedList mt={1} spacing={2}>
            {d.contestantsPairs.map((p, i) => (
              <ListItem
                key={`${p.first?.id ?? `f${i}`}-${p.second?.id ?? `s${i}`}`}
                sx={{ "::-webkit-list-marker": { color: "var(--chakra-colors-accent-500)" }, "::marker": { color: "var(--chakra-colors-accent-500)" } }}
              >
                <PairInline first={p.first} second={p.second} />
              </ListItem>
            ))}
          </OrderedList>
        </Box>
      );
    }

    case EventType.LEAGUE_MEETING: {
      const d = eventData as LeagueMeetingDataTypePopulated;
      const tournamentTypeLabel = tournamentTypeOptions.find(o => o.value === d.tournamentType)?.label ?? String(d.tournamentType);
      return (
        <Box bgColor="bg" p={4}>
          <ResponsiveHeading text={t("leagueHeading")} fontSize="sm" barOrientation="horizontal" />
          <ResponsiveText mb={3}><b>{t("labels.type")}</b> {tournamentTypeLabel}</ResponsiveText>

          <TableContainer mt={3} display={{ base: "none", md: "none", lg: "block" }}>
            <Table variant="simple" size="sm">
              <Thead>
                <Tr>
                  <Th w="1%" whiteSpace="nowrap">{t("league.table.match")}</Th>
                  <Th w="1%" whiteSpace="nowrap">{t("league.table.half")}</Th>
                  <Th>{t("league.table.pair1")}</Th>
                  <Th>{t("league.table.pair2")}</Th>
                  <Th>{t("league.table.opponent")}</Th>
                </Tr>
              </Thead>
              <Tbody>
                {d.session.map((s, idx) => {
                  const isMatchOdd = (s.matchNumber ?? 0) % 2 === 1;
                  const isRowOdd = idx % 2 === 1;
                  return (
                    // the "1%" trick makes the column shrink to fit content
                    <Tr key={s.id ?? idx}>
                      <Td w="1%" whiteSpace="nowrap" bg={isMatchOdd ? "accent.300" : "secondary.300"} color="white" fontWeight="semibold" textAlign="center">
                        {s.matchNumber}
                      </Td>

                      <Td w="1%" whiteSpace="nowrap" bg={isRowOdd ? "border.50" : "border.100"}>
                        {s.half === Half.FIRST ? t("half.first") : s.half === Half.SECOND ? t("half.second") : s.half}
                      </Td>

                      <Td>
                        <PairInline first={s.contestants.firstPair.first} second={s.contestants.firstPair.second} />
                      </Td>
                      <Td>
                        <PairInline first={s.contestants.secondPair.first} second={s.contestants.secondPair.second} />
                      </Td>
                      <Td><ResponsiveText as="span">{s.opponentTeamName ?? "-"}</ResponsiveText></Td>
                    </Tr>
                  );
                })}
              </Tbody>
            </Table>
          </TableContainer>

          <Box display={{ base: "block", md: "block", lg: "none" }} mt={3}>
            <Stack spacing={3}>
              {d.session.map((s, idx) => {
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
                    <SimpleGrid columns={3} spacing={2} alignItems  ="center" mb={2}>
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
                        <ResponsiveText fontSize="xs" color="bg" lineHeight="1">{t("league.table.match")}</ResponsiveText>
                        <ResponsiveText fontWeight="semibold" fontSize="lg" lineHeight="1">{s.matchNumber}</ResponsiveText>
                      </Box>
                      <Box bg={isRowOdd ? "border.50" : "border.100"} p={2} borderRadius="sm">
                        <ResponsiveText fontSize="xs" color="border.500">{t("league.table.half")}</ResponsiveText>
                        <ResponsiveText>{s.half === Half.FIRST ? t("half.first") : s.half === Half.SECOND ? t("half.second") : s.half}</ResponsiveText>
                      </Box>
                      <Box>
                        <ResponsiveText fontSize="xs" color="border.500">{t("league.table.opponent")}</ResponsiveText>
                        <ResponsiveText>{s.opponentTeamName ?? "-"}</ResponsiveText>
                      </Box>
                    </SimpleGrid>
                    <Box>
                      <ResponsiveText fontSize="xs" color="border.500">{t("pairs")}</ResponsiveText>
                      <Box mt={1} display="flex" alignItems="center" flexWrap="wrap">
                        <Box mr={2}>
                          <PairInline first={s.contestants.firstPair.first} second={s.contestants.firstPair.second} />
                        </Box>
                        <ResponsiveText as="span" mx={2} color="border.400">-</ResponsiveText>
                        <Box ml={2}>
                          <PairInline first={s.contestants.secondPair.first} second={s.contestants.secondPair.second} />
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
      const d = eventData as TrainingDataTypePopulated;
      return (
        <Box bgColor="bg" p={4}>
          <ResponsiveHeading text={t("trainingHeading")} fontSize="sm" barOrientation="horizontal" />
          {(() => {
            const coach = d.coach as UserTypeBasic | string | undefined;
            const coachLabel =
              typeof coach === "string"
                ? coach
                : coach?.name
                ? `${coach.name.firstName ?? ""} ${coach.name.lastName ?? ""}`.trim()
                : coach?.id
                ? String(coach.id)
                : undefined;
            return <ResponsiveText><b>{t("labels.coach")}</b> {coachLabel ?? t("noCoach")}</ResponsiveText>;
          })()}
          <ResponsiveText><b>{t("labels.topic")}</b> {d.topic}</ResponsiveText>
        </Box>
      );
    }

    default: {
      return null;
    }
  }
}
