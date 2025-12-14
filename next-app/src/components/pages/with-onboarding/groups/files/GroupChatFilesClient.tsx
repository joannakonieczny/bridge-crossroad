"use client";

import React from "react";
import {
  Stack,
  Flex,
  Button,
  Spinner,
  Text,
  SimpleGrid,
  Box,
  Link,
  RadioGroup,
  Radio,
  HStack,
} from "@chakra-ui/react";
import type { GroupIdType } from "@/schemas/model/group/group-types";
import { useActionInfiniteQuery } from "@/lib/tanstack-action/actions-infinite-query";
import { getChatFilesForGroup } from "@/services/chat/api";
import { useMemo as useMemoHook, useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { AsyncImage } from "@/components/common/AsyncImage";
import { FiRefreshCw } from "react-icons/fi";

type GroupChatFilesClientProps = {
  groupId: GroupIdType;
};

export default function GroupChatFilesClient({
  groupId,
}: GroupChatFilesClientProps) {
  const queryClient = useQueryClient();

  const [fileType, setFileType] = React.useState<"image" | "other">("image");

  const filesQuery = useActionInfiniteQuery({
    queryKey: ["chat-files", groupId, fileType],
    action: async (pageParam) => {
      return await getChatFilesForGroup({
        groupId,
        limit: 24,
        cursor: pageParam,
        fileType,
      });
    },
    initialPageParam: undefined as Date | undefined,
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
    staleTime: 5000,
  });

  useEffect(() => {
    // refresh on fileType change
    queryClient.invalidateQueries({
      queryKey: ["chat-files", groupId, fileType],
    });
  }, [fileType, groupId, queryClient]);

  const allFiles = useMemoHook(() => {
    if (!filesQuery.data) return [];
    return filesQuery.data.pages.flatMap((p) => p.messages);
  }, [filesQuery.data]);

  return (
    <Stack width="100%" p={4} spacing={4}>
      <Flex gap={3} align="center">
        <Text fontWeight="semibold">Filtr:</Text>
        <RadioGroup
          value={fileType}
          onChange={(v) => setFileType(v as "image" | "other")}
          colorScheme="accent"
        >
          <HStack spacing={4}>
            <Radio value="image">Zdjęcia</Radio>
            <Radio value="other">Inne pliki</Radio>
          </HStack>
        </RadioGroup>
        <Button
          size="sm"
          variant="ghost"
          leftIcon={<FiRefreshCw />}
          onClick={() =>
            queryClient.invalidateQueries({
              queryKey: ["chat-files", groupId, fileType],
            })
          }
        >
          Odśwież
        </Button>
      </Flex>

      {filesQuery.isLoading && (
        <Flex justify="center" py={8}>
          <Spinner />
        </Flex>
      )}

      {!filesQuery.isLoading && allFiles.length === 0 && (
        <Flex justify="center" py={8}>
          <Text>Brak plików.</Text>
        </Flex>
      )}

      {fileType === "image" ? (
        <SimpleGrid columns={[2, 3, 4]} spacing={3}>
          {allFiles.map((m) => (
            <Box key={m.id} borderRadius="md" overflow="hidden" bg="gray.50">
              <Link href={m.fileUrl} isExternal>
                <AsyncImage src={m.fileUrl} w="100%" h="160px" />
              </Link>
            </Box>
          ))}
        </SimpleGrid>
      ) : (
        <Stack spacing={3}>
          {allFiles.map((m) => (
            <Flex
              key={m.id}
              align="center"
              justify="space-between"
              p={3}
              borderRadius="md"
              bg="gray.50"
            >
              <Box>
                <Text fontWeight="medium">{m.fileUrl}</Text>
                <Text fontSize="sm" color="muted">
                  {new Date(m.createdAt).toLocaleString("pl-PL")}
                </Text>
              </Box>
              <Link href={m.fileUrl} isExternal>
                <Button size="sm">Otwórz</Button>
              </Link>
            </Flex>
          ))}
        </Stack>
      )}

      {filesQuery.hasNextPage && (
        <Flex justify="center" py={4}>
          <Button
            onClick={() => filesQuery.fetchNextPage()}
            isLoading={filesQuery.isFetchingNextPage}
          >
            Załaduj więcej
          </Button>
        </Flex>
      )}
    </Stack>
  );
}
