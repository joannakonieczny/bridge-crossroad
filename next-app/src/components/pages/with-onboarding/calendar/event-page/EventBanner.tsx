"use client";

import React from "react";
import {
  Box,
  VStack,
  HStack,
  Badge,
  Image,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  useDisclosure,
  Skeleton,
} from "@chakra-ui/react";
import ResponsiveHeading from "@/components/common/texts/ResponsiveHeading";
import { groupInfo } from "@/schemas/model/event/event-types";
import { useTranslations } from "@/lib/typed-translations";

export default function EventBanner({
  title,
  imageUrl,
  group,
  location,
  duration,
  loading,
}: {
  title?: string;
  imageUrl?: string;
  group?: groupInfo;
  location?: string;
  duration?: { startsAt: Date; endsAt: Date };
  loading?: boolean;
}) {
  const t = useTranslations("components.EventPage.EventBanner");
  const dateRangeLabel = duration
    ? `${duration.startsAt.toLocaleString("pl-PL")} — ${duration.endsAt.toLocaleString("pl-PL")}`
    : "";

  const { isOpen, onOpen, onClose } = useDisclosure();

  const groupLabel = typeof group === "string" ? group : group?.name ?? undefined;

  return (
    <Box w="100%" maxW="100%" overflowX="hidden" boxSizing="border-box" bgColor="bg" mt={4} px={{ base: 3, md: 0 }}>
      {loading ? (
        <Skeleton height={{ base: "160px", md: "220px" }} mb={4} borderTopRadius="md" />
      ) : (
        imageUrl && (
          <>
            <Image
              src={imageUrl}
              alt={typeof title === "string" && title ? title : t("imageAltFallback")}
              borderTopRadius="md"
              w="100%"
              maxW="100%"
              h={{ base: "160px", md: "220px" }}
              objectFit="cover"
              mb={4}
              cursor="zoom-in"
              onClick={onOpen}
            />

            <Modal isOpen={isOpen} onClose={onClose} isCentered size="full">
              <ModalOverlay bg="rgba(0,0,0,0.7)" backdropFilter="auto" backdropBlur="2px" />
              <ModalContent
                bg="transparent"
                boxShadow="none"
                display="flex"
                alignItems="center"
                justifyContent="center"
                onClick={onClose}
                w="100%"
                maxW="100vw"
                px={{ base: 4, md: 0 }}
              >
                <ModalBody display="flex" alignItems="center" justifyContent="center" p={0}>
                  <Image
                    src={imageUrl}
                    alt={typeof title === "string" && title ? title : t("imageAltFallback")}
                    maxH={{ base: "calc(100vh - 48px)", md: "90vh" }}
                    maxW={{ base: "calc(100vw - 32px)", md: "90vw" }}
                    objectFit="contain"
                    borderRadius="md"
                    boxShadow="lg"
                    onClick={(e) => e.stopPropagation()}
                  />
                </ModalBody>
              </ModalContent>
            </Modal>
          </>
        )
      )}

      <VStack align="start" spacing={2} p={4} w="100%">
        {loading ? (
          <Skeleton height="28px" w="40%" />
        ) : (
          <ResponsiveHeading text={title ?? ""} fontSize="xl" />
        )}
        <HStack spacing={3} flexWrap="wrap">
          {loading ? (
            <Skeleton height="20px" w="20%" />
          ) : (
            <>
              {groupLabel && <Badge colorScheme="yellow" whiteSpace="normal">{groupLabel}</Badge>}
              <Badge colorScheme="purple" whiteSpace="normal">{dateRangeLabel}</Badge>
              {location && <Badge whiteSpace="normal">{location}</Badge>}
            </>
          )}
        </HStack>
      </VStack>
    </Box>
  );
}
