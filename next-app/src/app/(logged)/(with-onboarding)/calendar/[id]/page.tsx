import { Box, Flex, Heading, Text, VStack, HStack, Badge, List, ListItem, Image, Divider } from "@chakra-ui/react";
import { EventType } from "@/club-preset/event-type";
import EventBanner from "@/components/pages/with-onboarding/calendar/event-page/EventBanner";
import EventDetails from "@/components/pages/with-onboarding/calendar/event-page/EventDetails";
import EventSpecificData from "@/components/pages/with-onboarding/calendar/event-page/EventSpecificData";
import EventEnrollment from "@/components/pages/with-onboarding/calendar/event-page/EventEnrollment";
import BackLink from "@/components/common/BackLink";

export default function EventPage() {
  // zahardcodowany typ wydarzenia — zmień tu, żeby przetestować różne widoki
  const selectedType = EventType.LEAGUE_MEETING as EventType;

  // wspólne pola mocka
  const mockCommon = {
    id: "evt-123",
    title: "Zjazd III Ligi #1",
    description: "Cykliczne rozgrywki ligowe dla zaawansowanych graczy.",
    location: "Sala 101, Budynek A",
    organizer: "Just Bridge AGH",
    attendees: ["user-1", "user-2", "user-3"],
    group: "group-789",
    duration: {
      startsAt: new Date("2025-10-25T12:00:00"),
      endsAt: new Date("2025-10-25T13:30:00"),
    },
    additionalDescription: "Dodatkowe informacje o wydarzeniu.",
    imageUrl: "https://picsum.photos/960/400",
  };

  // prepare mock specific data and pass it to EventSpecificData (page-level)
  let mockSpecificData: any = null;
  if (selectedType === EventType.TOURNAMENT) {
    mockSpecificData = {
      tournamentType: "MAXy",
      arbiter: "Karol Kraska",
      contestantsPairs: [
        { first: "Szymon Kubiczek", second: "Asia Konieczny" },
        { first: "Jacek Placek", second: "Placek Jacek" },
      ],
    };
  } else if (selectedType === EventType.LEAGUE_MEETING) {
    // 3 matches, each with two halves (half 1 and half 2) -> 6 session entries
    mockSpecificData = {
      tournamentType: "Liga regionalna",
      session: [
        // match 1 halves
        {
          id: "m1-h1",
          matchNumber: 1,
          half: 1,
          contestants: {
            firstPair: { first: "Adam Nowak", second: "Ewa Kowalska" },
            secondPair: { first: "Piotr Zieliński", second: "Marta Wiśniewska" },
          },
          opponentTeamName: "Team Alfa",
        },
        {
          id: "m1-h2",
          matchNumber: 1,
          half: 2,
          contestants: {
            firstPair: { first: "Adam Nowak", second: "Ewa Kowalska" },
            secondPair: { first: "Piotr Zieliński", second: "Marta Wiśniewska" },
          },
          opponentTeamName: "Team Alfa",
        },
        // match 2 halves
        {
          id: "m2-h1",
          matchNumber: 2,
          half: 1,
          contestants: {
            firstPair: { first: "Kamil Nowicki", second: "Anna Lis" },
            secondPair: { first: "Tomasz Górski", second: "Magda Malinowska" },
          },
          opponentTeamName: "Team Beta",
        },
        {
          id: "m2-h2",
          matchNumber: 2,
          half: 2,
          contestants: {
            firstPair: { first: "Kamil Nowicki", second: "Anna Lis" },
            secondPair: { first: "Tomasz Górski", second: "Magda Malinowska" },
          },
          opponentTeamName: "Team Beta",
        },
        // match 3 halves
        {
          id: "m3-h1",
          matchNumber: 3,
          half: 1,
          contestants: {
            firstPair: { first: "Łukasz Bąk", second: "Beata Krawczyk" },
            secondPair: { first: "Robert Sawa", second: "Agnieszka Olszewska" },
          },
          opponentTeamName: "Team Gamma",
        },
        {
          id: "m3-h2",
          matchNumber: 3,
          half: 2,
          contestants: {
            firstPair: { first: "Łukasz Bąk", second: "Beata Krawczyk" },
            secondPair: { first: "Robert Sawa", second: "Agnieszka Olszewska" },
          },
          opponentTeamName: "Team Gamma",
        },
      ],
    };
  } else if (selectedType === EventType.TRAINING) {
    mockSpecificData = { coach: "coach-999", topic: "Obrona w praktyce" };
  } else {
    mockSpecificData = { note: "Wydarzenie ogólne" };
  }

  const mockEvent = { ...mockCommon, data: { type: selectedType } };

  return (
    <Flex align="stretch" height="calc(100vh - 5rem)" bgColor={"border.50"} overflowY="auto">
      <Box maxW="920px" w="100%" mx="auto">
        {/* Back link above all content */}
        <Box pt={4} pb={2}>
          <BackLink>Wróć do kalendarza</BackLink>
        </Box>

        {/* oba komponenty na całą szerokość, oddzielone 2rem gapu */}
        <VStack spacing="2rem" align="stretch" pb={8}>
          <EventBanner
            title={mockEvent.title}
            imageUrl={mockCommon.imageUrl}
            group={mockEvent.group}
            location={mockEvent.location}
            duration={mockEvent.duration}
          />

          {/* Enrollment: tylko dla TURNIEST lub OTHER */}
          {(selectedType === EventType.TOURNAMENT || selectedType === EventType.OTHER) && (
            <EventEnrollment eventType={selectedType} />
          )}

          <EventDetails
            description={mockEvent.description}
            additionalDescription={mockEvent.additionalDescription}
            organizer={mockEvent.organizer}
            attendees={mockEvent.attendees}
            eventType={selectedType}
          />

          {/* event-specific data is rendered at page level with 2rem gap from details */}
          <EventSpecificData eventType={selectedType} eventData={mockSpecificData} />
        </VStack>
      </Box>
    </Flex>
  );
}
