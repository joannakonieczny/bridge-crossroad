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
  Tag,
  TagLeftIcon,
  TagLabel,
} from "@chakra-ui/react";
import type { GroupIdType } from "@/schemas/model/group/group-types";
import { useActionInfiniteQuery } from "@/lib/tanstack-action/actions-infinite-query";
import { getChatFilesForGroup } from "@/services/chat/api";
import { useMemo as useMemoHook, useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { AsyncImage } from "@/components/common/AsyncImage";
import {
  FiRefreshCw,
  FiFile,
  FiFileText,
  FiArchive,
  FiDownload,
} from "react-icons/fi";
import { AiFillFilePdf } from "react-icons/ai";
import { getPersonLabel, getDateLabel } from "@/util/formatters";
import { useTranslations } from "@/lib/typed-translations";
import { ImageViewer } from "./ImageViewer";
import { getFileExtension } from "@/util/helpers";

type GroupChatFilesProps = {
  groupId: GroupIdType;
};

export default function GroupChatFiles({ groupId }: GroupChatFilesProps) {
  const queryClient = useQueryClient();
  const t = useTranslations("pages.GroupsPage.GroupFiles");

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
        <Text fontWeight="semibold">{t("filter.label")}</Text>
        <RadioGroup
          value={fileType}
          onChange={(v) => setFileType(v as "image" | "other")}
          colorScheme="accent"
        >
          <HStack spacing={4}>
            <Radio value="image">{t("filter.options.images")}</Radio>
            <Radio value="other">{t("filter.options.otherFiles")}</Radio>
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
          {t("filter.refreshButton")}
        </Button>
      </Flex>

      {filesQuery.isLoading && (
        <Flex justify="center" py={8}>
          <Spinner />
        </Flex>
      )}

      {!filesQuery.isLoading && allFiles.length === 0 && (
        <Flex justify="center" py={8}>
          <Text>
            {fileType === "image"
              ? t("sections.images.noFiles")
              : t("sections.otherFiles.noFiles")}
          </Text>
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
          {allFiles.map((m) => {
            const fileExt = getFileExtension(m.fileUrl);
            const { colorScheme, Icon } = (() => {
              switch (fileExt) {
                case "pdf":
                  return {
                    colorScheme: "red",
                    Icon: AiFillFilePdf, // jednoznaczne PDF
                  };
                case "txt":
                  return {
                    colorScheme: "blue",
                    Icon: FiFileText,
                  };
                case "zip":
                  return {
                    colorScheme: "gray",
                    Icon: FiArchive,
                  };
                default:
                  return {
                    colorScheme: "purple",
                    Icon: FiFile,
                  };
              }
            })();

            return (
              <Flex
                key={m.id}
                align="center"
                justify="space-between"
                p={3}
                borderRadius="md"
                bg="gray.50"
              >
                <Flex align="center" gap={3}>
                  <Tag size="lg" borderRadius="md" colorScheme={colorScheme}>
                    <TagLeftIcon boxSize="14px" as={Icon} />
                    <TagLabel>{fileExt}</TagLabel>
                  </Tag>
                  <Box>
                    <Text fontWeight="medium">{getPersonLabel(m.sender)}</Text>
                    <Text fontSize="sm" color="border.500">
                      {getDateLabel(m.createdAt)}
                    </Text>
                  </Box>
                </Flex>

                <Button
                  as="a"
                  href={m.fileUrl}
                  size="sm"
                  leftIcon={<FiDownload />}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {t("sections.otherFiles.downloadButton")}
                </Button>
              </Flex>
            );
          })}
        </Stack>
      )}

      {filesQuery.hasNextPage && (
        <Flex justify="center" py={4}>
          <Button
            onClick={() => filesQuery.fetchNextPage()}
            isLoading={filesQuery.isFetchingNextPage}
          >
            {fileType === "image"
              ? t("sections.images.loadMore")
              : t("sections.otherFiles.loadMore")}
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
