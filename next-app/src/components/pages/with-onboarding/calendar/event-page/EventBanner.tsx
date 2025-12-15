"use client";

import React from "react";
import {
  Box,
  VStack,
  HStack,
  Badge,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  useDisclosure,
  Skeleton,
  Button,
} from "@chakra-ui/react";
import ResponsiveHeading from "@/components/common/texts/ResponsiveHeading";
import type { EventSchemaTypePopulated } from "@/schemas/model/event/event-types";
import { getDurationLabel } from "@/util/formatters";
import { AsyncImage } from "@/components/common/AsyncImage";
import EventForm from "../event-form/EventForm";
import type { AddEventSchemaType } from "@/schemas/pages/with-onboarding/events/events-types";
import { EventType } from "@/club-preset/event-type";

function convertEventToFormData(
  event: EventSchemaTypePopulated
): AddEventSchemaType {
  const baseData = {
    title: event.title,
    description: event.description,
    location: event.location,
    group: event.group.id,
    organizer: event.organizer.id,
    duration: event.duration,
    additionalDescription: event.additionalDescription,
    imageUrl: event.imageUrl,
  };

  // Convert populated data back to IDs
  switch (event.data.type) {
    case EventType.TOURNAMENT_PAIRS:
      return {
        ...baseData,
        data: {
          type: EventType.TOURNAMENT_PAIRS,
          tournamentType: event.data.tournamentType,
          arbiter: event.data.arbiter?.id,
        },
      };
    case EventType.TOURNAMENT_TEAMS:
      return {
        ...baseData,
        data: {
          type: EventType.TOURNAMENT_TEAMS,
          tournamentType: event.data.tournamentType,
          arbiter: event.data.arbiter?.id,
        },
      };
    case EventType.LEAGUE_MEETING:
      return {
        ...baseData,
        data: {
          type: EventType.LEAGUE_MEETING,
          tournamentType: event.data.tournamentType,
          session: event.data.session.map((s) => ({
            contestants: {
              firstPair: {
                first: s.contestants.firstPair.first.id,
                second: s.contestants.firstPair.second.id,
              },
              secondPair: {
                first: s.contestants.secondPair.first.id,
                second: s.contestants.secondPair.second.id,
              },
            },
            opponentTeamName: s.opponentTeamName,
          })),
        },
      };
    case EventType.TRAINING:
      return {
        ...baseData,
        data: {
          type: EventType.TRAINING,
          coach: event.data.coach?.id,
          topic: event.data.topic,
        },
      };
    default:
      return {
        ...baseData,
        data: {
          type: EventType.OTHER,
        },
      };
  }
}

export default function EventBanner({
  event,
  loading,
}: {
  event?: EventSchemaTypePopulated;
  loading?: boolean;
}) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: isEditOpen,
    onOpen: onEditOpen,
    onClose: onEditClose,
  } = useDisclosure();

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
          <AsyncImage
            src={event?.imageUrl}
            borderTopRadius="md"
            w="100%"
            maxW="100%"
            h={{ base: "160px", md: "220px" }}
            mb={4}
            cursor="zoom-in"
            onClick={onOpen}
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
                <AsyncImage
                  src={event?.imageUrl}
                  alt={event?.title || "Event Image"}
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
        {event?.isAdmin && (
          <>
            <Button
              mt="1rem"
              colorScheme="accent"
              variant="outline"
              onClick={onEditOpen}
            >
              Zmodyfikuj dane o wydarzeniu
            </Button>
            {event && (
              <EventForm
                isOpen={isEditOpen}
                onClose={onEditClose}
                mode="modify"
                eventId={event.id}
                groupId={event.group.id}
                initialData={convertEventToFormData(event)}
              />
            )}
          </>
        )}
      </VStack>
    </Box>
  );
}
