"use client";

import React, { Suspense, useCallback, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Spinner } from "@chakra-ui/react";

const AVAILABLE_PAGES = ["1", "2", "3"] as const;
type PageId = (typeof AVAILABLE_PAGES)[number];

// lazy importing for code splitting
const FirstPage = React.lazy(
  () => import("@/components/onboarding/pages/FirstPage")
);

// const FirstPage = React.lazy(
//   () =>
//     new Promise<{ default: React.ComponentType<any> }>((resolve) => {
//       // Symulacja wolnego połączenia - opóźnienie 3 sekundy
//       setTimeout(() => {
//         import("@/components/onboarding/pages/FirstPage").then(resolve);
//       }, 300000);
//     })
// );

const SecondPage = React.lazy(
  () => import("@/components/onboarding/pages/SecondPage")
);
const ThirdPage = React.lazy(
  () => import("@/components/onboarding/pages/ThirdPage")
);

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
      router.replace("/onboarding/1");
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
      default:
        return null;
    }
  };

  return (
    <Suspense fallback={<LoadingFallback />}>{renderPageContent()}</Suspense>
  );
}
