"use client";

import type { UserTypeBasic } from "@/schemas/model/user/user-types";
import { Box, Text, Flex } from "@chakra-ui/react";

type IMessageBoxProps = {
  timestamp: Date;
  content: string;
  sender: UserTypeBasic;
  isAdmin?: boolean;
};

export default function MessageBox(props: IMessageBoxProps) {
  return (
    <Flex
      direction="column"
      backgroundColor={props.isAdmin ? "blue.50" : "gray.50"}
    >
      <Text fontWeight="bold">
        {props.sender.nickname
          ? props.sender.nickname
          : `${props.sender.name.firstName} ${props.sender.name.lastName}`}
      </Text>
      <Text>{props.content}</Text>
      <Text fontSize="sm">{props.timestamp.toLocaleString()}</Text>
    </Flex>
  );
}
