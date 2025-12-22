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
  useBreakpointValue,
  Portal,
} from "@chakra-ui/react";
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
  const isDesktop = useBreakpointValue({ base: false, md: true });

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
      const elementPosition = targetRef.current.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.scrollY - 100;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
      setActiveSection(sectionId);
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
    <Flex>
      {/* Desktop drawer - always visible */}
      {isDesktop && (
        <Portal>
          <Box
            w="280px"
            bg="bg"
            borderRightWidth="1px"
            borderColor="border.200"
            p={6}
            position="fixed"
            top="64px"
            left={0}
            zIndex={10}
            h="calc(100vh - 64px)"
          >
            <Heading size="md" my={6}>
              {t("heading")}
            </Heading>
            <DrawerContent />
          </Box>
        </Portal>
      )}

      {/* Main content area */}
      <Box flex={1} ml={isDesktop ? "280px" : 0}>
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
