import { Box, Flex } from '@chakra-ui/react';
import Image from 'next/image';
import * as React from 'react';

export interface IAppProps {}

export default function App(props: IAppProps) {
  return (
    <Flex
      height="100vh"
      width="100vw"
      paddingY="2rem"
      paddingX="10rem"
      gap="4rem"
    >
      <Box flex="1">

      </Box>
      <Box flex="1" position="relative">
        <Image
          src="/dashboard/splash-art.svg"
          alt="Splash Art Left"
          fill
          style={{ objectFit: "contain", objectPosition: "left top" }}
          sizes="50vw 100vh"
          priority
        />
      </Box>
    </Flex>
  );
}
