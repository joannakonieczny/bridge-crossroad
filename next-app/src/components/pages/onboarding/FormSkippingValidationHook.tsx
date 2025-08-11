"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useOnboardingFormData } from "./FormDataContext";
import { PageId } from "@/app/(logged)/onboarding/[page]/page";
import { FormData } from "./FormDataContext";
import { ROUTES } from "@/routes";

// route : "/onboarding/[page]"
const pageRoutes: Record<PageId, string> = {
  "1": ROUTES.onboarding.step_1,
  "2": ROUTES.onboarding.step_2,
  "3": ROUTES.onboarding.step_3,
  final: ROUTES.onboarding.final,
};
const pageOrder: PageId[] = ["1", "2", "3", "final"];

function getCurrentPageData(page: PageId, formData: FormData) {
  switch (page) {
    case "1":
      return formData.firstPage;
    case "2":
      return formData.secondPage;
    case "3":
      return formData.thirdPage;
    case "final":
      return formData.finalPage;
    default:
      return undefined;
  }
}

function findLastFilledPageIndex(formData: FormData): number {
  for (let i = pageOrder.length - 1; i >= 0; i--) {
    const pageData = getCurrentPageData(pageOrder[i], formData);
    if (pageData && Object.keys(pageData).length > 0) {
      return i;
    }
  }
  return -1; // none
}

interface UseFormValidationProps {
  currentPage: PageId;
}

export function useFormSkippingValidation({
  currentPage,
}: UseFormValidationProps) {
  const router = useRouter();
  const { formData } = useOnboardingFormData();

  useEffect(() => {
    // do not validate the first page
    if (currentPage !== "1") {
      const currentPageIndex = pageOrder.indexOf(currentPage);

      // validate if all previous pages have data
      for (let i = 0; i < currentPageIndex; i++) {
        const prevPageId = pageOrder[i];
        const prevPageData = getCurrentPageData(prevPageId, formData);

        // if the previous page data is empty, redirect to that page
        if (!prevPageData || Object.keys(prevPageData).length === 0) {
          console.log(`Missing data for page ${prevPageId}, redirecting...`);
          router.replace(pageRoutes[prevPageId]);
          return;
        }
      }
    }

    // If we skipped a page (e.g., through URL manipulation), go back to the last filled page
    const lastFilledPageIndex = findLastFilledPageIndex(formData);
    const currentPageIndex = pageOrder.indexOf(currentPage);

    // If we skipped more than one page forward
    if (currentPageIndex > lastFilledPageIndex + 1) {
      const correctPage = pageOrder[lastFilledPageIndex + 1];
      console.log(`Skipped pages, redirecting to ${correctPage}`);
      router.replace(pageRoutes[correctPage]);
    }
  }, [currentPage, formData, router]);
}
