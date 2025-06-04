"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export type SubmitSourceType = "prev" | "next" | null;

interface UseFormNavigationProps {
  nextPage?: string;
  prevPage?: string;
}

export function useFormNavigation({
  nextPage,
  prevPage,
}: UseFormNavigationProps) {
  const [submitSource, setSubmitSource] = useState<SubmitSourceType>(null);
  const router = useRouter();

  const handlePrevClicked = () => {
    setSubmitSource("prev");
  };

  const handleNextClicked = () => {
    setSubmitSource("next");
  };

  const handleNavigation = () => {
    if (submitSource === "next" && nextPage) {
      router.push(nextPage);
    } else if (submitSource === "prev" && prevPage) {
      router.push(prevPage);
    }
    setSubmitSource(null);
  };

  return {
    handlePrevClicked,
    handleNextClicked,
    handleNavigation,
  };
}
