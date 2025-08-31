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
  Box,
  useColorMode,
  VStack,
  Heading,
  useColorModeValue,
  Switch,
} from "@chakra-ui/react";
import Link from "next/link";
import ProfilePicture from "@/components/common/ProfilePicture";
import { FaAngleDown, FaAngleRight, FaCog, FaRegQuestionCircle } from "react-icons/fa";
import { usePathname } from "next/navigation";
import { ROUTES } from "@/routes";
import Logo from "@/components/common/Logo";
import { useTranslations } from "next-intl";
import { FaRegUser } from "react-icons/fa";
import { BsFillMoonStarsFill, BsMoon, BsSun } from "react-icons/bs";
import ResponsiveText from "@/components/common/texts/ResponsiveText";

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

  const t = useTranslations("components.Navbar.Tabs");
  const { toggleColorMode } = useColorMode();

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
      gap={8}
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
            fontSize={"0.87rem"}
            as={Link}
            href={navbarTabs[0]}
            _selected={{ color: "black" }}
            _focus={{ boxShadow: "none" }}
            whiteSpace="nowrap"
          >
            {t("dashboard")}
          </Tab>
          <Tab
            fontSize={"0.87rem"}
            as={Link}
            href={navbarTabs[1]}
            _selected={{ color: "black" }}
            _focus={{ boxShadow: "none" }}
            whiteSpace="nowrap"
          >
            {t("calendar")}
          </Tab>
          <Tab
            fontSize={"0.87rem"}
            as={Link}
            href={navbarTabs[2]}
            _selected={{ color: "black" }}
            _focus={{ boxShadow: "none" }}
            whiteSpace="nowrap"
          >
            {t("groups")}
          </Tab>
          <Tab
            fontSize={"0.87rem"}
            as={Link}
            href={navbarTabs[3]}
            _selected={{ color: "black" }}
            _focus={{ boxShadow: "none" }}
            whiteSpace="nowrap"
          >
            {t("findPartner")}
          </Tab>
          <Tab
            fontSize={"0.87rem"}
            as={Link}
            href={navbarTabs[4]}
            _selected={{ color: "black" }}
            _focus={{ boxShadow: "none" }}
            whiteSpace="nowrap"
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
                <MenuItem icon={<FaRegUser size={"1rem"}/>}>Profil</MenuItem>
                <MenuItem icon={<FaRegQuestionCircle size={"1rem"}/>}>Ustawienia</MenuItem>
                <MenuItem icon={<FaCog size={"1rem"}/>}>O stronie</MenuItem>
                <Flex alignItems="center" gap={2} pl={3} mt={6}>
                  <BsFillMoonStarsFill size={"1rem"}/>
                  <ResponsiveText>Tryb ciemny</ResponsiveText>
                  <Switch
                    isChecked={useColorMode().colorMode === "dark"}
                    onChange={useColorMode().toggleColorMode}
                    colorScheme="accent"
                  />
                </Flex>

                <Box>
                  
                </Box>
              </MenuList>
            </>
          )}
        </Menu>
      </Flex>
    </Flex>
  );
}
