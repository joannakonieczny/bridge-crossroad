import { Box, Flex, HStack, VStack, Text, Image } from '@chakra-ui/react';
import * as React from 'react';
import InfoTable from "./InfoTable";
import ProfileBanner from './ProfileBanner';
import PastContests from './PastContests';
import UpcomingEvents from './UpcomingEvents';

export interface IAppProps {}

export default function App(props: IAppProps) {
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
          <VStack align="center" width="100%" spacing="2rem">
            <ProfileBanner />
            <InfoTable />
            <PastContests />
            
          </VStack>

          <VStack align="center" width="100%" spacing="2rem">
          
            <Image
              src="/dashboard/splash-art.svg"
              alt="Splash Art Left"
              objectFit="contain"
              objectPosition="center"
              width="100%"
              height="auto"
              maxH="28rem"
            />
          <UpcomingEvents />
          </VStack>
        </Flex>
      </Box>
    </Flex>
  );
}
