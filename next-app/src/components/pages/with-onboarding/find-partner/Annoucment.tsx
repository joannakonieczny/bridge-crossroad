import React, { useState } from "react";
import { Tr, Td, Box, Avatar, Text, Link, HStack, Flex, IconButton, Button } from "@chakra-ui/react";
// replace Chakra icon with react-icons chevron
import { FiChevronDown } from "react-icons/fi";

type Announcement = {
  id: number;
  title: string;
  date: string; // display string
  playerName: string;
  playerNick?: string;
  characteristics?: string[]; // ignored for badge, we render icons
  frequency: string;
  preferredSystem: string;
  // added description field (may be optional)
  description?: string;
  // optional initial flag whether current user is already interested
  isInterested?: boolean;
};

export default function Annoucment({ a }: { a: Announcement }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Tr
        _hover={{ ".vertical-bar": { bg: "accent.500" } }}
        borderBottomWidth={open ? "0" : "1px"}
        borderBottomColor={open ? "transparent" : "border.200"}
      >
        <Td py={2}>
          <Flex align="center">
            <Box
              className="vertical-bar"
              bg="accent.200"
              w="6px"
              mr={3}
              transition="background-color 150ms ease"
              alignSelf="stretch"
              display={{ base: "none", md: "block" }} // hidden on phone
            />
            <HStack spacing={3} align={{ base: "center", md: "flex-start" }}>
              <Avatar size="sm" name={a.playerName} display={{ base: "none", md: "flex" }} /> {/* hidden on phone */}
              <Box>
                <Link color="accent.500" fontWeight="semibold" href="#" _hover={{ textDecoration: "underline" }}>
                  {a.title}
                </Link>
                <Text fontSize="sm" color="border.500">{a.date}</Text>
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

        {/* toggle arrow column (zawsze widoczna) */}
        <Td py={2} textAlign="right" w="48px">
          <IconButton
            aria-label={open ? "Ukryj szczegóły" : "Pokaż szczegóły"}
            icon={
              <FiChevronDown
                style={{
                  transform: open ? "rotate(180deg)" : "rotate(0deg)",
                  transition: "transform 150ms ease",
                }}
              />
            }
            size="sm"
            variant="ghost"
            onClick={() => setOpen(!open)}
          />
        </Td>
      </Tr>

      {open && (
        <Tr>
          {/* colSpan = liczba kolumn w wierszu powyżej (tutaj 5) */}
          <Td colSpan={5} p={4} bg="bg">
            <Flex direction={{ base: "column", md: "row" }} align="center" justify="space-between" gap={4}>
              {/* render description from data, preserve line breaks */}
              <Box flex="1">
                <Text whiteSpace="pre-wrap">{a.description ?? "Brak opisu"}</Text>
              </Box>

              <Box>
                {/* teraz przycisk nie wykonuje żadnej akcji */}
                <Button
                  colorScheme="accent"
                  onClick={() => {}}
                  size="sm"
                >
                  Jestem zainteresowany
                </Button>
              </Box>
            </Flex>
          </Td>
        </Tr>
      )}
    </>
  );
}
