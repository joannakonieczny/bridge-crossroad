"use client";

import { Flex, Icon, type ResponsiveValue } from "@chakra-ui/react";
import Image from "next/image";
import { FaUserCircle } from "react-icons/fa";

export type IProfilePictureProps = {
  size: string | ResponsiveValue<string>;
  imageUrl?: string; 
};

export default function ProfilePicture(props: IProfilePictureProps) {
  return (
    <Flex
      alignItems="center"
      justifyContent="center"
      width={props.size}
      height={props.size}
      position="relative"
    >
      {props.imageUrl ? (
        <Image
          src={props.imageUrl}
          alt="User profile piture"
          fill
          style={{ borderRadius: "50%" }}
        />
      ) : (
        <Icon as={FaUserCircle} boxSize={props.size} color="border.300" />
      )}
    </Flex>
  );
}
