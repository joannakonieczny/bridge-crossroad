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

    const uploadedPath = await promise.catch(() => undefined);
    return uploadedPath;
  };

  const resetImage = () => {
    setSelectedImage(null);
    uploadImageMutation.reset();
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleImageChange = (file: File | null, _preview: string | null) => {
    setSelectedImage(file);
    if (!file) {
      resetImage();
    }
  };

  return {
    selectedImage,
    handleImageChange,
    uploadImage,
    resetImage,
    isUploading: uploadImageMutation.isPending,
    isError: uploadImageMutation.isError,
    uploadImageMutation,
  };
}
