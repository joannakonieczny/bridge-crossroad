"use client";

import {
  Box,
  VStack,
  Button,
  HStack,
  Text,
  Avatar,
  AvatarGroup,
  Icon,
} from "@chakra-ui/react";
import { FaUserPlus, FaUserMinus } from "react-icons/fa";
import ResponsiveHeading from "@/components/common/texts/ResponsiveHeading";
import type { EventSchemaTypePopulated } from "@/schemas/model/event/event-types";
import { getPersonLabel } from "@/util/formatters";

type EventEnrollmentProps = {
  event: EventSchemaTypePopulated;
};

export default function EventEnrollment({ event }: EventEnrollmentProps) {
  const participants = event.attendees;
  const eventId = event.id;
  const isEnrolled = event.isAttending ?? false;
  const participantsCount = participants.length;

  const handleEnroll = () => console.log("Zapis na wydarzenie", { eventId });
  const handleUnenroll = () =>
    console.log("Wypisanie z wydarzenia", { eventId });

  return (
    <Box bg="bg" borderRadius="md" boxShadow="sm" p={4} w="100%">
      <VStack align="start" spacing={4}>
        <ResponsiveHeading
          text={"Zapis na wydarzenie"}
          fontSize="sm"
          barOrientation="horizontal"
        />

        <HStack spacing={4} w="100%" align="center" justify="space-between">
          <HStack spacing={3} align="center">
            {participantsCount && (
              <AvatarGroup size="sm" max={4}>
                {participants.slice(0, 4).map((p, i) => {
                  return <Avatar key={i} name={getPersonLabel(p)} />;
                })}
              </AvatarGroup>
            )}
            <VStack spacing={0} align="start">
              <Text fontWeight="semibold">
                {participantsCount
                  ? `${participantsCount} uczestników`
                  : "Brak uczestników"}
              </Text>
            </VStack>
          </HStack>
        </HStack>

        {isEnrolled ? (
          <Button
            leftIcon={<Icon as={FaUserMinus} />}
            colorScheme="red"
            variant="outline"
            w="100%"
            onClick={handleUnenroll}
            fontSize={{ base: "sm", md: "md" }}
          >
            Wypisz się
          </Button>
        ) : (
          <Button
            leftIcon={<Icon as={FaUserPlus} />}
            colorScheme="accent"
            variant="solid"
            w="100%"
            onClick={handleEnroll}
            fontSize={{ base: "sm", md: "md" }}
          >
            Zapisz się
          </Button>
        )}
      </VStack>
    </Box>
  );
}
