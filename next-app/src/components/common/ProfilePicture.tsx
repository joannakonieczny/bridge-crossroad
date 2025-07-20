'use client';

import { Flex, Icon } from '@chakra-ui/react';
import Image from 'next/image';
import { FaUserCircle } from "react-icons/fa";

export interface IAppProps {
  size: string; // size of the icon
  imageUrl?: string; // URL of the image to display, if any
}

export default function ProfilePicture(props: IAppProps) {
  return (
    <Flex  
      alignItems="center" 
      justifyContent="center" 
      width={props.size} 
      height={props.size} 
      position="relative"
    >
        {props.imageUrl ? 
          <Image
            src={props.imageUrl}
            alt="User profile piture"
            fill
            style={{ borderRadius: '50%'}} />
          :
          <Icon as={FaUserCircle} boxSize={props.size} color="border.300" />}
    </Flex>
  );
}
