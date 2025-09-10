import { Box, Flex, VStack } from "@chakra-ui/react";
import Sidebar from "./Sidebar";
import PeopleList from "./PeopleList";
import GroupBanner from "./GroupBanner";

interface IGroupViewProps {
    id: number;
}

export default function GroupView(props: IGroupViewProps) {
    return (
        // <PeopleList />
        <Flex
            direction="column"
            backgroundColor="border.50"
            width="100%"
            minHeight="calc(100vh - 6rem)"
            paddingY="2rem"
            paddingX="3rem"
            gap="3rem"
        >
            <GroupBanner />
            <PeopleList />
        </Flex>
    );
}