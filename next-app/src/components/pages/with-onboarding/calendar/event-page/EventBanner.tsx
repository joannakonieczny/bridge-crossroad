"use client";

import React from "react";
import {
  Box,
  VStack,
  Heading,
  HStack,
  Badge,
  Image,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  useDisclosure,
} from "@chakra-ui/react";

export default function EventBanner({
  title,
  imageUrl,
  group,
  location,
  duration,
}: {
  title: string;
  imageUrl?: string;
  group?: string;
  location?: string;
  duration: { startsAt: Date; endsAt: Date };
}) {
  // full date/time range label, e.g. "25.10.2025 12:00:00 — 25.10.2025 13:30:00"
  const dateRangeLabel = `${duration.startsAt.toLocaleString("pl-PL")} — ${duration.endsAt.toLocaleString("pl-PL")}`;
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <Box w="100%" bgColor="bg" mt={4}>
      {imageUrl && (
        <>
          <Image
            src={imageUrl}
            alt={title}
            borderTopRadius="md"
            w="100%"
            h="220px"
            objectFit="cover"
            mb={4}
            cursor="zoom-in"
            onClick={onOpen}
          />

          {/* fullscreen modal with dark translucent overlay */}
          <Modal isOpen={isOpen} onClose={onClose} isCentered size="full">
            <ModalOverlay bg="rgba(0,0,0,0.7)" backdropFilter="auto" backdropBlur="2px" />
            {/* clicking ModalContent (area around image) closes modal */}
            <ModalContent
              bg="transparent"
              boxShadow="none"
              display="flex"
              alignItems="center"
              justifyContent="center"
              onClick={onClose}
            >
              <ModalBody display="flex" alignItems="center" justifyContent="center" p={0}>
                {/* stopPropagation prevents clicks on the image from closing the modal */}
                <Image
                  src={imageUrl}
                  alt={title}
                  maxH="90vh"
                  maxW="90vw"
                  objectFit="contain"
                  borderRadius="md"
                  boxShadow="lg"
                  onClick={(e) => e.stopPropagation()}
                />
              </ModalBody>
            </ModalContent>
          </Modal>
        </>
      )}

      <VStack align="start" spacing={2} p={4}>
        <Heading size="lg">{title}</Heading>
        <HStack spacing={3}>
          {group && <Badge colorScheme="yellow">{group}</Badge>}
          {/* full date/time range shown as badge */}
          <Badge colorScheme="purple">{dateRangeLabel}</Badge>
          {location && <Badge>{location}</Badge>}
        </HStack>
      </VStack>
    </Box>
  );
}
