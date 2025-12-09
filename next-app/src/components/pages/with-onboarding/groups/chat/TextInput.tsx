"use client";

import {
  Stack,
  IconButton,
  ButtonGroup,
  Textarea,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  Button,
  useDisclosure,
  useToast,
  Image,
  Text,
} from "@chakra-ui/react";
import { GrFormAttachment } from "react-icons/gr";
import { MdDelete } from "react-icons/md";
import { BsFillCursorFill } from "react-icons/bs";
import {
  useTranslations,
  useTranslationsWithFallback,
} from "@/lib/typed-translations";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useActionMutation } from "@/lib/tanstack-action/actions-mutation";
import { postNewMessage } from "@/services/chat/api";
import { addModifyChatMessageSchema } from "@/schemas/pages/with-onboarding/chat/chat-schema";
import type { GroupIdType } from "@/schemas/model/group/group-types";
import { useQueryClient } from "@tanstack/react-query";
import { useRef } from "react";
import { withEmptyToUndefined } from "@/schemas/common";
import FileUploader from "@/components/common/form/FileUploader/FileUploader";
import { useImageUpload } from "@/components/common/form/FileUploader/useImageUpload";
import { getMessageKeyFromError } from "@/lib/tanstack-action/helpers";
import type { MutationOrQuerryError } from "@/lib/tanstack-action/types";

type TextInputProps = {
  groupId: GroupIdType;
};

export function TextInput({ groupId }: TextInputProps) {
  const t = useTranslations("pages.ChatPage");
  const tValidation = useTranslationsWithFallback();
  const queryClient = useQueryClient();
  const ref = useRef<HTMLTextAreaElement>(null);
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const {
    selectedImage,
    preview,
    fileName,
    uploadImage,
    resetImage,
    handleImageChange,
    isUploading,
    isError: isUploadError,
  } = useImageUpload({
    text: {
      toast: {
        loading: { title: t("fileUploadToast.loading") },
        success: { title: t("fileUploadToast.success") },
        error: { title: t("fileUploadToast.error") },
      },
    },
  });

  const autoResize = () => {
    const el = ref.current;
    if (!el) return;

    el.style.height = "auto";
    el.style.height = el.scrollHeight + "px";
  };

  const { handleSubmit, control, reset, setValue } = useForm({
    resolver: zodResolver(withEmptyToUndefined(addModifyChatMessageSchema)),
    defaultValues: {
      message: "",
      fileUrl: "",
    },
  });

  const sendMessageMutation = useActionMutation({
    action: (data: { message: string; fileUrl?: string }) =>
      postNewMessage({ groupId, message: data.message, fileUrl: data.fileUrl }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["chat-messages", groupId] });
      reset();
      resetImage();
      requestAnimationFrame(() => {
        if (ref.current) {
          ref.current.style.height = "auto"; // back to one line height
        }
      });
    },
  });

  const onSubmit = async (data: { message: string; fileUrl?: string }) => {
    if (!data.message.trim() && !selectedImage) return;

    const uploadedPath = await uploadImage();

    // check upload error
    if (selectedImage && !uploadedPath) return;
    setValue("fileUrl", uploadedPath);
    data.fileUrl = uploadedPath;

    const promise = sendMessageMutation.mutateAsync(data);
    toast.promise(promise, {
      loading: { title: t("sendMessageToast.loading") },
      success: { title: t("sendMessageToast.success") },
      error: (err: MutationOrQuerryError<typeof sendMessageMutation>) => {
        const errKey = getMessageKeyFromError(err, {
          generalErrorKey: "pages.ChatPage.sendMessageToast.errorDefault",
        });
        return { title: tValidation(errKey) };
      },
    });
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack width="100%" spacing="0">
          {fileName && (
            <Stack
              direction="row"
              align="center"
              justify="space-between"
              px="0.5rem"
              py="0.25rem"
              bg="gray.50"
              borderBottom="1px solid"
              borderColor="gray.200"
            >
              <Stack direction="row" align="center" spacing={2}>
                {preview && (
                  <Image
                    src={preview}
                    alt="Preview"
                    width="40px"
                    height="40px"
                    objectFit="cover"
                    borderRadius="4px"
                  />
                )}
                <Text
                  fontSize="sm"
                  color={isUploadError ? "red.500" : "gray.600"}
                  ml={preview ? 0 : 2}
                >
                  {fileName}
                </Text>
              </Stack>
              <IconButton
                aria-label="Remove file"
                icon={<MdDelete />}
                size="sm"
                variant="ghost"
                colorScheme="red"
                onClick={resetImage}
              />
            </Stack>
          )}
          <Stack direction="row" spacing="0" padding="0.5rem">
            <Controller
              control={control}
              name="message"
              render={({ field }) => (
                <Textarea
                  {...field}
                  ringColor="border.200"
                  placeholder={t("sendMessagePlaceholder")}
                  borderRightRadius={0}
                  style={{ overflow: "hidden" }}
                  resize="vertical"
                  ref={ref}
                  onInput={autoResize}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleSubmit(onSubmit)();
                    }
                  }}
                  rows={1}
                  borderColor={isUploadError ? "red.500" : undefined}
                  _focus={{
                    borderColor: isUploadError ? "red.600" : undefined,
                  }}
                />
              )}
            />
            <ButtonGroup isAttached variant="outline">
              <IconButton
                aria-label="Attach File"
                backgroundColor="border.200"
                icon={<GrFormAttachment />}
                type="button"
                onClick={onOpen}
              />
              <IconButton
                aria-label="Send Message"
                backgroundColor="accent.500"
                color="bg"
                icon={<BsFillCursorFill />}
                type="submit"
                isLoading={sendMessageMutation.isPending || isUploading}
              />
            </ButtonGroup>
          </Stack>
        </Stack>
      </form>

      <Modal isOpen={isOpen} onClose={onClose} size="lg">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{t("attachFileModal.header")}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FileUploader
              genericFileType="any"
              onChange={handleImageChange}
              isUploadError={isUploadError}
              value={preview ?? undefined}
              fileName={fileName ?? undefined}
              text={{
                errorUpload: t("attachFileModal.fileErrorUpload"),
              }}
            />
          </ModalBody>
          <ModalFooter>
            <Button onClick={onClose} colorScheme="accent">
              {t("attachFileModal.closeButton")}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
