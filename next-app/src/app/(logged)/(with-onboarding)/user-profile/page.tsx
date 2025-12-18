"use client";

import React from "react";
import {
  Box,
  Container,
  Heading,
  VStack,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Spinner,
  Center,
} from "@chakra-ui/react";
import { useUserInfoQuery } from "@/lib/queries";
import { useTranslations } from "@/lib/typed-translations";
import { ChangeEmailForm } from "./components/ChangeEmailForm";
import { ChangePasswordForm } from "./components/ChangePasswordForm";
import { ChangeProfileForm } from "./components/ChangeProfileForm";
import { ChangeOnboardingForm } from "./components/ChangeOnboardingForm";

export default function UserProfilePage() {
  const t = useTranslations("pages.UserProfilePage");
  const { data: user, isLoading } = useUserInfoQuery();

  if (isLoading || !user) {
    return (
      <Center minH="50vh">
        <Spinner size="xl" color="accent.500" />
      </Center>
    );
  }

  return (
    <Container maxW="container.md" py={8}>
      <VStack spacing={6} align="stretch">
        <Heading size="lg">{t("heading")}</Heading>

        <Accordion allowMultiple defaultIndex={[0]}>
          <AccordionItem>
            <h2>
              <AccordionButton>
                <Box flex="1" textAlign="left" fontWeight="semibold">
                  {t("sections.profile")}
                </Box>
                <AccordionIcon />
              </AccordionButton>
            </h2>
            <AccordionPanel pb={4}>
              <ChangeProfileForm user={user} />
            </AccordionPanel>
          </AccordionItem>

          <AccordionItem>
            <h2>
              <AccordionButton>
                <Box flex="1" textAlign="left" fontWeight="semibold">
                  {t("sections.email")}
                </Box>
                <AccordionIcon />
              </AccordionButton>
            </h2>
            <AccordionPanel pb={4}>
              <ChangeEmailForm currentEmail={user.email} />
            </AccordionPanel>
          </AccordionItem>

          <AccordionItem>
            <h2>
              <AccordionButton>
                <Box flex="1" textAlign="left" fontWeight="semibold">
                  {t("sections.password")}
                </Box>
                <AccordionIcon />
              </AccordionButton>
            </h2>
            <AccordionPanel pb={4}>
              <ChangePasswordForm />
            </AccordionPanel>
          </AccordionItem>

          <AccordionItem>
            <h2>
              <AccordionButton>
                <Box flex="1" textAlign="left" fontWeight="semibold">
                  {t("sections.onboarding")}
                </Box>
                <AccordionIcon />
              </AccordionButton>
            </h2>
            <AccordionPanel pb={4}>
              <ChangeOnboardingForm user={user} />
            </AccordionPanel>
          </AccordionItem>
        </Accordion>
      </VStack>
    </Container>
  );
}
