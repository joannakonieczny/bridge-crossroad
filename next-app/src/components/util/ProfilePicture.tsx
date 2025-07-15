'use client';

import { Flex, Icon } from '@chakra-ui/react';
import Image from 'next/image';
import * as React from 'react';
import { FaUserCircle } from "react-icons/fa";

export interface IAppProps {
  size: number; // size of the icon
  imageUrl?: string; // URL of the image to display, if any
}

export default function App (props: IAppProps) {
  return (
    <Flex  alignItems="center" justifyContent="center" width={`${props.size}rem`} height={`${props.size}rem`} position="relative">
        {props.imageUrl ? 
          <Image
            src={props.imageUrl}
            alt=""
            fill
            style={{ borderRadius: '50%'}} />
          :
          <Icon as={FaUserCircle} boxSize={`${props.size}rem`} color="gray.300" />}
    </Flex>
  );
}
