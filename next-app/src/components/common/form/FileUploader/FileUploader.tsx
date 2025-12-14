"use client";

import type { FormControlProps, StackProps } from "@chakra-ui/react";
import {
  FormControl,
  FormErrorMessage,
  Input,
  Box,
  Image,
  IconButton,
  Button,
  VStack,
  Text,
  Stack,
} from "@chakra-ui/react";
import type { ChangeEvent } from "react";
import { useRef, useState, useEffect } from "react";
import { MdDelete } from "react-icons/md";
import {
  ALLOWED_MIME_TYPE_IMAGE,
  ALLOWED_MIME,
  MAX_SIZE,
  ALLOWED_EXT_IMAGE,
  ALLOWED_EXT,
} from "@/util/constants";
import { useTranslations } from "@/lib/typed-translations";
import { isImageUrl } from "@/util/helpers";

export type IFileUploaderProps = {
  text?: {
    label?: string;
    placeholder?: string;
    errorUpload?: string;
    additionalLabel?: string;
  };
  errorMessage?: string;
  isInvalid?: boolean;
  isUploadError?: boolean;
  id?: string;
  isRequired?: boolean;
  onElementProps?: FormControlProps;
  value?: string; // URL or base64 of the file
  fileName?: string; // Name of the file
  onChange?: (file: File | null, preview: string | null) => void;
  onError?: (error: string) => void;
  genericFileType?: "image" | "any";
  acceptedFormats?: string; // optional, overrides genericFileType
  maxSizeMB?: number;
  onElementWrapperProps?: StackProps;
};

export default function FileUploader(props: IFileUploaderProps) {
  const t = useTranslations("components.FileUploader");

  const {
    genericFileType = "any",
    maxSizeMB = MAX_SIZE / (1024 * 1024), // Default 10MB
  } = props;

  const defaultTexts = {
    label: props.text?.label,
    additionalLabel: props.text?.additionalLabel,
    placeholder: props.text?.placeholder || t("placeholder"),
    errorUpload: props.text?.errorUpload || t("errorUpload"),
    formats: t("formats"),
    maxSize: t("maxSize"),
  };

  const acceptedFormats =
    props.acceptedFormats ??
    (genericFileType === "image"
      ? Array.from(ALLOWED_MIME_TYPE_IMAGE).join(",")
      : Array.from(ALLOWED_MIME).join(","));

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(props.value ?? null);
  const [fileName, setFileName] = useState<string | null>(
    props.fileName ?? null
  );
  const [isImage, setIsImage] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  // Synchronize internal state with external props
  useEffect(() => {
    setPreview(props.value ?? null);
    setFileName(props.fileName ?? null);
    if (props.value || props.fileName) {
      setIsImage(
        props.value?.startsWith("data:image") || isImageUrl(props.value)
      );
    }
  }, [props.value, props.fileName]);

  const processFile = (file: File) => {
    setValidationError(null);

    // Validate file type
    const allowedMimeTypes =
      genericFileType === "image" ? ALLOWED_MIME_TYPE_IMAGE : ALLOWED_MIME;

    if (!allowedMimeTypes.has(file.type)) {
      const errorMsg = `${t("errorInvalidType")}: ${file.type}`;
      setValidationError(errorMsg);
      props.onError?.(errorMsg);
      props.onChange?.(null, null);
      return;
    }

    // Validate file size
    const fileSizeMB = file.size / (1024 * 1024);
    if (fileSizeMB > maxSizeMB) {
      const errorMsg = `${t("errorFileTooBig")} (${fileSizeMB.toFixed(
        2
      )}MB): ${maxSizeMB}MB`;
      setValidationError(errorMsg);
      props.onError?.(errorMsg);
      props.onChange?.(null, null);
      return;
    }

    // Check if file is an image
    const fileIsImage = ALLOWED_MIME_TYPE_IMAGE.has(file.type);
    setIsImage(fileIsImage);
    setFileName(file.name);

    if (fileIsImage) {
      // Create preview for image
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setPreview(result);
        props.onChange?.(file, result);
      };
      reader.onerror = () => {
        const errorMsg = t("errorReadingFile");
        setValidationError(errorMsg);
        props.onError?.(errorMsg);
        props.onChange?.(null, null);
      };
      reader.readAsDataURL(file);
    } else {
      // No preview for non-image files
      setPreview(null);
      props.onChange?.(file, null);
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) {
      setPreview(null);
      props.onChange?.(null, null);
      return;
    }

    processFile(file);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const file = e.dataTransfer.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleRemove = () => {
    setPreview(null);
    setFileName(null);
    setIsImage(false);
    setValidationError(null);
    props.onChange?.(null, null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <Stack spacing={1} {...props.onElementWrapperProps}>
      {defaultTexts.label && (
        <Text color="gray.500" fontSize="sm">
          {defaultTexts.label}
        </Text>
      )}
      {defaultTexts.additionalLabel && (
        <Text color="gray.500" fontSize="xs">
          {defaultTexts.additionalLabel}
        </Text>
      )}
      <FormControl
        isInvalid={props.isInvalid || !!validationError || props.isUploadError}
        id={props.id}
        isRequired={props.isRequired}
        {...props.onElementProps}
      >
        {(props.errorMessage || validationError || props.isUploadError) && (
          <FormErrorMessage mb={2}>
            {props.errorMessage ||
              validationError ||
              (props.isUploadError && defaultTexts.errorUpload)}
          </FormErrorMessage>
        )}

        <VStack align="stretch" spacing={1}>
          <Input
            ref={fileInputRef}
            type="file"
            accept={acceptedFormats}
            onChange={handleFileChange}
            display="none"
          />

          {fileName ? (
            <Box position="relative" borderRadius="md" overflow="hidden">
              {isImage && preview ? (
                <>
                  <Image
                    src={preview}
                    alt="Preview"
                    maxH="200px"
                    objectFit="contain"
                    w="100%"
                  />
                  <IconButton
                    position="absolute"
                    top={0}
                    right={0}
                    size="sm"
                    colorScheme="red"
                    aria-label="Remove file"
                    icon={<MdDelete />}
                    onClick={handleRemove}
                  />
                </>
              ) : (
                <Box
                  p={4}
                  border="1px solid"
                  borderColor="gray.300"
                  borderRadius="md"
                  bg="gray.50"
                  display="flex"
                  alignItems="center"
                  justifyContent="space-between"
                >
                  <Text fontSize="md" fontWeight="medium">
                    {fileName}
                  </Text>

                  <IconButton
                    size="sm"
                    colorScheme="red"
                    aria-label="Remove file"
                    icon={<MdDelete />}
                    onClick={handleRemove}
                  />
                </Box>
              )}
            </Box>
          ) : (
            <Box
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <Button
                onClick={handleClick}
                variant="outline"
                borderColor={
                  validationError || props.isUploadError
                    ? "red.500"
                    : isDragging
                    ? "accent.500"
                    : "gray.300"
                }
                _hover={{
                  borderColor:
                    validationError || props.isUploadError
                      ? "red.600"
                      : "accent.500",
                }}
                _focus={{
                  borderColor:
                    validationError || props.isUploadError
                      ? "red.600"
                      : "accent.500",
                }}
                w="100%"
                h="100px"
                bg={
                  validationError || props.isUploadError
                    ? "red.50"
                    : isDragging
                    ? "accent.50"
                    : "transparent"
                }
                transition="all 0.2s"
              >
                <Text color="gray.500">{defaultTexts.placeholder}</Text>
              </Button>
            </Box>
          )}

          <Text fontSize="xs" color="gray.500" mt="2">
            {defaultTexts.formats}:{" "}
            {props.genericFileType === "image"
              ? [...ALLOWED_EXT_IMAGE].join(", ")
              : props.genericFileType === "any"
              ? [...ALLOWED_EXT].join(", ")
              : acceptedFormats.replaceAll(",", ", ")}
            .
          </Text>
          <Text fontSize="xs" color="gray.500">
            {defaultTexts.maxSize}: {maxSizeMB}MB
          </Text>
        </VStack>
      </FormControl>
    </Stack>
  );
}
