// app/(logged)/dashboard/page.tsx
import { requireUserId } from "@/services/auth/actions";
import { Box, Flex } from "@chakra-ui/react";
import PeopleList from "@/components/with-onboarding/groups/PeopleList";

export default async function DashboardPage() {
  const userId = await requireUserId();

  return (
    <Flex
     flex={1}
     direction={"column"}
     backgroundColor={"gray.50"}
     padding={"2rem"}>
      <PeopleList />
    </Flex>
  );
}
