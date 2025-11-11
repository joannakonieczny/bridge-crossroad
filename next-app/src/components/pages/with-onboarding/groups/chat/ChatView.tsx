"use client";

import {
  Box,
  Flex,
  useBreakpointValue,
  Stack,
  Divider,
} from "@chakra-ui/react";
import type { GroupIdType } from "@/schemas/model/group/group-types";
import MessageBox from "./MessageBox";
import { TextInput } from "./TextInput";
import { HeaderTile } from "@/components/common/HeaderTile";
import { BsChatLeftDots } from "react-icons/bs";
import { mockMessages } from "./mock";

type IChatViewProps = {
  groupId: GroupIdType;
};

export default function ChatView(props: IChatViewProps) {
  const gap = useBreakpointValue({ base: "1.25rem", md: "3rem" });
  const py = useBreakpointValue({ base: "1rem", md: "2rem" });
  const px = useBreakpointValue({ base: "1rem", md: "3rem" });
  const minH = useBreakpointValue({
    base: "calc(100vh - 7rem)",
    md: "calc(100vh - 5rem)",
  });

  return (
    <Flex
      backgroundColor="border.50"
      width="100%"
      h={minH}
      paddingY={py}
      paddingX={px}
      gap={gap}
      overflow="hidden"
      direction="column"
      alignContent="center"
    >
      <Box
        flex="1"
        gap={gap}
        w="full"
        maxW={{ base: "full", md: "70rem" }}
        alignSelf="center"
        display="flex"
        flexDirection="column"
        height="100%"
      >
        <Box flexShrink={0}>
          <HeaderTile
            title={`Grupa ${props.groupId}`}
            subtitle="chat"
            icon={BsChatLeftDots}
            mainColor="accent.300"
            accentColor="accent.100"
          />
        </Box>
        <Box
          flex="1"
          display="flex"
          flexDirection="column"
          overflow="hidden"
          bg="bg"
        >
          <Stack
            spacing={{ base: 3, md: 4 }}
            width="100%"
            overflowY="auto"
            flex="1"
            pt="0.5rem"
          >
            {mockMessages.map((msg, index) => (
              <MessageBox
                key={index}
                timestamp={msg.timestamp}
                content={msg.content}
                sender={msg.from}
                isAdmin={msg.isAdmin}
                isSelf={msg.isSelf}
              />
            ))}
          </Stack>
          <Divider flexShrink={0} />
          <Box width="100%" pt="0.5rem" flexShrink={0}>
            <TextInput />
          </Box>
        </Box>
      </Box>
    </Flex>
  );
}
