import ResponsiveHeading from "@/components/common/texts/ResponsiveHeading";
import ResponsiveText from "@/components/common/texts/ResponsiveText";
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
          <Flex direction="column" alignItems="center">
            <ResponsiveHeading text="Brydżowe skrzyżowanie" fontSize="3xl" justifyContent="center" textAlign="center" marginBottom="1.5rem"/>
            <ResponsiveText fontSize="lg" maxWidth="20rem" width="100%" textAlign="center">
              <Highlight query="Bridge Crossroad" styles={{fontWeight: "bold"}}>
                Wierzymy, że Bridge Crossroad to miejsce, w którym złączą się nasze drogi poza stołem brydżowym :)
              </Highlight>
            </ResponsiveText>
          </Flex>
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