"use client";

import { Flex } from '@chakra-ui/react';
import * as React from 'react';
import MainHeading from '@/components/util/texts/MainHeading';
import SearchInput from '@/components/util/SearchInput';

export interface IAppProps {
}

export default function PeopleList (props: IAppProps) {
  return (
    <Flex
        flex={1}
        backgroundColor={"white"}
        padding={"2rem"}
        direction={"column"}
    >
      <MainHeading text="Szukaj ludzi" />
        <SearchInput
            value=""
            onChange={() => {}}
            placeholder="Szukaj ludzi..."
        />
    </Flex>
  );
}
