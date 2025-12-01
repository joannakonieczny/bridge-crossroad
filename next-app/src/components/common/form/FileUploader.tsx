import type { FormControlProps } from "@chakra-ui/react";
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
} from "@chakra-ui/react";
import type { ChangeEvent } from "react";
import { useRef, useState } from "react";
import { MdDelete } from "react-icons/md";
import {
  ALLOWED_MIME_TYPE_IMAGE,
  ALLOWED_MIME,
  MAX_SIZE,
  ALLOWED_EXT_IMAGE,
  ALLOWED_EXT,
} from "@/util/constants";

export type IFileUploaderProps = {
  placeholder?: string;
  errorMessage?: string;
  isInvalid?: boolean;
  isUploadError?: boolean;
  id?: string;
  isRequired?: boolean;
  onElementProps?: FormControlProps;
  value?: string; // URL lub base64 pliku
  onChange?: (file: File | null, preview: string | null) => void;
  onError?: (error: string) => void;
  genericFileType?: "image" | "any";
  acceptedFormats?: string; // opcjonalne, nadpisuje genericFileType
  maxSizeMB?: number;
};

export default function FileUploader(props: IFileUploaderProps) {
  const {
    placeholder = "Wybierz plik",
    genericFileType = "any",
    maxSizeMB = MAX_SIZE / (1024 * 1024), // Domyślnie 10MB
  } = props;

  const acceptedFormats =
    props.acceptedFormats ??
    (genericFileType === "image"
      ? Array.from(ALLOWED_MIME_TYPE_IMAGE).join(",")
      : Array.from(ALLOWED_MIME).join(","));

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(props.value ?? null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [isImage, setIsImage] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  const processFile = (file: File) => {
    setValidationError(null);

    // Walidacja typu pliku
    const allowedMimeTypes =
      genericFileType === "image" ? ALLOWED_MIME_TYPE_IMAGE : ALLOWED_MIME;

    if (!allowedMimeTypes.has(file.type)) {
      const errorMsg = `Niedozwolony typ pliku: ${file.type}`;
      setValidationError(errorMsg);
      props.onError?.(errorMsg);
      props.onChange?.(null, null);
      return;
    }

    // Walidacja rozmiaru
    const fileSizeMB = file.size / (1024 * 1024);
    if (fileSizeMB > maxSizeMB) {
      const errorMsg = `Plik jest za duży (${fileSizeMB.toFixed(
        2
      )}MB). Maksymalny rozmiar: ${maxSizeMB}MB`;
      setValidationError(errorMsg);
      props.onError?.(errorMsg);
      props.onChange?.(null, null);
      return;
    }

    // Sprawdzenie czy plik jest obrazem
    const fileIsImage = ALLOWED_MIME_TYPE_IMAGE.has(file.type);
    setIsImage(fileIsImage);
    setFileName(file.name);

    if (fileIsImage) {
      // Tworzenie podglądu dla obrazu
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setPreview(result);
        props.onChange?.(file, result);
      };
      reader.readAsDataURL(file);
    } else {
      // Dla innych plików nie tworzymy podglądu
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
            (props.isUploadError &&
              "Błąd przesyłania pliku. Spróbuj ponownie lub usuń zdjęcie. Zdjęcie grupy zawsze możesz zmienić na stronie grupy.")}
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
                  aria-label="Usuń plik"
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
                  aria-label="Usuń plik"
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
              <Text color="gray.500">{placeholder}</Text>
            </Button>
          </Box>
        )}

        <Text fontSize="xs" color="gray.500">
          Akceptowane formaty:{" "}
          {props.genericFileType === "image"
            ? [...ALLOWED_EXT_IMAGE].join(", ")
            : props.genericFileType === "any"
            ? [...ALLOWED_EXT].join(", ")
            : acceptedFormats.replaceAll(",", ", ")}
          .
        </Text>
        <Text fontSize="xs" color="gray.500">
          Maksymalny rozmiar: {maxSizeMB}MB
        </Text>
      </VStack>
    </FormControl>
  );
}
