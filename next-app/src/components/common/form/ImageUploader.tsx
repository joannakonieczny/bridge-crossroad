import type { FormControlProps } from "@chakra-ui/react";
import {
  FormControl,
  FormErrorMessage,
  Input,
  Box,
  Image,
  Button,
  VStack,
  Text,
} from "@chakra-ui/react";
import type { ChangeEvent } from "react";
import { useRef, useState } from "react";

export type IImageUploaderProps = {
  placeholder?: string;
  errorMessage?: string;
  isInvalid?: boolean;
  id?: string;
  isRequired?: boolean;
  onElementProps?: FormControlProps;
  value?: string; // URL lub base64 obrazu
  onChange?: (file: File | null, preview: string | null) => void;
  acceptedFormats?: string; // np. "image/png,image/jpeg"
  maxSizeMB?: number;
};

export default function ImageUploader(props: IImageUploaderProps) {
  const {
    placeholder = "Wybierz obraz",
    acceptedFormats = "image/png,image/jpeg,image/jpg,image/webp",
    maxSizeMB = 5,
  } = props;

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(props.value ?? null);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) {
      setPreview(null);
      props.onChange?.(null, null);
      return;
    }

    // Walidacja rozmiaru
    const fileSizeMB = file.size / (1024 * 1024);
    if (fileSizeMB > maxSizeMB) {
      props.onChange?.(null, null);
      return;
    }

    // Tworzenie podglądu
    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      setPreview(result);
      props.onChange?.(file, result);
    };
    reader.readAsDataURL(file);
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleRemove = () => {
    setPreview(null);
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

      <VStack spacing={4} align="stretch">
        <Input
          ref={fileInputRef}
          type="file"
          accept={acceptedFormats}
          onChange={handleFileChange}
          display="none"
        />

        {preview ? (
          <Box position="relative" borderRadius="md" overflow="hidden">
            <Image
              src={preview}
              alt="Preview"
              maxH="300px"
              objectFit="contain"
              w="100%"
            />
            <Button
              position="absolute"
              top={2}
              right={2}
              size="sm"
              colorScheme="red"
              onClick={handleRemove}
            >
              Usuń
            </Button>
          </Box>
        ) : (
          <Button
            onClick={handleClick}
            variant="outline"
            borderColor="gray.300"
            _hover={{ borderColor: "accent.500" }}
            _focus={{ borderColor: "accent.500" }}
            w="100%"
            h="100px"
          >
            <Text color="gray.500">{placeholder}</Text>
          </Button>
        )}

        <Text fontSize="sm" color="gray.500">
          Akceptowane formaty: {acceptedFormats}. Maksymalny rozmiar:{" "}
          {maxSizeMB}MB
        </Text>
      </VStack>
    </FormControl>
  );
}
