import React from "react";
import { Tr, Td, Box, Avatar, Text, Link, HStack } from "@chakra-ui/react";
import { FaLightbulb, FaRegAddressCard, FaRegClock } from "react-icons/fa";

type Announcement = {
  id: number;
  title: string;
  date: string; // display string
  playerName: string;
  playerNick?: string;
  characteristics?: string[]; // ignored for badge, we render icons
  frequency: string;
  preferredSystem: string;
};

export default function Annoucment({ a }: { a: Announcement }) {
  return (
    <Tr>
      <Td>
        <HStack spacing={3} align="flex-start">
          {/* optional avatar / decorative */}
          <Avatar size="sm" name={a.playerName} />
          <Box>
            <Link color="accent.500" fontWeight="semibold" href="#" _hover={{ textDecoration: "underline" }}>
              {a.title}
            </Link>
            <Text fontSize="sm" color="border.500">{a.date}</Text>
          </Box>
        </HStack>
      </Td>

      <Td>
        <Box>
          <Text fontWeight="medium">{a.playerName}</Text>
          {a.playerNick && <Text fontSize="sm" color="border.500" fontStyle="italic">{a.playerNick}</Text>}
        </Box>
      </Td>

      <Td>
        <HStack spacing={3}>
          {/* simple icon placeholders for characteristics */}
          <FaRegAddressCard />
          <FaLightbulb />
          <FaRegClock />
        </HStack>
      </Td>

      <Td>
        <Text>{a.frequency}</Text>
      </Td>

      <Td>
        <Text>{a.preferredSystem}</Text>
      </Td>
    </Tr>
  );
}
