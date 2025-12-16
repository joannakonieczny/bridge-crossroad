"use client";

import { Tab, useColorMode } from "@chakra-ui/react";
import Link from "next/link";

interface NavbarTabProps {
  href: string;
  children: React.ReactNode;
}

export default function NavbarTab({ href, children }: NavbarTabProps) {

  const { colorMode } = useColorMode();

  return (
    <Tab
      as={Link}
      href={href}
      whiteSpace="nowrap"
      fontSize="0.87rem"
      _selected={{ color: colorMode === "dark" ? "blue.500" : "fonts" }}
      _focus={{ boxShadow: "none" }}
    >
      {children}
    </Tab>
  );
}
