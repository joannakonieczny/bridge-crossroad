import React, { useState } from "react";
import { Tr, Td, Box, Avatar, Text, Link, HStack, Flex, IconButton, Button, Select } from "@chakra-ui/react";
// replace Chakra icon with react-icons chevron
import { FiChevronDown } from "react-icons/fi";
import { useActionQuery } from "@/lib/tanstack-action/actions-querry";
import { addInterested, removeInterested } from "@/services/find-partner/api";
import { useActionMutation } from "@/lib/tanstack-action/actions-mutation";

type Announcement = {
  id: number | string;
  title: string;
  date: string; 
  playerName: string;
  playerNick?: string;
  characteristics?: string[]; 
  frequency: string;
  preferredSystem: string;
  description?: string;
  interestedUsers?: Array<any>;
  isInterested?: boolean;
};

export default function Annoucment({ a }: { a: Announcement }) {
  const [open, setOpen] = useState(false);
  const [selectedInterestedUser, setSelectedInterestedUser] = useState<string | undefined>(
    undefined
  );

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
          {/* map frequency codes to user-friendly labels */}
          <Text>
            {a.frequency === "SINGLE"
              ? "Pojedyńcza"
              : a.frequency === "PERIOD"
              ? "Okresowa"
              : a.frequency}
          </Text>
        </Td>

        {/* hidden on phone */}
        <Td py={2} display={{ base: "none", md: "table-cell" }}>
          <Text>
            {a.preferredSystem === "ZONE"
              ? "Strefa"
              : a.preferredSystem === "COMMON_LANGUAGE"
              ? "Wspólny Język"
              : a.preferredSystem === "DOUBLETON"
              ? "Dubeltówka"
              : a.preferredSystem === "SAYC"
              ? "SAYC"
              : a.preferredSystem === "BETTER_MINOR"
              ? "Lepszy Młodszy"
              : a.preferredSystem === "WEAK_OPENINGS_SSO"
              ? "SSO"
              : a.preferredSystem === "TOTOLOTEK"
              ? "Totolotek"
              : a.preferredSystem === "NATURAL"
              ? "Naturalny"
              : a.preferredSystem === "OTHER"
              ? "Inny"
              : a.preferredSystem}
          </Text>
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
                  Zapisz się
                </Button>
              </Box>
            </Flex>

            {/* dropdown below description and button */}
            <Box mt={4}>
              <Flex direction={{ base: "column", md: "row" }} gap={2} align="center">
                <Select
                  flex={1}
                  placeholder={a.interestedUsers && a.interestedUsers.length ? "Zagram z..." : "Brak zainteresowanych"}
                  value={selectedInterestedUser}
                  onChange={(e) => setSelectedInterestedUser(e.target.value || undefined)}
                  isDisabled={!a.interestedUsers || a.interestedUsers.length === 0}
                  size="sm"
                >
                  {(a.interestedUsers || []).map((u: any) => {
                    // try to derive readable label from possible shapes
                    const id = (u && (u._id ?? u.id ?? u)) as string;
                    const label =
                      u && (u.name ? `${u.name.firstName ?? ""} ${u.name.lastName ?? ""}`.trim() : u.nickname ?? u.displayName ?? `${u.firstName ?? ""} ${u.lastName ?? ""}`.trim());
                    return (
                      <option key={String(id)} value={String(id)}>
                        {label || String(id)}
                      </option>
                    );
                  })}
                </Select>

                {/* przycisk po prawej stronie Select (na razie no-op) */}
                <Button size="sm" onClick={() => {}}>
                  Zapisz
                </Button>
              </Flex>
            </Box>
          </Td>
        </Tr>
      )}
    </>
  );
}
