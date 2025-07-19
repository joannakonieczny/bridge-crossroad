import { Box, Flex, VStack, Image } from "@chakra-ui/react";
import InfoTable from "./InfoTable";
import ProfileBanner from "./ProfileBanner";
import PastContests from "./PastContests";
import UpcomingEvents from "./UpcomingEvents";
import dashboardSplashArt from "@/assets/dashboard/splash-art.svg";

export default function Dashboard() {
  return (
    <Flex
      minHeight="100vh"
      width="100%"
      py={{ base: "2rem", md: "3rem" }}
      px={{ base: "1rem", md: "4rem", lg: "6rem", xl: "10rem" }}
      gap={{ base: "2rem", lg: "4rem" }}
    >
      <Box flex="1" width="100%">
        <Flex
          direction={{ base: "column", lg: "row" }}
          gap={{ base: "2rem", lg: "4rem" }}
          align="start"
          width="100%"
        >
          <VStack align="start" width="100%" spacing="2rem">
            <ProfileBanner />
            <InfoTable />
            <PastContests />
          </VStack>

          <VStack align="end" width="100%" spacing="2rem">
            <Image
              src={ dashboardSplashArt }
              alt="Splash Art Left"
              objectPosition="end"
              width="100%"
              height="auto"
            />
            <UpcomingEvents />
          </VStack>
        </Flex>
      </Box>
    </Flex>
  );
}
