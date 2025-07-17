import { HStack, VStack, Text } from "@chakra-ui/react";
import ProfilePicture from "@/components/util/ProfilePicture";

export default function ProfileBanner() {
  //mock
  const name = "jasiu";
  const description = "Zawodnik Just Bridge AGH";

  return (
    <HStack width="100%">
      <ProfilePicture size="7.25rem" />
      <VStack align="start">
        <Text
          fontSize={{ base: "2xl", md: "3xl" }}
          lineHeight="1.1"
          fontWeight="bold"
        >
          {name}
        </Text>
        <Text
          fontSize={{ base: "md", md: "lg" }}
          lineHeight="1.2"
          fontWeight="bold"
          color="accent.500"
        >
          {description}
        </Text>
      </VStack>
    </HStack>
  );
}
