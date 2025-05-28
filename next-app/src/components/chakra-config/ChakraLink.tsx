"use client";

import NextLink, { type LinkProps as NextLinkProps } from "next/link";
import { chakra } from "@chakra-ui/react";

// wrap the NextLink with Chakra UI's factory function
const ChakraLink = chakra<typeof NextLink, NextLinkProps>(NextLink, {
  // ensure that you're forwarding all of the required props for your case
  shouldForwardProp: (prop) =>
    [
      "href",
      "target",
      "children",
      "onClick",
      "rel",
      "className",
      "style",
    ].includes(prop),
});

export default ChakraLink;
