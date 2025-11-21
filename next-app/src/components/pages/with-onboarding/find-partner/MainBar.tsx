import React, { type ChangeEvent, useState } from "react";
import { Box, HStack } from "@chakra-ui/react";
import SearchInput from "@/components/common/SearchInput";
import { useTranslations } from "@/lib/typed-translations";
import PartnershipForm from "@/components/pages/with-onboarding/find-partner/PartnershipForm";

export default function MainBar() {
  const t = useTranslations("pages.FindPartner.MainBar");
  const [query, setQuery] = useState(""); //Still mocked

  return (
    <Box bg="bg" p={4} borderRadius="md">
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
        <PartnershipForm />
      </HStack>
    </Box>
  );
}
