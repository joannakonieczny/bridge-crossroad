"use client";

import { Box, Text, List, ListItem, ListIcon, VStack } from "@chakra-ui/react";
import { useTranslations } from "@/lib/typed-translations";
import {
  PiClubBold,
  PiHeartBold,
  PiSpadeBold,
  PiDiamondBold,
} from "react-icons/pi";

export default function PastContests() {
  const t = useTranslations("DashboardPage");

  const contests = [
    { name: "III Turnej Czwartkowy - semestr letni", date: "13 Maja 2021" },
    {
      name: "Akademickie Mistrzostwa Małopolski - turniej drużynowy",
      date: "10 Kwietnia 2021",
    },
    {
      name: "Akademickie Mistrzostwa Małopolski - turniej par",
      date: "8 Kwietnia 2021",
    },
    { name: "II Turnej Czwartkowy - semestr zimowy", date: "17 Grudnia 2020" },
  ];
  return (
    <VStack mt="5" width="100%" align="start">
      <Text fontSize="24px" lineHeight="24px" fontWeight="bold" mb={4}>
        {t("headings.lastTournaments")}
      </Text>
      <Box ms="5">
        <List spacing={3}>
          <ListItem fontSize="lg">
            <ListIcon as={PiSpadeBold} color="accent.500" />
            {contests[0].name}
            <Text ms="10" mt="1" color="border.500">
              {" "}
              {contests[0].date}{" "}
            </Text>
          </ListItem>
          <ListItem fontSize="lg">
            <ListIcon as={PiHeartBold} color="accent.500" />
            {contests[1].name}
            <Text ms="10" mt="1" color="border.500">
              {" "}
              {contests[1].date}{" "}
            </Text>
          </ListItem>
          <ListItem fontSize="lg">
            <ListIcon as={PiDiamondBold} color="accent.500" />
            {contests[2].name}
            <Text ms="10" mt="1" color="border.500">
              {" "}
              {contests[2].date}{" "}
            </Text>
          </ListItem>
          <ListItem fontSize="lg">
            <ListIcon as={PiClubBold} color="accent.500" />
            {contests[3].name}
            <Text ms="10" mt="1" color="border.500">
              {" "}
              {contests[3].date}{" "}
            </Text>
          </ListItem>
        </List>
      </Box>
    </VStack>
  );
}
