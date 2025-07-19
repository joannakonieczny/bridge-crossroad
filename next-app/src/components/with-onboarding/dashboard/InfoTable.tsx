"use client";

import {
  Box,
  Table,
  Tbody,
  Tr,
  Td,
  Flex,
} from "@chakra-ui/react";

export default function InfoTable() {
  // mock
  const rows = [
    { label: "Imię i Nazwisko", value: "Jan Nowak" },
    { label: "PID Cezar", value: "23178" },
    { label: "WK", value: "1.0" },
    { label: "Drużyna", value: "KS AGH I Kraków" },
    { label: "Okrąg", value: "MP" },
  ];

  return (
    <Flex justify="start">
    <Box
      borderRadius="md"
      overflow="hidden"
      border="1px solid"
      borderColor="border.200"
      width="800px"
      height="284px"
      mx="auto"
    >
      <Flex justify="center" mt="12px">
      <Box
        borderRadius="md"
        overflow="hidden"
        border="1px solid"
        borderColor="border.200"
        width="780px"
        height="260px"
        mx="auto"
      >
        
        <Table variant="simple" width="100%" align="center">
          <Tbody>
            {rows.map((row, index) => (
              <Tr
                key={row.label}
                bg={index % 2 === 0 ? "border.100" : "white"}
              >
                <Td 
                  fontWeight="semibold" 
                  fontSize="sm" 
                  width="50%"
                  height="52px">

                  {row.label}
                </Td>
                <Td 
                  width="50%" 
                  height="52px">
                  {row.value}
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>
      </Flex>
    </Box>
    </Flex>
  );
}

