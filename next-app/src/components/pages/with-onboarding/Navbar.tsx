"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Flex,
  Tabs,
  TabList,
  Tab,
  TabIndicator,
  IconButton,
  VStack,
  Divider,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
  useDisclosure,
  Switch,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
} from "@chakra-ui/react";
import Link from "next/link";
import ProfilePicture from "@/components/common/ProfilePicture";
import {
  FaBars,
  FaRegUser,
  FaCog,
  FaRegQuestionCircle,
  FaAngleDown,
  FaAngleRight,
} from "react-icons/fa";
import { BsFillMoonStarsFill } from "react-icons/bs";
import { usePathname } from "next/navigation";
import { ROUTES } from "@/routes";
import Logo from "@/components/common/Logo";
import { useTranslations } from "next-intl";
import { useColorMode } from "@chakra-ui/react";
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
  const { isOpen, onOpen, onClose } = useDisclosure();

  const defaultIndex = useMemo(() => {
    const match = navbarTabs.findIndex((path) => pathname.startsWith(path));
    return match === -1 ? 0 : match;
  }, [pathname]);

  const t = useTranslations("components.Navbar");
  const { colorMode, toggleColorMode } = useColorMode();

  const [isDesktop, setIsDesktop] = useState(false);

  // for now it must stay this way- exactly under 77% of screen width there are unsolvable bugs with Chakra tabs indicator so we replace navbar there with hamburger
  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth / window.screen.width > 0.77);
    };
    
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

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

      {isDesktop ? (
        <>
          {/* tabs */}
          <Tabs
            position="relative"
            variant="unstyled"
            alignItems="center"
            defaultIndex={defaultIndex}
          >
            <TabList gap={8} color="accent.500">
              <Tab as={Link} href={ROUTES.dashboard} whiteSpace="nowrap" fontSize="0.87rem" _selected={{ color: "black" }} _focus={{ boxShadow: "none" }}>
                {t("tabs.dashboard")}
              </Tab>
              <Tab as={Link} href={ROUTES.calendar} whiteSpace="nowrap" fontSize="0.87rem" _selected={{ color: "black" }} _focus={{ boxShadow: "none" }}>
                {t("tabs.calendar")}
              </Tab>
              <Tab as={Link} href={ROUTES.groups} whiteSpace="nowrap" fontSize="0.87rem" _selected={{ color: "black" }} _focus={{ boxShadow: "none" }}>
                {t("tabs.groups")}
              </Tab>
              <Tab as={Link} href={ROUTES.find_partner} whiteSpace="nowrap" fontSize="0.87rem" _selected={{ color: "black" }} _focus={{ boxShadow: "none" }}>
                {t("tabs.findPartner")}
              </Tab>
              <Tab as={Link} href={ROUTES.tools} whiteSpace="nowrap" fontSize="0.87rem" _selected={{ color: "black" }} _focus={{ boxShadow: "none" }}>
                {t("tabs.tools")}
              </Tab>
            </TabList>
            <TabIndicator mt="-1.5px" height="2px" bg="black" borderRadius="1px" />
          </Tabs>

          {/* profile + dropdown menu */}
          <Flex flex={1} justifyContent="flex-end" alignItems="center" gap={4}>
            <ProfilePicture size="3rem" />
            <Menu>
              {({ isOpen }) => (
                <>
                  <MenuButton
                    as={IconButton}
                    aria-label="Options"
                    icon={
                      isOpen ? <FaAngleDown size="1.5rem" /> : <FaAngleRight size="1.5rem" />
                    }
                    variant="unstyled"
                    _hover={{ bg: "transparent" }}
                    _active={{ bg: "transparent" }}
                    _focus={{ boxShadow: "none" }}
                  />
                  <MenuList minWidth="240px" bg="white" borderColor="border.200" boxShadow="md">
                    <MenuItem icon={<FaRegUser size="1rem" />}>{t("menu.profile")}</MenuItem>
                    <MenuItem icon={<FaRegQuestionCircle size="1rem" />}>{t("menu.settings")}</MenuItem>
                    <MenuItem icon={<FaCog size="1rem" />}>{t("menu.aboutPage")}</MenuItem>
                    <Divider />
                    <Flex alignItems="center" gap={2} pl={3} py={2}>
                      <BsFillMoonStarsFill size="1rem" />
                      <ResponsiveText fontSize="md">{t("menu.darkMode")}</ResponsiveText>
                      <Switch
                        isChecked={colorMode === "dark"}
                        onChange={toggleColorMode}
                        colorScheme="accent"
                      />
                    </Flex>
                  </MenuList>
                </>
              )}
            </Menu>
          </Flex>
        </>
      ) : (
        <>
          <Flex flex={1} justifyContent="flex-end" alignItems="center">
            <IconButton
              aria-label="Open menu"
              icon={<FaBars size="1.5rem" />}
              variant="ghost"
              onClick={onOpen}
            />
          </Flex>

          {/* Drawer na mobile */}
          <Drawer placement="right" onClose={onClose} isOpen={isOpen}>
            <DrawerOverlay />
            <DrawerContent>
              <DrawerHeader borderBottomWidth="1px" display="flex" alignItems="center" justifyContent="space-between">
                <ProfilePicture size="3rem" />
                
                {/* Druga ikona, widoczna w Drawerze */}
                <IconButton
                  aria-label="Close drawer"
                  icon={<FaBars size="1.5rem" />}
                  variant="ghost"
                  onClick={onClose}
                />
              </DrawerHeader>
              <DrawerBody>
                <VStack align="stretch" spacing={4}>
                  {/* zakładki */}
                  <Link href={ROUTES.dashboard}><Button variant="ghost" justifyContent="flex-start">{t("tabs.dashboard")}</Button></Link>
                  <Link href={ROUTES.calendar}><Button variant="ghost" justifyContent="flex-start">{t("tabs.calendar")}</Button></Link>
                  <Link href={ROUTES.groups}><Button variant="ghost" justifyContent="flex-start">{t("tabs.groups")}</Button></Link>
                  <Link href={ROUTES.find_partner}><Button variant="ghost" justifyContent="flex-start">{t("tabs.findPartner")}</Button></Link>
                  <Link href={ROUTES.tools}><Button variant="ghost" justifyContent="flex-start">{t("tabs.tools")}</Button></Link>

                  <Divider />

                  {/* menu */}
                  <Button variant="ghost" justifyContent="flex-start" leftIcon={<FaRegUser size="1rem" />}>{t("menu.profile")}</Button>
                  <Button variant="ghost" justifyContent="flex-start" leftIcon={<FaRegQuestionCircle size="1rem" />}>{t("menu.settings")}</Button>
                  <Button variant="ghost" justifyContent="flex-start" leftIcon={<FaCog size="1rem" />}>{t("menu.aboutPage")}</Button>

                  <Flex alignItems="center" gap={2} pl={2}>
                    <BsFillMoonStarsFill size="1rem" />
                    <ResponsiveText fontSize="md">{t("menu.darkMode")}</ResponsiveText>
                    <Switch
                      isChecked={colorMode === "dark"}
                      onChange={toggleColorMode}
                      colorScheme="accent"
                    />
                  </Flex>
                </VStack>
              </DrawerBody>
            </DrawerContent>
          </Drawer>
        </>
      )}
    </Flex>
  );
}
