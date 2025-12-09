"use client";

import { Box, Text, List, ListItem, ListIcon, VStack, Flex } from "@chakra-ui/react";
import { useTranslations } from "@/lib/typed-translations";
import {
  PiClubBold,
  PiHeartBold,
  PiSpadeBold,
  PiDiamondBold,
} from "react-icons/pi";
import { useEventsForUserQuery } from "@/lib/queries";
import dayjs from "dayjs";
import { getDurationLabel } from "@/util/formatters";

const ICONS = [PiSpadeBold, PiHeartBold, PiDiamondBold, PiClubBold];
const ALLOWED_TYPES = ["TOURNAMENT_PAIRS", "TOURNAMENT_TEAMS"];

export default function PastContests() {
  const t = useTranslations("pages.DashboardPage");

  const end = new Date();
  const start = dayjs().subtract(1, "month").toDate();

  const eventsQ = useEventsForUserQuery({ start, end });
  const raw = eventsQ.data?.events ?? [];

  const filtered = raw
    .filter((ev) => ALLOWED_TYPES.includes(ev.data.type))
    .map((ev) => {
      const title = ev.title;
      const date = getDurationLabel(ev.duration) || "—";
      return { id: (ev as any).id ?? Math.random().toString(), title, date };
    })

  return (
    <VStack mt="5" width="100%" align="start">
      <Text fontSize="24px" lineHeight="24px" fontWeight="bold" mb={4}>
        {t("headings.lastTournaments")}
      </Text>
      <Box ms="5" width="100%">
        <List spacing={3}>
          {filtered.map((c, idx) => (
            <ListItem key={c.id} fontSize="lg">
              <Flex direction="column">
                <Text>
                  <ListIcon as={ICONS[idx % ICONS.length]} color="accent.500" />
                  {c.title}
                </Text>
                <Text ml="2" mt="1" color="border.500" as="span">
                  {c.date}
                </Text>
              </Flex>
            </ListItem>
          ))}
        </List>
      </Box>
    </VStack>
  );
}
