"use client";

import { Button } from "@chakra-ui/react";
import type { ReactElement, ReactNode } from "react";

interface NavbarDrawerMenuItemProps {
  icon: ReactElement;
  children: ReactNode;
  onClick?: () => void;
}

export default function NavbarDrawerMenuItem({ icon, children, onClick }: NavbarDrawerMenuItemProps) {
  return (
    <Button
      variant="ghost"
      justifyContent="flex-start"
      leftIcon={icon}
      width="100%"
      onClick={onClick}
    >
      {children}
    </Button>
  );
}
