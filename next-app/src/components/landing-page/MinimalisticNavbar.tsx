import { Button, Flex } from "@chakra-ui/react";
import Logo from "../common/Logo";
import Link from "next/link";

export default function MinimalisticNavbar() {
  return (
    <Flex
          as="nav"
          bg="white"
          p={4}
          boxShadow="sm"
          alignItems="center"
          position="sticky"
          top={0}
          zIndex={1000}
          pl={8}
          justify="space-between"
        >
          <Flex height={"3.75rem"} alignItems={"center"}>
            <Logo />
          </Flex>

          <Button colorScheme="accent" size="md" marginRight={4}>
            <Link href="/auth/login" style={{ textDecoration: 'none' }}>
              Zaloguj się
            </Link>
          </Button>
        </Flex>
  );
}