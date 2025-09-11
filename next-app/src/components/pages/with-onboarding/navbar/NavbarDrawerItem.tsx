"use client";

import { Button } from "@chakra-ui/react";
import Link from "next/link";

interface NavbarDrawerItemProps {
  href: string;
  children: React.ReactNode;
}

export default function NavbarDrawerItem({ href, children }: NavbarDrawerItemProps) {
  return (
    <Link href={href}>
      <Button
        variant="ghost"
        justifyContent="flex-start"
        width="100%"
      >
        {children}
      </Button>
    </Link>
  );
}
