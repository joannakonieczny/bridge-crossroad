"use client";
import React from "react";
import { HStack, Icon } from "@chakra-ui/react";
import { FiArrowLeft } from "react-icons/fi";
import { useRouter } from "next/navigation";
import ResponsiveText from "@/components/common/texts/ResponsiveText";

export default function BackLink({ children }: { children?: React.ReactNode }) {
  const router = useRouter();

  const handle = () => router.back();

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handle();
    }
  };

  return (
    <HStack
      as="div"
      spacing={2}
      align="center"
      color="accent.500"
      cursor="pointer"
      onClick={handle}
      onKeyDown={onKeyDown}
      role="button"
      tabIndex={0}
      aria-label="Wróć"
      userSelect="none"
    >
      <Icon as={FiArrowLeft} aria-hidden />
      <ResponsiveText fontSize="sm" fontWeight="medium">
        {children ?? "wróć"}
      </ResponsiveText>
    </HStack>
  );
}
