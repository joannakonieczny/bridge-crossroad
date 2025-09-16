"use client";

import { Tr, Td, Text, Box, Link } from "@chakra-ui/react";

type UserTableRowProps = {
  fullName: string;
  nickname?: string;
  badges: string;
  cezarNumber: string;
};

export default function UserTableRow({
  fullName,
  nickname,
  badges,
  cezarNumber,
}: UserTableRowProps) {
  return (
    <Tr>
      {/* Imię i nazwisko + nickname */}
      <Td>
        <Box>
          <Text fontWeight="bold" fontSize="md">
            {fullName}
          </Text>
          {nickname && (
            <Text
              fontSize="sm"
              color="border.500"
              mt={2}
              fontStyle={"italic"}
            >
              {nickname}
            </Text>
          )}
        </Box>
      </Td>

      {/* Odznaki */}
      <Td>
        <Text fontSize="sm">{badges}</Text>
      </Td>

      {/* Numer Cezar */}
      <Td>
        {cezarNumber ? (
          <Link
            href={`https://msc.com.pl/cezar/?p=21&pid_search=${cezarNumber}`}
            isExternal
            fontWeight="semibold"
            color="accent.600"
            fontSize="sm"
          >
            {cezarNumber}
          </Link>
        ) : (
          <Text color="border.400">-</Text>
        )}
      </Td>
    </Tr>
  );
}
