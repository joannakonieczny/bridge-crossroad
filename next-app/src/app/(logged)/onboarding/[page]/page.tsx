"use client";

import { useCallback, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { ROUTES } from "@/routes";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";

const AVAILABLE_PAGES = ["1", "2", "3", "final"] as const;
export type PageId = (typeof AVAILABLE_PAGES)[number];

// Next.js dynamic imports with loading states
const FirstPage = dynamic(
  () => import("@/components/pages/onboarding/pages/FirstPage"),
  {
    loading: () => <LoadingSpinner />,
  }
);
const SecondPage = dynamic(
  () => import("@/components/pages/onboarding/pages/SecondPage"),
  {
    loading: () => <LoadingSpinner />,
  }
);
const ThirdPage = dynamic(
  () => import("@/components/pages/onboarding/pages/ThirdPage"),
  {
    loading: () => <LoadingSpinner />,
  }
);
const FinalPage = dynamic(
  () => import("@/components/pages/onboarding/pages/FinalPage"),
  {
    loading: () => <LoadingSpinner />,
  }
);

export default function OnboardingPage() {
  const router = useRouter();
  const params = useParams();
  const pageParam = Array.isArray(params.page) ? params.page[0] : params.page;

  const isValidPage = useCallback(
    (page: string | undefined): page is PageId => {
      return AVAILABLE_PAGES.includes(page as PageId);
    },
    []
  );

  useEffect(() => {
    if (!isValidPage(pageParam)) {
      // redirect with not adding to browsing history
      router.replace(ROUTES.onboarding.index);
    }
  }, [pageParam, router, isValidPage]);

  // lazy loading
  const renderPageContent = () => {
    switch (pageParam) {
      case "1":
        return <FirstPage />;
      case "2":
        return <SecondPage />;
      case "3":
        return <ThirdPage />;
      case "final":
        return <FinalPage />;
      default:
        return null;
    }
  };

  return renderPageContent();
}
