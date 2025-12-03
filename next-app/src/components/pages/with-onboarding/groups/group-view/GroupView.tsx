"use client";

import {
  Flex,
  Button,
  VStack,
  Text,
  Stack,
  Box,
  useBreakpointValue,
  useToast,
  Spacer,
  Skeleton,
} from "@chakra-ui/react";
import PeopleList from "./PeopleList";
import GroupBanner from "./GroupBanner";
import ResponsiveHeading from "@/components/common/texts/ResponsiveHeading";
import ResponsiveText from "@/components/common/texts/ResponsiveText";
import { useRouter } from "next/navigation";
import type { GroupIdType } from "@/schemas/model/group/group-types";
import { useTranslations } from "@/lib/typed-translations";
import { useGroupQuery, useUserInfoQuery } from "@/lib/queries";
import { MdOutlineContentCopy } from "react-icons/md";

type IGroupViewProps = {
  groupId: GroupIdType;
};

export default function GroupView(props: IGroupViewProps) {
  const router = useRouter();
  const t = useTranslations("pages.GroupsPage.GroupView");
  const toast = useToast();

  const groupQ = useGroupQuery(props.groupId);
  const userInfoQ = useUserInfoQuery();

  const group = groupQ.data;
  const user = userInfoQ.data;

  const isAdmin = !!group?.admins?.some((admin) => admin.id === user?.id);

  // responsive values
  const gap = useBreakpointValue({ base: "1.25rem", md: "3rem" });
  const py = useBreakpointValue({ base: "1rem", md: "2rem" });
  const px = useBreakpointValue({ base: "1rem", md: "3rem" });
  const minH = useBreakpointValue({
    base: "calc(100vh - 7rem)",
    md: "calc(100vh - 5rem)",
  });
  const btnSize = useBreakpointValue({ base: "sm", md: "md" });
  const btnDirection = useBreakpointValue({ base: "column", md: "row" }) as
    | "column"
    | "row";
  const btnWidth = useBreakpointValue({ base: "100%", md: "auto" });

  const copyInvitationCodeToClipboard = () => {
    const promise = navigator.clipboard.writeText(group?.invitationCode ?? "");
    toast.promise(promise, {
      loading: { title: t("toast.loading") },
      success: { title: t("toast.success") },
      error: { title: t("toast.error") },
    });
  };

  return (
    <Flex
      direction="column"
      backgroundColor="border.50"
      width="100%"
      minHeight={minH}
      paddingY={py}
      paddingX={px}
      gap={gap}
      overflowY="auto"
    >
      <Box width="100%">
        <GroupBanner group={group} isLoading={groupQ.isLoading} />
      </Box>

      {isAdmin && (
        <Box width="100%">
          {groupQ.isLoading ? (
            <Stack
              paddingY="0.75rem"
              paddingX="2rem"
              backgroundColor="bg"
              direction={{ md: "row", base: "column" }}
            >
              <Stack spacing={2} direction={{ base: "row", md: "column" }}>
                <Skeleton height="1.25rem" width="10rem" borderRadius="md" />
                <Spacer />
                <Skeleton height="1.75rem" width="8rem" borderRadius="sm" />
              </Stack>
              <Spacer />
              <Skeleton
                height="2.25rem"
                width={btnWidth}
                borderRadius="md"
                alignSelf="flex-end"
              />
            </Stack>
          ) : (
            <Stack
              paddingY="0.75rem"
              paddingX="2rem"
              backgroundColor="bg"
              direction={{ md: "row", base: "column" }}
            >
              <Stack spacing={2} direction={{ base: "row", md: "column" }}>
                <ResponsiveHeading
                  barOrientation="horizontal"
                  fontSize="lg"
                  text={t("adminBox.heading")}
                  showBar={true}
                />
                <Spacer />
                {group?.invitationCode ? (
                  <ResponsiveText fontSize="2xl">
                    {group.invitationCode}
                  </ResponsiveText>
                ) : (
                  <ResponsiveText fontSize="2xl">
                    {t("adminBox.noData")}
                  </ResponsiveText>
                )}
              </Stack>
              <Spacer />
              <Button
                onClick={copyInvitationCodeToClipboard}
                backgroundColor="bg"
                color="accent.500"
                outlineColor="accent.500"
                size={btnSize}
                width={btnWidth}
                leftIcon={<MdOutlineContentCopy />}
                alignSelf="flex-end"
              >
                {t("adminBox.copyButton")}
              </Button>
            </Stack>
          )}
        </Box>
      )}

      {groupQ.isError || (!group && !groupQ.isLoading) ? (
        <VStack spacing={4} align="flex-start">
          <Text color="red.600">{t("error.loadFailed")}</Text>
          <Text color="muted">{t("error.stayInfo")}</Text>

          <Stack
            spacing={2}
            direction={btnDirection}
            align="stretch"
            width="100%"
          >
            <Button
              onClick={() => groupQ.refetch()}
              colorScheme="blue"
              size={btnSize}
              width={btnWidth}
            >
              {t("buttons.retry")}
            </Button>
            <Button
              variant="outline"
              onClick={() => router.push("/with-onboarding/groups")}
              size={btnSize}
              width={btnWidth}
            >
              {t("buttons.backToList")}
            </Button>
          </Stack>
        </VStack>
      ) : (
        <PeopleList
          members={group?.members ?? []}
          isLoading={groupQ.isLoading}
        />
      )}
    </Flex>
  );
}
