"use client";

import { Box, Flex, Grid, VStack, useBreakpointValue, useColorMode } from "@chakra-ui/react";
import { ChakraSVG } from "@/components/chakra-config/ChakraSVG";
import SplashArtSVG from "@/assets/dashboard/splash-art.svg";
import InfoTable from "./InfoTable";
import ProfileBanner from "./ProfileBanner";
import PastContests from "./PastContests";
import UpcomingEvents from "./UpcomingEvents";
import Footer from "@/components/common/footer/Footer";

export default function Dashboard() {
  const showArt =
    useBreakpointValue({ base: false, md: false, lg: true }) ?? false;
  const { colorMode } = useColorMode();

  return (
    <Flex
      minHeight="100vh"
      width="100%"
      gap={{ base: "2rem", lg: "4rem" }}
      flexDirection="column"
      bgColor="bg"
    >
      <Box
        flex="1"
        width="100%"
        py={{ base: "2rem", md: "3rem" }}
        px={{ base: "1rem", md: "2rem", lg: "2rem", xl: "6rem" }}
      >
        <VStack spacing={{ base: "2rem", lg: "4rem" }} width="100%">
          {/* Górna sekcja: ProfileBanner + InfoTable | SVG */}
          <Grid
            templateColumns={{ base: "1fr", lg: "2fr 1fr" }}
            gap={{ base: "2rem", lg: "4rem" }}
            alignItems="stretch"
            width="100%"
          >
            <VStack align="start" width="100%" spacing="2rem">
              <ProfileBanner />
              <InfoTable />
            </VStack>

            {showArt && (
              <Box
                width="100%"
                height="100%"
                maxHeight="412px"
                display="flex"
                alignItems="flex-end"
                overflow={"hidden"}
              >
                <ChakraSVG
                  svg={SplashArtSVG}
                  width="100%"
                  overflow={"hidden"}
                  aria-label="Splash Art Right"
                  display="flex"
                  alignItems="flex-end"
                  filter={colorMode === "dark" ? "invert(1)" : "none"}
                />
              </Box>
            )}
          </Grid>

          {/* Dolna sekcja: PastContests | UpcomingEvents */}
          <Grid
            templateColumns={{ base: "1fr", lg: "2fr 1fr" }}
            gap={{ base: "2rem", lg: "4rem" }}
            alignItems="start"
            width="100%"
          >
            <UpcomingEvents />
            <PastContests />
          </Grid>
        </VStack>
      </Box>
      <Footer />
    </Flex>
  );
}
