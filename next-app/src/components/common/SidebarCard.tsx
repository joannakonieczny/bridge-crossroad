"use client";
import React from "react";
import { Card, Image, Box, Button, Text } from "@chakra-ui/react";
import { FiArrowRight } from "react-icons/fi";

type SidebarCardProps = {
  title?: string;
  imageUrl?: string;
};

export default function SidebarCard({
  title = "Letnia Stasikówka",
  imageUrl = "https://picsum.photos/200/300?grayscale",
}: SidebarCardProps) {
  return (
    <Card
      borderRadius="md"
      overflow="hidden"
      variant="outline"
      w="14rem"
      boxShadow="sm"
      bg="white"
    >
      <Box>
        <Image src={imageUrl} alt={title} w="100%" h="9rem" objectFit="cover" />
      </Box>
      <Box p={3}>
        <Text fontWeight="semibold" fontSize="sm" mb={3}>
          {title}
        </Text>
        <Button
          size="sm"
          variant="outline"
          color="accent.500"
          borderColor="accent.500"
          rightIcon={<FiArrowRight />}
          w="100%"
        >
          Szczegóły
        </Button>
      </Box>
    </Card>
  );
}
