"use client";

import React, { useRef, useState } from "react";
import {
  Box,
  Container,
  Heading,
  VStack,
  Spinner,
  Center,
  Flex,
  Drawer,
  DrawerOverlay,
  DrawerContent as ChakraDrawerContent,
  DrawerBody,
  IconButton,
  useDisclosure,
  useBreakpointValue,
} from "@chakra-ui/react";
import { FaBars } from "react-icons/fa";
import { useUserInfoQuery } from "@/lib/queries";
import { useTranslations } from "@/lib/typed-translations";
import { ChangeEmailForm } from "./components/ChangeEmailForm";
import { ChangePasswordForm } from "./components/ChangePasswordForm";
import { ChangeProfileForm } from "./components/ChangeProfileForm";
import { ChangeOnboardingForm } from "./components/ChangeOnboardingForm";

type SectionId = "profile" | "email" | "password" | "onboarding";

export default function UserProfilePage() {
  const t = useTranslations("pages.UserProfilePage");
  const { data: user, isLoading } = useUserInfoQuery();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const isDesktop = useBreakpointValue({ base: false, md: true }) ?? false;

  const [activeSection, setActiveSection] = useState<SectionId>("profile");

  // Refs for scrolling to sections
  const profileRef = useRef<HTMLDivElement>(null);
  const emailRef = useRef<HTMLDivElement>(null);
  const passwordRef = useRef<HTMLDivElement>(null);
  const onboardingRef = useRef<HTMLDivElement>(null);

  const scrollToSection = (sectionId: SectionId) => {
    const refs = {
      profile: profileRef,
      email: emailRef,
      password: passwordRef,
      onboarding: onboardingRef,
    };

    const targetRef = refs[sectionId];
    if (targetRef.current) {
      targetRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
      setActiveSection(sectionId);
      if (!isDesktop) {
        onClose();
      }
    }
  };

  const DrawerMenuItem = ({
    sectionId,
    label,
  }: {
    sectionId: SectionId;
    label: string;
  }) => (
    <Box
      as="button"
      w="full"
      textAlign="left"
      px={4}
      py={3}
      borderRadius="md"
      bg={activeSection === sectionId ? "accent.100" : "transparent"}
      color={activeSection === sectionId ? "accent.700" : "fonts"}
      fontWeight={activeSection === sectionId ? "semibold" : "normal"}
      _hover={{
        bg: activeSection === sectionId ? "accent.100" : "bg.100",
      }}
      onClick={() => scrollToSection(sectionId)}
      transition="all 0.2s"
    >
      {label}
    </Box>
  );

  const DrawerContent = () => (
    <VStack align="stretch" spacing={2}>
      <DrawerMenuItem sectionId="profile" label={t("sections.profile")} />
      <DrawerMenuItem sectionId="email" label={t("sections.email")} />
      <DrawerMenuItem sectionId="password" label={t("sections.password")} />
      {user?.onboardingData && (
        <DrawerMenuItem
          sectionId="onboarding"
          label={t("sections.onboarding")}
        />
      )}
    </VStack>
  );

  if (isLoading || !user) {
    return (
      <Center minH="50vh">
        <Spinner size="xl" color="accent.500" />
      </Center>
    );
  }

  return (
    <Flex h="100%" position="relative">
      {/* Mobile drawer toggle button */}
      {!isDesktop && (
        <IconButton
          aria-label="Open menu"
          icon={<FaBars size="1.5rem" />}
          variant="ghost"
          onClick={onOpen}
          position="fixed"
          top={4}
          left={4}
          zIndex={1001}
        />
      )}

      {/* Desktop drawer - always visible */}
      {isDesktop && (
        <Box
          w="280px"
          minH="100vh"
          bg="bg"
          borderRightWidth="1px"
          borderColor="border.200"
          p={6}
          position="sticky"
          top={0}
          left={0}
          h="100vh"
          overflowY="auto"
        >
          <Heading size="md" mb={6}>
            {t("heading")}
          </Heading>
          <DrawerContent />
        </Box>
      )}

      {/* Mobile drawer */}
      {!isDesktop && (
        <Drawer placement="left" onClose={onClose} isOpen={isOpen}>
          <DrawerOverlay />
          <ChakraDrawerContent bg="bg">
            <DrawerBody p={6}>
              <Heading size="md" mb={6}>
                {t("heading")}
              </Heading>
              <DrawerContent />
            </DrawerBody>
          </ChakraDrawerContent>
        </Drawer>
      )}

      {/* Main content area */}
      <Box flex={1} overflowY="auto">
        <Container maxW="container.md" py={8} px={{ base: 8, md: 12 }}>
          <VStack spacing={12} align="stretch">
            {/* Profile Section */}
            <Box ref={profileRef} id="profile-section">
              <Heading size="lg" mb={4}>
                {t("sections.profile")}
              </Heading>
              <ChangeProfileForm user={user} />
            </Box>

            {/* Email Section */}
            <Box ref={emailRef} id="email-section">
              <Heading size="lg" mb={4}>
                {t("sections.email")}
              </Heading>
              <ChangeEmailForm currentEmail={user.email} />
            </Box>

            {/* Password Section */}
            <Box ref={passwordRef} id="password-section">
              <Heading size="lg" mb={4}>
                {t("sections.password")}
              </Heading>
              <ChangePasswordForm />
            </Box>

            {/* Onboarding Section */}
            {user.onboardingData && (
              <Box ref={onboardingRef} id="onboarding-section">
                <Heading size="lg" mb={4}>
                  {t("sections.onboarding")}
                </Heading>
                <ChangeOnboardingForm user={user} />
              </Box>
            )}
          </VStack>
        </Container>
      </Box>
    </Flex>
  );
}
