import ResponsiveHeading from "@/components/common/texts/ResponsiveHeading";
import ResponsiveText from "@/components/common/texts/ResponsiveText";
import { Box, Flex, HStack, Skeleton, SkeletonText } from "@chakra-ui/react";

type MemberMin = {
    _id: string;
    name: { firstName: string; lastName: string };
    nickname?: string;
};

type GroupFull = {
    id: string;
    name: string;
    description?: string;
    imageUrl?: string;
    isMain: boolean;
    invitationCode?: string;
    createdAt?: string | Date;
    updatedAt?: string | Date;
    members?: MemberMin[];
    admins?: MemberMin[];
};

interface IGroupBannerProps {
    group?: GroupFull;
    isLoading?: boolean;
}

export default function GroupBanner({ group, isLoading }: IGroupBannerProps) {
    if (isLoading) {
        return (
            <Flex
                backgroundColor="white"
                width="100%"
                paddingY="0.75rem"
                paddingX="2rem"
                direction="column"
                gap="2rem"
            >
                <Flex width="100%">
                    <Flex width="10rem" height="10rem" marginRight="1.5rem">
                        <Skeleton height="100%" />
                    </Flex>
                    <Flex direction="column" flex="1">
                        <Skeleton height="26px" width="40%" mb={4} />
                        <HStack width="100%" spacing="2rem" justify="space-between">
                            <Skeleton height="56px" width="20%" />
                            <Skeleton height="56px" width="20%" />
                            <Skeleton height="56px" width="20%" />
                        </HStack>
                    </Flex>
                </Flex>
                <SkeletonText mt="4" noOfLines={3} spacing="4" />
            </Flex>
        );
    }

    const title = group?.name ?? "Brak nazwy";
    const description = group?.description ?? "Brak opisu";
    const adminName = group?.admins?.[0]
        ? `${group!.admins![0].name.firstName} ${group!.admins![0].name.lastName}`
        : "-";
    const membersCount = group?.members?.length ?? 0;

    return (
        <Flex
            backgroundColor="white"
            width="100%"
            paddingY="0.75rem"
            paddingX="2rem"
            direction="column"
            gap="2rem"
        >
            <Flex width="100%"> {/* top */}
                <Flex width="10rem" height="10rem" marginRight="1.5rem">
                    <Box backgroundColor="accent.100" width="1rem" height="100%"></Box>
                    <Box backgroundColor="border.300" width="100%" height="100%"></Box>
                </Flex>
                <Flex direction="column" flex="1"> {/* details */}
                    <ResponsiveHeading fontSize="xl" text={title} showBar={false} width="100%" />

                    <HStack width="100%" spacing="2rem" justify="space-between">
                        <Flex direction="column">
                            <ResponsiveHeading fontSize="md" text="Administrator" showBar={false} />
                            <ResponsiveText>{adminName}</ResponsiveText>
                        </Flex>
                        <Flex direction="column">
                            <ResponsiveHeading fontSize="md" text="Data założenia" showBar={false} />
                            <ResponsiveText>
                                {group?.createdAt ? new Date(group.createdAt).toLocaleDateString() : "-"}
                            </ResponsiveText>
                        </Flex>
                        <Flex direction="column">
                            <ResponsiveHeading fontSize="md" text="Liczba członków" showBar={false} />
                            <ResponsiveText>{membersCount}</ResponsiveText>
                        </Flex>
                    </HStack>
                </Flex>
            </Flex>
            <Flex direction="column"> {/* description */}
                <ResponsiveHeading barOrientation="horizontal" fontSize="md" text="Opis grupy" showBar={true} />
                <ResponsiveText>{description}</ResponsiveText>
            </Flex>
        </Flex>
    );
}
