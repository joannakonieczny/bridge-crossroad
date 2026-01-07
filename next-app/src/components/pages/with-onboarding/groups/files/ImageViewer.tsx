"use client";

import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Text,
} from "@chakra-ui/react";
import { AsyncImage } from "@/components/common/AsyncImage";
import { getPersonLabel, getDateLabel } from "@/util/formatters";
import type { MessageWithPopulatedSenderTypeWithoutMessage } from "@/schemas/model/chat-message/chat-message-types";

type ImageViewerProps = {
  isOpen: boolean;
  onClose: () => void;
  selectedMessage: MessageWithPopulatedSenderTypeWithoutMessage;
};

export function ImageViewer({
  isOpen,
  onClose,
  selectedMessage,
}: ImageViewerProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl" isCentered>
      <ModalOverlay />
      <ModalContent maxW="90vw">
        <ModalCloseButton />
        <ModalBody
          display="flex"
          justifyContent="center"
          alignItems="center"
          p={0}
        >
          <AsyncImage
            src={selectedMessage?.fileUrl}
            w="100%"
            h="80vh"
            objectFit="contain"
          />
        </ModalBody>
        <ModalFooter>
          <Text color="border.500">
            {getPersonLabel(selectedMessage?.sender) +
              " - " +
              getDateLabel(selectedMessage?.createdAt)}
          </Text>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
