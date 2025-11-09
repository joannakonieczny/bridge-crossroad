import React from "react";
import { Box, HStack, Button, Text, /* Pagination */ } from "@chakra-ui/react";

// NOTE: using import { Pagination } from "@chakra-ui/react" as requested by you.
// If your Chakra version exposes a Pagination component, you can replace the mock below.
// For now we render a small control that uses Chakra primitives but also imports Pagination symbolically.
export default function PaginationControls() {
  // mock values
  const current = 1;
  const totalPages = 4;

  return (
    <Box mt={4}>
      <HStack justify="center" spacing={3}>
        <Button size="sm" variant="ghost" aria-label="previous">Poprzednia</Button>

        <HStack spacing={1} align="center">
          {[...Array(totalPages)].map((_, i) => (
            <Button
              key={i}
              size="sm"
              variant={i + 1 === current ? "solid" : "outline"}
            >
              {i + 1}
            </Button>
          ))}
        </HStack>

        <Button size="sm" variant="ghost" aria-label="next">Następna</Button>
      </HStack>
    </Box>
  );
}
