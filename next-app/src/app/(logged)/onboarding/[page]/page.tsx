"use client";

import { Suspense, useCallback, useEffect, lazy } from "react";
import { useParams, useRouter } from "next/navigation";
import { Spinner } from "@chakra-ui/react";

const AVAILABLE_PAGES = ["1", "2", "3", "final"] as const;
export type PageId = (typeof AVAILABLE_PAGES)[number];

// lazy importing for code splitting
const FirstPage = lazy(() => import("@/components/onboarding/pages/FirstPage"));
const SecondPage = lazy(
  () => import("@/components/onboarding/pages/SecondPage")
);
const ThirdPage = lazy(() => import("@/components/onboarding/pages/ThirdPage"));
const FinalPage = lazy(() => import("@/components/onboarding/pages/FinalPage"));

const LoadingFallback = () => (
  <Spinner
    emptyColor="accent.200"
    color="accent.500"
    size="xl"
    thickness="5px"
  />
); //TODO

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
      router.replace("/onboarding");
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

  return (
    <Suspense fallback={<LoadingFallback />}>{renderPageContent()}</Suspense>
  );
}
