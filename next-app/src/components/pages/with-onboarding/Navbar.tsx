"use client";

import { useMemo } from "react";
import {
  Flex,
  Tabs,
  TabList,
  Tab,
  TabIndicator,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  IconButton,
} from "@chakra-ui/react";
import Link from "next/link";
import ProfilePicture from "@/components/common/ProfilePicture";
import { FaAngleDown, FaAngleRight } from "react-icons/fa";
import { usePathname } from "next/navigation";
import { ROUTES } from "@/routes";
import Logo from "@/components/common/Logo";
import { useTranslations } from "next-intl";

const navbarTabs = [
  ROUTES.dashboard,
  ROUTES.calendar,
  ROUTES.groups,
  ROUTES.find_partner,
  ROUTES.tools,
];

export default function Navbar() {
  const pathname = usePathname();

  const defaultIndex = useMemo(() => {
    const match = navbarTabs.findIndex((path) => pathname.startsWith(path));
    return match === -1 ? 0 : match;
  }, [pathname]);

  const t = useTranslations("Navbar.Tabs");

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
    >
      <Logo />
      <Tabs
        position="relative"
        variant="unstyled"
        alignItems="center"
        defaultIndex={defaultIndex}
      >
        <TabList gap={8} color="accent.500">
          <Tab
            as={Link}
            href={navbarTabs[0]}
            _selected={{ color: "black" }}
            _focus={{ boxShadow: "none" }}
          >
            {t("dashboard")}
          </Tab>
          <Tab
            as={Link}
            href={navbarTabs[1]}
            _selected={{ color: "black" }}
            _focus={{ boxShadow: "none" }}
          >
            {t("calendar")}
          </Tab>
          <Tab
            as={Link}
            href={navbarTabs[2]}
            _selected={{ color: "black" }}
            _focus={{ boxShadow: "none" }}
          >
            {t("groups")}
          </Tab>
          <Tab
            as={Link}
            href={navbarTabs[3]}
            _selected={{ color: "black" }}
            _focus={{ boxShadow: "none" }}
          >
            {t("findPartner")}
          </Tab>
          <Tab
            as={Link}
            href={navbarTabs[4]}
            _selected={{ color: "black" }}
            _focus={{ boxShadow: "none" }}
          >
            {t("tools")}
          </Tab>
        </TabList>
        <TabIndicator mt="-1.5px" height="2px" bg="black" borderRadius="1px" />
      </Tabs>

      <Flex flex={1} justifyContent="flex-end" alignItems="center" gap={4}>
        <ProfilePicture size="3rem" />
        <Menu>
          {({ isOpen }) => (
            <>
              <MenuButton
                as={IconButton}
                aria-label="Options"
                icon={
                  isOpen ? (
                    <FaAngleDown size="1.5rem" />
                  ) : (
                    <FaAngleRight size="1.5rem" />
                  )
                }
                variant="unstyled"
                _hover={{ bg: "transparent" }}
                _active={{ bg: "transparent" }}
                _focus={{ boxShadow: "none" }}
              />
              <MenuList
                minWidth="240px"
                bg="white"
                borderColor="border.200"
                boxShadow="md"
                borderRadius="md"
                mt={4}
              >
                <MenuItem icon={<FaAngleDown />}>New Tab</MenuItem>
                <MenuItem icon={<FaAngleDown />}>New Window</MenuItem>
                <MenuItem icon={<FaAngleDown />}>Open Closed Tab</MenuItem>
                <MenuItem icon={<FaAngleDown />}>Open File...</MenuItem>
              </MenuList>
            </>
          )}
        </Menu>
      </Flex>
    </Flex>
  );
}
