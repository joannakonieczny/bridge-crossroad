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
  useDisclosure,
} from "@chakra-ui/react";
import type { GroupIdType } from "@/schemas/model/group/group-types";
import { useActionInfiniteQuery } from "@/lib/tanstack-action/actions-infinite-query";
import { getChatFilesForGroup } from "@/services/chat/api";
import { useMemo as useMemoHook, useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { AsyncImage } from "@/components/common/AsyncImage";
import { FiRefreshCw } from "react-icons/fi";
import { getPersonLabel, getDateLabel } from "@/util/formatters";
import { ImageViewer } from "./ImageViewer";

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

  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedId, setSelectedId] = React.useState<string | null>(null);

  const openImage = (id: string) => {
    setSelectedId(id);
    onOpen();
  };

  const selectedMessage = selectedId
    ? allFiles.find((m) => m.id === selectedId)
    : null;

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
              <Link
                href={m.fileUrl}
                isExternal
                onClick={(e) => {
                  e.preventDefault();
                  openImage(m.id);
                }}
              >
                <AsyncImage src={m.fileUrl} w="100%" h="160px" />
              </Link>
              <Flex px={2} py={2} align="center" justify="space-between">
                <Text fontSize="xs" color="border.500">
                  {getPersonLabel(m.sender)}
                </Text>
                <Text fontSize="xs" color="border.500">
                  {getDateLabel(m.createdAt)}
                </Text>
              </Flex>
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
                  {getDateLabel(m.createdAt)}
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
      {selectedMessage && (
        <ImageViewer
          isOpen={isOpen}
          onClose={() => {
            setSelectedId(null);
            onClose();
          }}
          selectedMessage={selectedMessage}
        />
      )}
    </Stack>
  );
}
