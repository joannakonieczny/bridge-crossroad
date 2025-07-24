import Link from "next/link";
import { Flex, Heading, Box } from "@chakra-ui/react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { ROUTES } from "@/routes";

export default function Logo() {
  const t = useTranslations("common");

  return (
    <Link href={ROUTES.dashboard} style={{ textDecoration: "none" }}>
      <Flex gap={2} mr={100} cursor="pointer" alignItems="center">
        <Heading as="h1" size="md">
          {t("appName")}
        </Heading>
        <Box
          style={{
            width: "1.875rem",
            height: "1.75rem",
            position: "relative",
            marginRight: "1rem",
          }}
        >
          <Image
            src="/assets/common/logo-lightmode.svg"
            alt="Logo"
            fill
            style={{ objectFit: "contain", objectPosition: "left top" }}
          />
        </Box>
      </Flex>
    </Link>
  );
}
