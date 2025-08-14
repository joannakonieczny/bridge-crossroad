"use client";

// only for demo purposes

import {
  Button,
  Heading,
  IconButton,
  useColorMode,
  useColorModeValue,
  VStack,
} from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import { BsMoon, BsSun } from "react-icons/bs";

function Toggle() {
  // Chakra UI hook that toggle the color mode
  const { toggleColorMode } = useColorMode();
  return (
    <VStack>
      {useColorModeValue(
        <Heading>Light Mode</Heading>,
        <Heading>Dark Mode</Heading>
      )}
      <IconButton
        aria-label="Mode Change"
        variant="outline"
        colorScheme="black"
        size="lg"
        icon={useColorModeValue(<BsMoon />, <BsSun />)}
        onClick={toggleColorMode}
      />
    </VStack>
  );
}

export default function DummyPageComponent() {
  const { data, isFetched } = useQuery({
    queryKey: ["dummy"],
    queryFn: async () => {
      return (
        await fetch("https://jsonplaceholder.typicode.com/posts/1")
      ).json();
    },
  });

  return (
    <>
      <Heading>text</Heading>
      <Heading>description.text</Heading>
      <Heading>{isFetched ? JSON.stringify(data) : "fetching..."}</Heading>
      <Button colorScheme="accent">color scheme</Button>
      <Button colorScheme="accent" variant={"ghost"}>
        color scheme
      </Button>
      <Button bgColor="accent.500"> bg color</Button>
      <Toggle />
    </>
  );
}
