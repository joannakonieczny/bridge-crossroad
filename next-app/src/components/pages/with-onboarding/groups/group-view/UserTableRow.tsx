"use client";

import { Tr, Td, Text, Box, Link } from "@chakra-ui/react";
import { useTranslations } from "@/lib/typed-translations";
import { STATIC } from "@/club-preset/static";

type UserTableRowProps = {
  fullName: string;
  nickname?: string;
  pzbsNumber?: string;
  bboNickname?: string;
  cuebidsCode?: string;
};

export default function UserTableRow({
  fullName,
  nickname,
  pzbsNumber,
  bboNickname,
  cuebidsCode,
}: UserTableRowProps) {
  const t = useTranslations("pages.GroupsPage.UserTableRow");

  return (
    <Tr>
      {/* Imię i nazwisko + nickname */}
      <Td>
        <Box>
          <Text fontWeight="bold" fontSize={{ base: "sm", md: "md" }}>
            {fullName}
          </Text>
          {nickname && (
            <Text fontSize="sm" color="border.500" mt={2} fontStyle={"italic"}>
              {nickname}
            </Text>
          )}
        </Box>
      </Td>

      {/* Numer PZBS */}
      <Td>
        <Text fontSize={{ base: "xs", md: "sm" }}>
          {pzbsNumber ?? t("placeholder")}
        </Text>
      </Td>

      {/* Nickname na BBO */}
      <Td>
        <Text fontSize={{ base: "xs", md: "sm" }}>
          {bboNickname ?? t("placeholder")}
        </Text>
      </Td>

      {/* Kod zaproszenia na Cuebids */}
      <Td>
        {cuebidsCode ? (
          <Link
            href={STATIC.getCuebidsInviteLink(cuebidsCode)}
            isExternal
            fontWeight="semibold"
            color="accent.600"
            fontSize={{ base: "xs", md: "sm" }}
          >
            {cuebidsCode}
          </Link>
        ) : (
          <Text color="border.400" fontSize={{ base: "xs", md: "sm" }}>
            {t("placeholder")}
          </Text>
        )}
      </Td>
    </Tr>
  );
}
