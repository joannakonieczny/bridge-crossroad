"use client";

import { Flex, Button, VStack, Text, Stack, Box, useBreakpointValue } from "@chakra-ui/react";
import PeopleList from "./PeopleList";
import GroupBanner from "./GroupBanner";
import { useActionQuery } from "@/lib/tanstack-action/actions-querry";
import { getGroupData } from "@/services/groups/api";
import { useRouter } from "next/navigation";
import type { GroupIdType } from "@/schemas/model/group/group-types";
import { useTranslationsWithFallback } from "@/lib/typed-translations";

interface IGroupViewProps {
    id: GroupIdType;
}

export default function GroupView(props: IGroupViewProps) {
    const router = useRouter();
    const t = useTranslationsWithFallback("pages.GroupsPage.GroupView");
    const groupQ = useActionQuery({
        queryKey: ["group", props.id],
        action: () => getGroupData({ groupId: props.id }),
        retry: false,
    });

    const group = groupQ.data;

    // responsive values
    const gap = useBreakpointValue({ base: "1.25rem", md: "3rem" });
    const py = useBreakpointValue({ base: "1rem", md: "2rem" });
    const px = useBreakpointValue({ base: "1rem", md: "3rem" });
    const minH = useBreakpointValue({ base: "calc(100vh - 7rem)", md: "calc(100vh - 5rem)" });
    const btnSize = useBreakpointValue({ base: "sm", md: "md" });
    const btnDirection = useBreakpointValue({ base: "column", md: "row" }) as "column" | "row";
    const btnWidth = useBreakpointValue({ base: "100%", md: "auto" });

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

            {groupQ.isError || (!group && !groupQ.isLoading) ? (
                <VStack spacing={4} align="flex-start">
                    <Text color="red.600">{t("error.loadFailed")}</Text>
                    <Text color="muted">{t("error.stayInfo")}</Text>

                    <Stack spacing={2} direction={btnDirection} align="stretch" width="100%">
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
                            onClick={() => router.push('/with-onboarding/groups')}
                            size={btnSize}
                            width={btnWidth}
                        >
                            {t("buttons.backToList")}
                        </Button>
                    </Stack>
                </VStack>
            ) : (
                <PeopleList members={group?.members ?? []} isLoading={groupQ.isLoading} />
            )}
        </Flex>
    );
}