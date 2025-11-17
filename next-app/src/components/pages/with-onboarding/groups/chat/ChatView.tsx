"use client";

import { Box, Flex, Divider } from "@chakra-ui/react";
import { TextInput } from "./TextInput";
import { HeaderTile } from "@/components/common/HeaderTile";
import { useTranslations } from "@/lib/typed-translations";
import { useGroupQuery } from "@/lib/queries";
import { BsChatLeftDots } from "react-icons/bs";
import { ChatBox } from "./ChatBox";
import type { GroupIdType } from "@/schemas/model/group/group-types";

type IChatViewProps = {
  groupId: GroupIdType;
};

export default function ChatView(props: IChatViewProps) {
  const t = useTranslations("pages.ChatPage");

  const groupQ = useGroupQuery(props.groupId);
  const group = groupQ.data;

  return (
    <Flex
      backgroundColor="border.50"
      width="100%"
      h={{ base: "calc(100vh - 7rem)", md: "calc(100vh - 5rem)" }}
      paddingY={{ base: "1rem", md: "2rem" }}
      paddingX={{ base: "1rem", md: "3rem" }}
      gap={{ base: "1.25rem", md: "3rem" }}
      overflow="hidden"
      direction="column"
      alignContent="center"
    >
      <Box
        flex="1"
        gap={{ base: "1.25rem", md: "3rem" }}
        w="full"
        maxW={{ base: "full", md: "70rem" }}
        alignSelf="center"
        display="flex"
        flexDirection="column"
        height="100%"
      >
        <Box flexShrink={0}>
          <HeaderTile
            title={group?.name ?? ""}
            subtitle={t("header.title")}
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
          <ChatBox groupId={props.groupId} />
          <Divider flexShrink={0} />
          <Box width="100%" pt="0.5rem" flexShrink={0}>
            <TextInput groupId={props.groupId} />
          </Box>
        </Box>
      </Box>
    </Flex>
  );
}
