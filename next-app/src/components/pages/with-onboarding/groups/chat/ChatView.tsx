"use client";

import {
  Box,
  Flex,
  useBreakpointValue,
  Stack,
  Divider,
  Button,
  Spinner,
  Text,
} from "@chakra-ui/react";
import type { GroupIdType } from "@/schemas/model/group/group-types";
import MessageBox from "./MessageBox";
import { TextInput } from "./TextInput";
import { HeaderTile } from "@/components/common/HeaderTile";
import { useTranslations } from "@/lib/typed-translations";
import { useGroupQuery } from "@/lib/queries";
import { BsChatLeftDots } from "react-icons/bs";
import { useActionInfiniteQuery } from "@/lib/tanstack-action/actions-infinite-querry";
import { getMessagesForGroup } from "@/services/chat/api";
import { useMemo, useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";

type IChatViewProps = {
  groupId: GroupIdType;
};

export default function ChatView(props: IChatViewProps) {
  const tSidebar = useTranslations("pages.GroupsPage.Sidebar");
  const t = useTranslations("pages.ChatPage");
  const queryClient = useQueryClient();
  const gap = useBreakpointValue({ base: "1.25rem", md: "3rem" });
  const py = useBreakpointValue({ base: "1rem", md: "2rem" });
  const px = useBreakpointValue({ base: "1rem", md: "3rem" });
  const minH = useBreakpointValue({
    base: "calc(100vh - 7rem)",
    md: "calc(100vh - 5rem)",
  });
  const groupQ = useGroupQuery(props.groupId);
  const group = groupQ.data;

  const groupName = t("groupName", {
    groupName: group?.name ?? "",
  });

  const messagesQuery = useActionInfiniteQuery({
    queryKey: ["chat-messages", props.groupId],
    action: async (pageParam) => {
      return await getMessagesForGroup({
        groupId: props.groupId,
        limit: 20,
        cursor: pageParam as Date | undefined,
      });
    },
    initialPageParam: undefined as Date | undefined,
    getNextPageParam: (lastPage) => {
      // nextCursor is null when there's no more data
      return lastPage.nextCursor ?? undefined;
    },
    staleTime: 1000,
  });

  // Auto-refetch newest messages (first page) every 5 seconds
  useEffect(() => {
    const id = setInterval(() => {
      queryClient.invalidateQueries({
        queryKey: ["chat-messages", props.groupId],
        refetchType: "active",
      });
    }, 5000);
    return () => clearInterval(id);
  }, [props.groupId, queryClient]);

  // Auto-refetch all pages every 30 seconds
  useEffect(() => {
    const id = setInterval(() => {
      queryClient.invalidateQueries({
        queryKey: ["chat-messages", props.groupId],
        refetchType: "all",
      });
    }, 30000);
    return () => clearInterval(id);
  }, [props.groupId, queryClient]);

  const allMessages = useMemo(() => {
    if (!messagesQuery.data) return [];
    return messagesQuery.data.pages.flatMap((page) => page.messages);
  }, [messagesQuery.data]);

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
            title={groupName}
            subtitle={tSidebar("nav.chat")}
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
            px="0.5rem"
            sx={{
              display: "flex",
              flexDirection: "column-reverse",
            }}
          >
            {allMessages.map((msg) => (
              <MessageBox
                key={msg.id}
                timestamp={msg.createdAt}
                content={msg.message}
                sender={msg.sender}
                isAdmin={false} // TODO: determine if sender is admin
                isSelf={false} // TODO: determine if sender is current user
              />
            ))}
            {messagesQuery.hasNextPage && (
              <Flex justify="center" py={2}>
                <Button
                  onClick={() => messagesQuery.fetchNextPage()}
                  isLoading={messagesQuery.isFetchingNextPage}
                  size="sm"
                  variant="ghost"
                  colorScheme="accent"
                >
                  {t("loadMore", { defaultValue: "Załaduj więcej" })}
                </Button>
              </Flex>
            )}
            {!messagesQuery.isLoading && allMessages.length === 0 && (
              <Flex justify="center" align="center" py={4}>
                <Text color="border.500">
                  {t("noMessages", { defaultValue: "Brak wiadomości" })}
                </Text>
              </Flex>
            )}
            {messagesQuery.isError && (
              <Flex justify="center" align="center" py={4}>
                <Text color="red.500">
                  {t("error.loadFailed", {
                    defaultValue: "Nie udało się załadować wiadomości",
                  })}
                </Text>
              </Flex>
            )}
            {messagesQuery.isLoading && (
              <Flex justify="center" align="center" py={4}>
                <Spinner size="lg" color="accent.500" />
              </Flex>
            )}
          </Stack>
          <Divider flexShrink={0} />
          <Box width="100%" pt="0.5rem" flexShrink={0}>
            <TextInput groupId={props.groupId} />
          </Box>
        </Box>
      </Box>
    </Flex>
  );
}
