"use client";

import { Box, Table, Tbody, Tr, Td, Flex } from "@chakra-ui/react";
import { useTranslations } from "@/lib/typed-translations";

export default function InfoTable() {
  // mock
  const t = useTranslations("pages.DashboardPage.PZBSInfo");
  const rows = [
    { label: t("nameAndLastName"), value: "Jan Nowak" },
    { label: t("PIDCezar"), value: "23178" },
    { label: t("WK"), value: "1.0" },
    { label: t("team"), value: "KS AGH I Kraków" },
    { label: t("region"), value: "MP" },
  ];

  return (
    <Flex justify="start" width="100%">
      <Box
        borderRadius="md"
        overflow="hidden"
        border="1px solid"
        borderColor="border.200"
        width="100%"
        // opcjonalnie: ogranicz maksymalną szerokość, jeśli chcesz limitować rozrost na bardzo szerokich ekranach
        // maxW="800px"
      >
        <Flex justify="center" mt="12px" width="100%">
          <Box
            borderRadius="md"
            overflow="hidden"
            border="1px solid"
            borderColor="border.200"
            width="100%"
          >
            <Table variant="simple" width="100%" size="sm">
              <Tbody>
                {rows.map((row, index) => (
                  <Tr
                    key={row.label}
                    bg={index % 2 === 0 ? "border.100" : "bg"}
                  >
                    <Td
                      fontWeight="semibold"
                      fontSize="sm"
                      width="50%"
                      height="52px"
                    >
                      {row.label}
                    </Td>
                    <Td width="50%" height="52px">
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
