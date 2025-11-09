import React, { type ChangeEvent, useState } from "react";
import { Box, HStack } from "@chakra-ui/react";
import SearchInput from "@/components/common/SearchInput";

export default function MainBar() {
  const [query, setQuery] = useState("");

  return (
    <Box bg="bg" p={4} borderRadius="md" boxShadow="sm">
      <HStack spacing={4}>
        <Box flex={1}>
          <SearchInput
            value={query}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setQuery(e.target.value)}
            placeholder="Szukaj oferty, turnieju, partnera..."
          />
        </Box>
      </HStack>
    </Box>
  );
}
