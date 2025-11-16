"use client";

import { Stack, Flex, Button, Spinner, Text } from "@chakra-ui/react";
import type { GroupIdType } from "@/schemas/model/group/group-types";
import MessageBox from "./MessageBox";
import { useTranslations } from "@/lib/typed-translations";
import { useActionInfiniteQuery } from "@/lib/tanstack-action/actions-infinite-querry";
import { getMessagesForGroup } from "@/services/chat/api";
import { useMemo, useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";

type ChatBoxProps = {
  groupId: GroupIdType;
};

export function ChatBox({ groupId }: ChatBoxProps) {
  const t = useTranslations("pages.ChatPage");
  const queryClient = useQueryClient();

  const messagesQuery = useActionInfiniteQuery({
    queryKey: ["chat-messages", groupId],
    action: async (pageParam) => {
      return await getMessagesForGroup({
        groupId,
        limit: 20,
        cursor: pageParam,
      });
    },
    initialPageParam: undefined as Date | undefined,
    getNextPageParam: (lastPage) => {
      return lastPage.nextCursor ?? undefined;
    },
    staleTime: 1000,
  });

  // Auto-refetch newest messages (first page) every 8 seconds
  useEffect(() => {
    const id = setInterval(() => {
      queryClient.invalidateQueries({
        queryKey: ["chat-messages", groupId],
        refetchType: "active",
      });
    }, 8000);
    return () => clearInterval(id);
  }, [groupId, queryClient]);

  // Auto-refetch all pages every 60 seconds
  useEffect(() => {
    const id = setInterval(() => {
      queryClient.invalidateQueries({
        queryKey: ["chat-messages", groupId],
        refetchType: "all",
      });
    }, 60000);
    return () => clearInterval(id);
  }, [groupId, queryClient]);

  const allMessages = useMemo(() => {
    if (!messagesQuery.data) return [];
    return messagesQuery.data.pages.flatMap((page) => page.messages);
  }, [messagesQuery.data]);

  return (
    <Stack
      spacing={{ base: 3, md: 4 }}
      width="100%"
      overflowY="auto"
      flex="1"
      pt="0.5rem"
      px="0.5rem"
      sx={{ display: "flex", flexDirection: "column-reverse" }}
    >
      {allMessages.map((msg) => (
        <MessageBox key={msg.id} message={msg} />
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
            {t("loadMore")}
          </Button>
        </Flex>
      )}

      {!messagesQuery.isLoading && allMessages.length === 0 && (
        <Flex justify="center" align="center" py={4}>
          <Text color="border.500">{t("noMessages")}</Text>
        </Flex>
      )}

      {messagesQuery.isError && (
        <Flex justify="center" align="center" py={4}>
          <Text color="red.500">{t("error.loadFailed")}</Text>
        </Flex>
      )}

      {messagesQuery.isLoading && (
        <Flex justify="center" align="center" py={4}>
          <Spinner size="lg" color="accent.500" />
        </Flex>
      )}
    </Stack>
  );
}
