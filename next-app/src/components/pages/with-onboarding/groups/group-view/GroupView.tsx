"use client";

import { Flex, Button, VStack, Text } from "@chakra-ui/react";
import PeopleList from "./PeopleList";
import GroupBanner from "./GroupBanner";
import { useActionQuery } from "@/lib/tanstack-action/actions-querry";
import { getGroupData } from "@/services/groups/api";
import { useRouter } from "next/navigation";
import { GroupIdType } from "@/schemas/model/group/group-types";
import { useEffect } from "react";
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

    return (
        <Flex
            direction="column"
            backgroundColor="border.50"
            width="100%"
            minHeight="calc(100vh - 5rem)"
            paddingY="2rem"
            paddingX="3rem"
            gap="3rem"
            overflowY="auto"
        >
            <GroupBanner group={group} isLoading={groupQ.isLoading} />

            {groupQ.isError || (!group && !groupQ.isLoading) ? (
                <VStack spacing={4} align="flex-start">
                    <Text color="red.600">{t("error.loadFailed")}</Text>
                    <Text color="muted">{t("error.stayInfo")}</Text>
                    <VStack spacing={2} direction="row" align="stretch">
                        <Button
                            onClick={() => groupQ.refetch()}
                            colorScheme="blue"
                        >
                            {t("buttons.retry")}
                        </Button>
                        <Button
                            variant="outline"
                            onClick={() => router.push('/with-onboarding/groups')}
                        >
                            {t("buttons.backToList")}
                        </Button>
                    </VStack>
                </VStack>
            ) : (
                <PeopleList members={group?.members ?? []} isLoading={groupQ.isLoading} />
            )}
        </Flex>
    );
}