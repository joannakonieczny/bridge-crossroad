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
import type { EventSchemaTypePopulated } from "@/schemas/model/event/event-types";
import { getDurationLabel } from "@/util/formatters";
import { GenericImage } from "@/components/common/GenericImage";
import LandscapePlaceholder from "@/assets/fallbacks/landscape-placeholder.svg";

const mockedImageUrl = "https://picsum.photos/id/237/200/300";

export default function EventBanner({
  event,
  loading,
}: {
  event?: EventSchemaTypePopulated;
  loading?: boolean;
}) {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <Box
      w="100%"
      maxW="100%"
      overflowX="hidden"
      boxSizing="border-box"
      bgColor="bg"
      mt={4}
      px={{ base: 3, md: 0 }}
    >
      {loading ? (
        <Skeleton
          height={{ base: "160px", md: "220px" }}
          mb={4}
          borderTopRadius="md"
        />
      ) : (
        <>
          <GenericImage
            fallback={LandscapePlaceholder}
            imageProps={{
              src: event?.imageUrl || undefined,
              alt: "Event Image",
              borderTopRadius: "md",
              w: "100%",
              maxW: "100%",
              h: { base: "160px", md: "220px" },
              objectFit: "cover",
              mb: 4,
              cursor: "zoom-in",
              onClick: onOpen,
            }}
          />

          <Modal isOpen={isOpen} onClose={onClose} isCentered size="full">
            <ModalOverlay
              bg="rgba(0,0,0,0.7)"
              backdropFilter="auto"
              backdropBlur="2px"
            />
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
              <ModalBody
                display="flex"
                alignItems="center"
                justifyContent="center"
                p={0}
              >
                <GenericImage
                  fallback={LandscapePlaceholder}
                  imageProps={{
                    src: event?.imageUrl || undefined,
                    alt: "Event Image",
                    maxH: { base: "calc(100vh - 48px)", md: "90vh" },
                    maxW: { base: "calc(100vw - 32px)", md: "90vw" },
                    objectFit: "contain",
                    borderRadius: "md",
                    boxShadow: "lg",
                    onClick: (e) => e.stopPropagation(),
                  }}
                />
              </ModalBody>
            </ModalContent>
          </Modal>
        </>
      )}

      <VStack align="start" spacing={2} p={4} w="100%">
        {loading ? (
          <Skeleton height="28px" w="40%" />
        ) : (
          <ResponsiveHeading text={event?.title || ""} fontSize="xl" />
        )}
        <HStack spacing={3} flexWrap="wrap">
          {loading ? (
            <Skeleton height="20px" w="20%" />
          ) : (
            <>
              <Badge bg="secondary.400" color="bg" whiteSpace="normal">
                {event?.group.name}
              </Badge>
              <Badge bg="purple.300" color="bg" whiteSpace="normal">
                {getDurationLabel(event?.duration)}
              </Badge>
              {event?.location && (
                <Badge bg="gray.400" color="bg" whiteSpace="normal">
                  {event.location}
                </Badge>
              )}
            </>
          )}
        </HStack>
      </VStack>
    </Box>
  );
}
