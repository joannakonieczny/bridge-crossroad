import Sidebar from "@/components/pages/with-onboarding/groups/group-view/Sidebar";
import type { GroupIdType } from "@/schemas/model/group/group-types";
import { Flex } from "@chakra-ui/react";
import type { PropsWithChildren } from "react";

type GroupsLayoutProps = {
  params: Promise<{
    id: GroupIdType;
  }>;
} & PropsWithChildren;

export default async function GroupsLayout({
  params,
  children,
}: GroupsLayoutProps) {
  const { id } = await params;
  return (
    <Flex
      minHeight="calc(100vh - 6rem)"
      width="100%"
      direction={{ base: "column", md: "row" }}
    >
      <Sidebar groupId={id} />
      {children}
    </Flex>
  );
}
