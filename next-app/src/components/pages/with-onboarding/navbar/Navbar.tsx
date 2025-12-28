"use client";

import { useMemo } from "react";
import {
  Flex,
  Tabs,
  TabList,
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
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  useMediaQuery,
  useToast,
  Avatar,
} from "@chakra-ui/react";
import {
  FaBars,
  FaRegUser,
  FaCog,
  FaRegQuestionCircle,
  FaAngleDown,
  FaAngleRight,
  FaSignOutAlt,
} from "react-icons/fa";
import { BsFillMoonStarsFill } from "react-icons/bs";
import { usePathname } from "next/navigation";
import { ROUTES } from "@/routes";
import Logo from "@/components/common/Logo";
import { useTranslations } from "@/lib/typed-translations";
import { useColorMode } from "@chakra-ui/react";
import ResponsiveText from "@/components/common/texts/ResponsiveText";
import { useUserInfoQuery } from "@/lib/queries";
import NavbarTab from "./NavbarTab";
import NavbarDrawerItem from "./NavbarDrawerItem";
import NavbarDrawerMenuItem from "./NavbarDrawerMenuItem";
import { logout } from "@/services/auth/api";

const navbarTabs = [
  ROUTES.dashboard,
  ROUTES.calendar.index,
  ROUTES.groups.index,
  ROUTES.find_partner,
  ROUTES.tools,
];

export default function Navbar() {
  const pathname = usePathname();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const userQ = useUserInfoQuery();

  const defaultIndex = useMemo(() => {
    const match = navbarTabs.findIndex((path) => pathname.startsWith(path));
    return match === -1 ? 0 : match;
  }, [pathname]);

  const t = useTranslations("components.Navbar");
  const { colorMode, toggleColorMode } = useColorMode();

  const [isDesktop] = useMediaQuery("(min-width: 1200px)");

  const toast = useToast();

  const first = userQ.data?.name?.firstName ?? "";
  const last = userQ.data?.name?.lastName ?? "";
  const displayName = [first, last].filter(Boolean).join(" ") || "User";

  function handleLogout() {
    const promise = logout();
    toast.promise(promise, {
      loading: { title: t("logoutToast.loading") },
      success: { title: t("logoutToast.success") },
      error: { title: t("logoutToast.error") },
    });
  }

  return (
    <Flex
      as="nav"
      bg="bg"
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
              <NavbarTab href={ROUTES.dashboard}>
                {t("tabs.dashboard")}
              </NavbarTab>
              <NavbarTab href={ROUTES.calendar.index}>
                {t("tabs.calendar")}
              </NavbarTab>
              <NavbarTab href={ROUTES.groups.index}>
                {t("tabs.groups")}
              </NavbarTab>
              <NavbarTab href={ROUTES.find_partner}>
                {t("tabs.findPartner")}
              </NavbarTab>
              <NavbarTab href={ROUTES.tools}>{t("tabs.tools")}</NavbarTab>
            </TabList>
            <TabIndicator
              mt="-1.5px"
              height="2px"
              bg="fonts"
              borderRadius="1px"
            />
          </Tabs>

          {/* profile + dropdown menu */}
          <Flex flex={1} justifyContent="flex-end" alignItems="center" gap={4}>
            <Avatar boxSize="3rem" name={displayName} />
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
                    bg="bg"
                    borderColor="border.200"
                    boxShadow="md"
                  >
                    <MenuItem icon={<FaRegUser size="1rem" />}>
                      {t("menu.profile")}
                    </MenuItem>
                    <MenuItem icon={<FaRegQuestionCircle size="1rem" />}>
                      {t("menu.settings")}
                    </MenuItem>
                    <MenuItem icon={<FaCog size="1rem" />}>
                      {t("menu.aboutPage")}
                    </MenuItem>
                    <MenuItem
                      icon={<FaSignOutAlt size="1rem" />}
                      onClick={handleLogout}
                    >
                      {t("menu.logout")}
                    </MenuItem>
                    <Divider />
                    <Flex alignItems="center" gap={2} pl={3} py={2}>
                      <BsFillMoonStarsFill size="1rem" />
                      <ResponsiveText fontSize="md">
                        {t("menu.darkMode")}
                      </ResponsiveText>
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
              <DrawerHeader
                borderBottomWidth="1px"
                display="flex"
                alignItems="center"
                justifyContent="space-between"
              >
                <Avatar boxSize="3rem" name={displayName} />

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
                  <NavbarDrawerItem href={ROUTES.dashboard}>
                    {t("tabs.dashboard")}
                  </NavbarDrawerItem>
                  <NavbarDrawerItem href={ROUTES.calendar.index}>
                    {t("tabs.calendar")}
                  </NavbarDrawerItem>
                  <NavbarDrawerItem href={ROUTES.groups.index}>
                    {t("tabs.groups")}
                  </NavbarDrawerItem>
                  <NavbarDrawerItem href={ROUTES.find_partner}>
                    {t("tabs.findPartner")}
                  </NavbarDrawerItem>
                  <NavbarDrawerItem href={ROUTES.tools}>
                    {t("tabs.tools")}
                  </NavbarDrawerItem>
                  <Divider />

                  {/* menu */}
                  <NavbarDrawerMenuItem icon={<FaRegUser size="1rem" />}>
                    {t("menu.profile")}
                  </NavbarDrawerMenuItem>

                  <NavbarDrawerMenuItem
                    icon={<FaRegQuestionCircle size="1rem" />}
                  >
                    {t("menu.settings")}
                  </NavbarDrawerMenuItem>

                  <NavbarDrawerMenuItem icon={<FaCog size="1rem" />}>
                    {t("menu.aboutPage")}
                  </NavbarDrawerMenuItem>

                  <NavbarDrawerMenuItem
                    icon={<FaSignOutAlt size="1rem" />}
                    onClick={handleLogout}
                  >
                    {t("menu.logout")}
                  </NavbarDrawerMenuItem>

                  <Flex alignItems="center" gap={2} pl={2}>
                    <BsFillMoonStarsFill size="1rem" />
                    <ResponsiveText fontSize="md">
                      {t("menu.darkMode")}
                    </ResponsiveText>
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
