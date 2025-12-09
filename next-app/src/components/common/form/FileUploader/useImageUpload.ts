"use client";

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useToast } from "@chakra-ui/react";

type UploadImageParams = {
  mutation?: {
    onSuccess?: (filePath: string) => void;
    onError?: () => void;
  };
  text: {
    toast: {
      loading: { title: string };
      success: { title: string };
      error: { title: string };
    };
  };
};

export function useImageUpload(p: UploadImageParams) {
  const toast = useToast();
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);

  const uploadImageMutation = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/files/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Upload failed");
      }

      const data = await response.json();
      return data.filePath as string;
    },
    onSuccess: (filePath) => {
      p?.mutation?.onSuccess?.(filePath);
    },
    onError: () => {
      p?.mutation?.onError?.();
    },
  });

  const uploadImage = async (): Promise<string | undefined> => {
    if (!selectedImage) {
      return undefined;
    }

    const promise = uploadImageMutation.mutateAsync(selectedImage);
    toast.promise(promise, p.text.toast);

    try {
      const uploadedPath = await promise;
      return uploadedPath;
    } catch {
      return undefined;
    }
  };

  const resetImage = () => {
    setSelectedImage(null);
    setPreview(null);
    setFileName(null);
    uploadImageMutation.reset();
  };

  const handleImageChange = (file: File | null, previewUrl: string | null) => {
    if (!file) {
      resetImage();
    } else {
      setSelectedImage(file);
      setPreview(previewUrl);
      setFileName(file.name);
    }
  };

  return {
    selectedImage,
    preview,
    fileName,
    handleImageChange,
    uploadImage,
    resetImage,
    isUploading: uploadImageMutation.isPending,
    isError: uploadImageMutation.isError,
    uploadImageMutation,
  };
}
