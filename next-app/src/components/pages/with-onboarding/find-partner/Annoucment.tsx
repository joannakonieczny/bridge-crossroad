import React from "react";
import { Tr, Td, Box, Avatar, Text, Link, HStack, Flex } from "@chakra-ui/react";
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
    // on hover change child .vertical-bar background
    <Tr _hover={{ ".vertical-bar": { bg: "accent.500" } }}>
      <Td py={2}>
        <Flex align="center">
          <Box
            className="vertical-bar"
            bg="accent.200"
            w="6px"
            mr={3}
            transition="background-color 150ms ease"
            alignSelf="stretch"
            display={{ base: "none", md: "block" }}
          />
          <HStack spacing={3} align={{ base: "center", md: "flex-start" }}>
            <Avatar size="sm" name={a.playerName} display={{ base: "none", md: "flex" }} /> {/* hidden on phone */}
            <Box>
              <Link color="accent.500" fontWeight="semibold" href="#" _hover={{ textDecoration: "underline" }}>
                {a.title}
              </Link>
              <Text fontSize="sm" color="border.500">{a.date !== "" ? a.date : "\u00A0"}</Text> {/* trick to keep table row height consistent */} 
            </Box>
          </HStack>
        </Flex>
      </Td>

      <Td py={2}>
        <Box>
          <Text fontWeight="medium">{a.playerName}</Text>
          {a.playerNick && <Text fontSize="sm" color="border.500" fontStyle="italic">{a.playerNick}</Text>}
        </Box>
      </Td>

      {/* hidden on phone */}
      <Td py={2} display={{ base: "none", md: "table-cell" }}>
        <Text>{a.frequency}</Text>
      </Td>

      {/* hidden on phone */}
      <Td py={2} display={{ base: "none", md: "table-cell" }}>
        <Text>{a.preferredSystem}</Text>
      </Td>
    </Tr>
  );
}
