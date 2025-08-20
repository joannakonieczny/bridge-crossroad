import HighlightedHeading from "@/components/common/texts/HighlightedHeading";
import { Box, Flex, Highlight, Text } from "@chakra-ui/react";
import Image from "next/image";

export default function LandingPage3() {
  return (
    <Box
      bg="yellow.100"
      width="100%"
      height="100vh"
      position="relative"
      overflowX="hidden"
    >
      <Flex
        width="100%"
        height="100vh"
        position="absolute"
        top="50%"
        left="0"
        transform="translateY(-50%)"
        justifyContent="center"
        alignItems="center"
      >
        <Image
          src="/assets/landing-page/landing-page-3.svg"
          alt="Logo"
          fill
          style={{
            position: "absolute",
            objectFit: "contain",
            objectPosition: "right top",
            margin: "-1px" //special case trick - the svg didn't align properly
          }}
        />
        <Flex 
          direction="column"
          textAlign="center"
          justifyContent="center"
          gap="1.5rem"
          marginTop="3rem"
          alignItems="center"
        >
          <HighlightedHeading text="Brydżowe skrzyżowanie" fontSize="3xl" justifyContent="center" textAlign="center"/>
          <Text fontSize="lg" maxWidth="25rem">
            <Highlight query="Bridge Crossroad" styles={{fontWeight: "bold"}}>
              Wierzymy, że Bridge Crossroad to miejsce, w którym złączą się nasze drogi poza stołem brydżowym :)
            </Highlight>
          </Text>
          <Image
            src="/assets/landing-page/landing-page-3-art.svg"
            alt="Logo"
            width={27 * 16}
            height={37.7 * 16}
            style={{
              width: "20rem",
              height: "auto",
              objectFit: "contain",
              objectPosition: "right top",
            }}
          />
        </Flex>
      </Flex>
    </Box>
  );
}