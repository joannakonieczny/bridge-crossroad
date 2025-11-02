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
  Skeleton,
} from "@chakra-ui/react";

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
  group?: any; // string or populated group object
  location?: string;
  duration?: { startsAt: Date; endsAt: Date };
  loading?: boolean;
}) {
  // full date/time range label, e.g. "25.10.2025 12:00:00 — 25.10.2025 13:30:00"
  const dateRangeLabel = duration
    ? `${duration.startsAt.toLocaleString("pl-PL")} — ${duration.endsAt.toLocaleString("pl-PL")}`
    : "";

  const { isOpen, onOpen, onClose } = useDisclosure();

  // derive group label locally (string or object)
  const groupLabel = typeof group === "string" ? group : group?.name ?? undefined;

  return (
    <Box w="100%" bgColor="bg" mt={4}>
      {/* image area: skeleton when loading, otherwise image if provided */}
      {loading ? (
        <Skeleton height="220px" mb={4} borderTopRadius="md" />
      ) : (
        imageUrl && (
          <>
            <Image
              src={imageUrl}
              alt={typeof title === "string" ? title : ""}
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
                    alt={typeof title === "string" ? title : ""}
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
        )
      )}

      <VStack align="start" spacing={2} p={4}>
        {loading ? <Skeleton height="28px" w="40%" /> : <Heading size="lg">{title}</Heading>}
        <HStack spacing={3}>
          {loading ? (
            <Skeleton height="20px" w="20%" />
          ) : (
            <>
              {groupLabel && <Badge colorScheme="yellow">{groupLabel}</Badge>}
              {/* full date/time range shown as badge */}
              <Badge colorScheme="purple">{dateRangeLabel}</Badge>
              {location && <Badge>{location}</Badge>}
            </>
          )}
        </HStack>
      </VStack>
    </Box>
  );
}
