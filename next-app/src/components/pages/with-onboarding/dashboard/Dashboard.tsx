"use client";

import { Box, Flex, Grid, VStack, useBreakpointValue } from "@chakra-ui/react";
import { ChakraSVG } from "@/components/chakra-config/ChakraSVG";
import SplashArtSVG from "@/assets/dashboard/splash-art.svg";
import InfoTable from "./InfoTable";
import ProfileBanner from "./ProfileBanner";
import PastContests from "./PastContests";
import UpcomingEvents from "./UpcomingEvents";
import Footer from "@/components/common/footer/Footer";

export default function Dashboard() {
  const showArt = useBreakpointValue({ base: false, md: false, lg: true }) ?? false;

  return (
    <Flex
      minHeight="100vh"
      width="100%"
      gap={{ base: "2rem", lg: "4rem" }}
      flexDirection="column"
    >
      <Box 
        flex="1" 
        width="100%"
        py={{ base: "2rem", md: "3rem" }}
        px={{ base: "1rem", md: "4rem", lg: "6rem", xl: "10rem" }}
      >
        <Grid
          templateColumns={{ base: "1fr", lg: "repeat(2, 1fr)" }}
          gap={{ base: "2rem", lg: "4rem" }}
          alignItems="start"
          width="100%"
        >
          <VStack align="start" width="100%" spacing="2rem">
            <ProfileBanner />
            <InfoTable />
            <PastContests />
          </VStack>

          <VStack align="end" width="100%" spacing="2rem">
            {showArt && (
              <ChakraSVG
                svg={SplashArtSVG}
                width="100%"
                height={"42rem"}
                aria-label="Splash Art Right"
              />
            )}
            <UpcomingEvents />
          </VStack>
        </Grid>
      </Box>
      <Footer />
    </Flex>
  );
}
