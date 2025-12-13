"use client";
import React from "react";
import { Card, Box, Button, Text } from "@chakra-ui/react";
import { FiArrowRight } from "react-icons/fi";
import { useTranslations } from "@/lib/typed-translations";
import { AsyncImage } from "./AsyncImage";

type SidebarCardProps = {
  title?: string;
  imageUrl?: string;
  href?: string;
};

export default function SidebarCard({
  title,
  imageUrl,
  href,
}: SidebarCardProps) {
  const t = useTranslations("components.SidebarCard");
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
        <AsyncImage src={imageUrl} alt={title} w="100%" h="9rem" />
      </Box>
      <Box p={3}>
        <Text fontWeight="semibold" fontSize="sm" mb={3} whiteSpace="nowrap" overflow="hidden" textOverflow="ellipsis">
          {title}
        </Text>
        <Button
          size="sm"
          variant="outline"
          color="accent.500"
          borderColor="accent.500"
          rightIcon={<FiArrowRight />}
          w="100%"
          as="a"
          href={href}
        >
          {t("detailsButtonText")}
        </Button>
      </Box>
    </Card>
  );
}
