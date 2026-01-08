"use client";

import Link from "next/link";
import { Box, Table, Tbody, Tr, Td, Flex, Text } from "@chakra-ui/react";
import { useTranslations } from "@/lib/typed-translations";
import ResponsiveText from "@/components/common/texts/ResponsiveText";
import { useCezarPlayerQuery, useUserInfoQuery } from "@/lib/queries";
import { ROUTES } from "@/routes";

export default function InfoTable() {
  const { data: userData } = useUserInfoQuery();
  const cezarId = userData?.onboardingData?.cezarId;
  const { data: playerData } = useCezarPlayerQuery(cezarId || null);
  const t = useTranslations("pages.DashboardPage.PZBSInfo");
  const hasValidData = Boolean(
    playerData && playerData.fullName && playerData.wk && playerData.okreg
  );
  const rows = hasValidData
    ? [
        { label: t("nameAndLastName"), value: playerData?.fullName },
        { label: t("PIDCezar"), value: playerData?.pid },
        { label: t("WK"), value: playerData?.wk },
        { label: t("team"), value: playerData?.klub ?? "-" },
        { label: t("region"), value: playerData?.okreg },
      ]
    : [];

  const onboardingRows = userData?.onboardingData
    ? [
        { label: t("cuebidsId"), value: userData.onboardingData.cuebidsId ?? "-" },
        { label: t("bboId"), value: userData.onboardingData.bboId ?? "-" },
        {
          label: t("hasRefereeLicense"),
          value: userData.onboardingData.hasRefereeLicense ? t("hasRefereeLicenseYes") : t("hasRefereeLicenseNo"),
        },
      ]
    : [];

  return (
    <Flex justify="start" width="100%" px={{ base: 2, md: 0 }}>
      <Box
        borderRadius="md"
        overflow="hidden"
        border="1px solid"
        borderColor="neutral.200"
        width="100%"
      >
        <Flex justify="center" width="100%">
          <Box
            borderRadius="md"
            overflow="hidden"
            border="1px solid"
            borderColor="neutral.200"
            width="100%"
          >
            <Table variant="simple" width="100%" size="sm">
              <Tbody>
                {hasValidData ? (
                  rows.map((row, index) => (
                    <Tr
                      key={row.label}
                      bg={index % 2 === 0 ? "border.100" : "bg"}
                    >
                      <Td
                        fontWeight="semibold"
                        width="50%"
                        height="52px"
                        px={{ base: 2, md: 4 }}
                      >
                        <ResponsiveText fontSize="md" fontWeight="semibold">
                          {row.label}
                        </ResponsiveText>
                      </Td>
                      <Td width="50%" height="52px">
                        <ResponsiveText fontSize="md">
                          {row.value}
                        </ResponsiveText>
                      </Td>
                    </Tr>
                  ))
                ) : (
                  <>
                    {onboardingRows.map((row, index) => (
                      <Tr
                        key={row.label}
                        bg={index % 2 === 0 ? "border.100" : "bg"}
                      >
                        <Td
                          fontWeight="semibold"
                          width="50%"
                          height="52px"
                          px={{ base: 2, md: 4 }}
                        >
                          <ResponsiveText fontSize="md" fontWeight="semibold">
                            {row.label}
                          </ResponsiveText>
                        </Td>
                        <Td width="50%" height="52px">
                          <ResponsiveText fontSize="md">
                            {row.value}
                          </ResponsiveText>
                        </Td>
                      </Tr>
                    ))}
                    <Tr>
                      <Td colSpan={2} height="auto" px={{ base: 2, md: 4 }} py={2}>
                        <ResponsiveText fontSize="md">
                          {t("missingCezarData")}
                        </ResponsiveText>
                        <Link href={ROUTES.user_profile}>
                          <Text
                            mt={2}
                            fontSize="sm"
                            textDecoration="underline"
                            color="accent.500"
                            _hover={{ color: "accent.600" }}
                            cursor="pointer"
                          >
                            {t("updatePIDInSettings")}
                          </Text>
                        </Link>
                      </Td>
                    </Tr>
                  </>
                )}
              </Tbody>
            </Table>
          </Box>
        </Flex>
      </Box>
    </Flex>
  );
}
