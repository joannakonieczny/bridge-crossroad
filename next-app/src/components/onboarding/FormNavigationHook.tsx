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
  const [destination, setDestination] = useState<SubmitSourceType>(null);
  const router = useRouter();

  const handlePrevClicked = () => {
    setDestination("prev");
  };

  const handleNextClicked = () => {
    setDestination("next");
  };

  const handlePrevClickedRedirectNow = () => {
    setDestination("prev");
    handleNavigation("prev");
  };

  const handleNextClickedRedirectNow = () => {
    setDestination("next");
    handleNavigation("next");
  };

  const handleNavigation = (source?: SubmitSourceType) => {
    const currentDestination = source ?? destination;
    if (currentDestination === "next" && nextPage) {
      router.push(nextPage);
    } else if (currentDestination === "prev" && prevPage) {
      router.push(prevPage);
    }
    setDestination(null);
  };

  return {
    handlePrevClicked,
    handleNextClicked,
    handleNavigation,
    handlePrevClickedRedirectNow,
    handleNextClickedRedirectNow,
  };
}
