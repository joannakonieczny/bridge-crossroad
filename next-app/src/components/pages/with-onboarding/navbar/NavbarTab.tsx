"use client";

import { Tab } from "@chakra-ui/react";
import Link from "next/link";

interface NavbarTabProps {
  href: string;
  children: React.ReactNode;
}

export default function NavbarTab({ href, children }: NavbarTabProps) {
  return (
    <Tab
      as={Link}
      href={href}
      whiteSpace="nowrap"
      fontSize="0.87rem"
      _selected={{ color: "fonts" }}
      _focus={{ boxShadow: "none" }}
    >
      {children}
    </Tab>
  );
}
