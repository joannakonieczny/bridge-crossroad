"use client";

import { Box, List, ListItem, ListIcon, VStack, Flex } from "@chakra-ui/react";
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
import ResponsiveText from "@/components/common/texts/ResponsiveText";
import ResponsiveHeading from "@/components/common/texts/ResponsiveHeading";

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
    .slice(0, 4);

  return (
    <VStack mt="5" width="100%" align="start">
      <ResponsiveHeading
        text={t("headings.lastTournaments")}
        fontSize="xl"
        mb={4}
        w="100%"
        px={{ base: 3, md: 0 }}
      />
      <Box ms="5" width="100%">
        <List spacing={3}>
          {filtered.map((c, idx) => (
            <ListItem key={c.id} fontSize="lg">
              <Flex direction="column">
                <ResponsiveText
                  as="p"
                  fontSize="lg"
                  w="100%"
                  px={{ base: 3, md: 0 }}
                >
                  <ListIcon as={ICONS[idx % ICONS.length]} color="accent.500" />
                  {c.title}
                </ResponsiveText>
                <ResponsiveText
                  as="span"
                  fontSize="sm"
                  color="border.500"
                  mt="1"
                  ml={{ base: 3, md: 10 }}
                >
                  {c.date}
                </ResponsiveText>
              </Flex>
            </ListItem>
          ))}
        </List>
      </Box>
    </VStack>
  );
}
