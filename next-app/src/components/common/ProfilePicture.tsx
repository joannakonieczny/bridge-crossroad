"use client";

import { Flex, Icon, type SystemStyleObject } from "@chakra-ui/react";
import Image from "next/image";
import { FaUserCircle } from "react-icons/fa";

export type IProfilePictureProps = {
  size: string | { base?: string; md?: string; lg?: string; xl?: string }; // size of the icon, responsive
  imageUrl?: string; // URL of the image to display, if any
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
        <Icon as={FaUserCircle} boxSize={props.size as any} color="border.300" />
      )}
    </Flex>
  );
}
