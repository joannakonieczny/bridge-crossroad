"use client";

import type { MessageWithPopulatedSenderType } from "@/schemas/model/chat-message/chat-message-types";
import { getDateLabel, getPersonLabel } from "@/util/formatters";
import { Box, Text, Flex, HStack, Button } from "@chakra-ui/react";
import { FiDownload, FiEdit2 } from "react-icons/fi";
import { useState } from "react";
import { getFileExtension, isImageUrl } from "@/util/helpers";
import { AsyncImage } from "@/components/common/AsyncImage";
import { useTranslations } from "@/lib/typed-translations";

type IMessageBoxProps = {
  message: MessageWithPopulatedSenderType;
  onEdit?: (message: MessageWithPopulatedSenderType) => void;
  isBeingEdited?: boolean;
};

export default function MessageBox({
  message,
  onEdit,
  isBeingEdited,
}: IMessageBoxProps) {
  const t = useTranslations("pages.ChatPage");
  const isSelf = !!message.sender?.isCurrentUser;
  const isAdmin = !!message.sender?.isGroupAdmin;
  const sender = message.sender;
  const content = message.message;
  const fileUrl = message.fileUrl;
  const [isSelected, setIsSelected] = useState(false);
  const isImage = isImageUrl(fileUrl);
  const fileExt = getFileExtension(fileUrl);

  const messageBoxColor = isBeingEdited
    ? "accent.300"
    : isSelf
    ? "accent.500"
    : isAdmin
    ? "secondary.200"
    : "border.100";

  const messageBoxHoverColor = isBeingEdited
    ? "accent.400"
    : isSelf
    ? "accent.600"
    : isAdmin
    ? "secondary.300"
    : "border.200";

  const messageFontColor = isSelf ? "bg" : "fonts.default";

  return (
    <Flex direction="column" alignItems={isSelf ? "flex-end" : "flex-start"}>
      <Text
        fontSize="xs"
        color="border.500"
        marginBottom="0.25rem"
        textAlign={isSelf ? "right" : "left"}
      >
        {!isSelf && getPersonLabel(sender)}
      </Text>
      <Flex
        alignItems="flex-end"
        gap={2}
        flexDirection={isSelf ? "row-reverse" : "row"}
        width="fit-content"
        maxW="60%"
        minW={{ base: "6ch", md: "10ch" }}
      >
        <Flex flexDirection="column" gap="0">
          <Box
            backgroundColor={messageBoxColor}
            _hover={{ bg: messageBoxHoverColor }}
            borderRadius="0.5rem"
            p="1"
            minW={{ base: "6ch", md: "10ch" }}
            onClick={() => setIsSelected((s) => !s)}
            cursor="pointer"
            role="button"
            display="flex"
            flexDirection="column"
          >
            {/* main content (text + image) */}
            <Box>
              {content && (
                <Text
                  wordBreak="normal"
                  whiteSpace="normal"
                  color={messageFontColor}
                  padding="0.5rem 1rem"
                >
                  {content}
                </Text>
              )}

              {isImage && fileUrl && (
                <AsyncImage
                  src={fileUrl}
                  alt="Attached image"
                  maxW="300px"
                  maxH="300px"
                  objectFit="contain"
                  borderRadius="0.25rem"
                />
              )}
            </Box>

            {/* footer row: download link aligned to right */}
            {fileUrl && !isImage && (
              <Flex justify="flex-end">
                <Box
                  as="a"
                  href={fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Download file: ${fileExt}`}
                  display="inline-flex"
                  alignItems="center"
                  gap={2}
                  px={3}
                  py={2}
                  bg="gray.50"
                  border="1px solid"
                  borderColor="border.200"
                  borderRadius="md"
                  textDecoration="none"
                >
                  <FiDownload aria-hidden size={16} />
                  <Text
                    fontSize="xs"
                    fontWeight="semibold"
                    color="fonts.default"
                  >
                    {fileExt}
                  </Text>
                </Box>
              </Flex>
            )}
          </Box>
          {isSelected && (
            <HStack>
              {isSelf && onEdit && (
                <Button
                  leftIcon={<FiEdit2 />}
                  size="xs"
                  variant="ghost"
                  colorScheme="accent"
                  onClick={() => onEdit(message)}
                >
                  {t("editButton")}
                </Button>
              )}

              <Text
                fontSize="xs"
                color="border.500"
                marginTop="0.25rem"
                textAlign={isSelf ? "right" : "left"}
              >
                {getDateLabel(message.createdAt)}
              </Text>
            </HStack>
          )}
        </Flex>
      </Flex>
    </Flex>
  );
}
