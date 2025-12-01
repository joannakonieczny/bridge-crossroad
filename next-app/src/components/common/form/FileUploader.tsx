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
} from "@/util/constants";

export type IFileUploaderProps = {
  placeholder?: string;
  errorMessage?: string;
  isInvalid?: boolean;
  id?: string;
  isRequired?: boolean;
  onElementProps?: FormControlProps;
  value?: string; // URL lub base64 pliku
  onChange?: (file: File | null, preview: string | null) => void;
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

  const processFile = (file: File) => {
    // Walidacja rozmiaru
    const fileSizeMB = file.size / (1024 * 1024);
    if (fileSizeMB > maxSizeMB) {
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
    props.onChange?.(null, null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <FormControl
      isInvalid={props.isInvalid}
      id={props.id}
      isRequired={props.isRequired}
      {...props.onElementProps}
    >
      {props.errorMessage && (
        <FormErrorMessage mb={2}>{props.errorMessage}</FormErrorMessage>
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
              borderColor={isDragging ? "accent.500" : "gray.300"}
              _hover={{ borderColor: "accent.500" }}
              _focus={{ borderColor: "accent.500" }}
              w="100%"
              h="100px"
              bg={isDragging ? "accent.50" : "transparent"}
              transition="all 0.2s"
            >
              <Text color="gray.500">{placeholder}</Text>
            </Button>
          </Box>
        )}

        <Text fontSize="xs" color="gray.500">
          Akceptowane formaty: {acceptedFormats}.
        </Text>
        <Text fontSize="xs" color="gray.500">
          Maksymalny rozmiar: {maxSizeMB}MB
        </Text>
      </VStack>
    </FormControl>
  );
}
