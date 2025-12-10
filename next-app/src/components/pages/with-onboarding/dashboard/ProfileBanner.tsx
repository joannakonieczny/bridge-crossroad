"use client";

import { HStack, VStack, Text, SkeletonCircle, Skeleton } from "@chakra-ui/react";
import ProfilePicture from "@/components/common/ProfilePicture";
import { useUserInfoQuery } from "@/lib/queries";

export default function ProfileBanner() {
  const userQ = useUserInfoQuery();
  const u = userQ.data;
  const loading = userQ.isLoading;

  const first = u?.name?.firstName ?? "";
  const last = u?.name?.lastName ?? "";
  const displayName = [first, last].filter(Boolean).join(" ") || "—";
  const description = u?.nickname ?? "";

  const profileSize = { base: "5rem", md: "7.25rem" };

  return (
    <HStack width="100%">
      {loading ? <SkeletonCircle size={profileSize} /> : <ProfilePicture size={profileSize} />}

      <VStack align="start" width="100%">
        {loading ? (
          <>
            <Skeleton height="28px" width="60%" borderRadius="4px" />
            <Skeleton height="20px" width="40%" borderRadius="4px" mt={2} />
          </>
        ) : (
          <>
            <Text
              fontSize={{ base: "2xl", md: "3xl" }}
              lineHeight="1.1"
              fontWeight="bold"
            >
              {displayName}
            </Text>
            <Text
              fontSize={{ base: "md", md: "lg" }}
              lineHeight="1.2"
              fontWeight="bold"
              color="accent.500"
            >
              {description}
            </Text>
          </>
        )}
      </VStack>
    </HStack>
  );
}
