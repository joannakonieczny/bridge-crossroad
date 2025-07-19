import { Box, Flex } from '@chakra-ui/react';

export interface IAppProps {
    text: string;
}

export default function MainHeading(props: IAppProps) {
  return (
    <Flex direction="column" align="flex-start" pb={5}>
      <Box fontSize="xl" fontWeight="bold" position="relative" display="inline-block">
        {props.text}
        <Box
          position="absolute"
          bottom={-1} 
          left={0}
          height="2px"
          width="100%"
          bg="accent.300"
          transform="scaleX(1.2)"
          transformOrigin="left"
        />
      </Box>
    </Flex>
  );
}
