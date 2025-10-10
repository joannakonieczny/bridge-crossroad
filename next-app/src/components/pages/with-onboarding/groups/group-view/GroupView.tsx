"use client";

import { Flex, Button, VStack, Text } from "@chakra-ui/react";
import PeopleList from "../PeopleList";
import GroupBanner from "./GroupBanner";
import { useActionQuery } from "@/lib/tanstack-action/actions-querry";
import { getGroupData } from "@/services/groups/api";
import { useRouter } from "next/navigation";
import { GroupIdType } from "@/schemas/model/group/group-types";

interface IGroupViewProps {
    id: GroupIdType;
}

export default function GroupView(props: IGroupViewProps) {
    const router = useRouter();
    console.log(props.id)
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
                    <Text color="red.600">Nie udało się wczytać danych grupy.</Text>
                    <Text color="muted">Pozostajesz na tej stronie — możesz spróbować ponownie lub wrócić do listy grup.</Text>
                    <VStack spacing={2} direction="row" align="stretch">
                        <Button
                            onClick={() => groupQ.refetch()}
                            colorScheme="blue"
                        >
                            Spróbuj ponownie
                        </Button>
                        <Button
                            variant="outline"
                            onClick={() => router.push('/with-onboarding/groups')}
                        >
                            Wróć do grup
                        </Button>
                    </VStack>
                </VStack>
            ) : (
                // Only render members list when we have data (or when loading)
                <PeopleList members={group?.members ?? []} isLoading={groupQ.isLoading} />
            )}
        </Flex>
    );
}