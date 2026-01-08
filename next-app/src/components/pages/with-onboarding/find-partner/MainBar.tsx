import React, { type ChangeEvent, useState } from "react";
import { Box, HStack, useColorMode } from "@chakra-ui/react";
import SearchInput from "@/components/common/SearchInput";
import { useTranslations } from "@/lib/typed-translations";
import CreateModifyPartnershipForm from "./CreateModifyPartnershipForm";

export default function MainBar() {
  const t = useTranslations("pages.FindPartner.MainBar");
  const [query, setQuery] = useState(""); //Still mocked
  const { colorMode } = useColorMode();

  return (
    <Box bg={colorMode === "dark" ? "neutral.100" : "bg"} p={4} borderRadius="md">
      <HStack spacing={4}>
        <Box flex={1}>
          <SearchInput
            value={query}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setQuery(e.target.value)
            }
            placeholder={t("searchPlaceholder")}
          />
        </Box>
        <CreateModifyPartnershipForm />
      </HStack>
    </Box>
  );
}
