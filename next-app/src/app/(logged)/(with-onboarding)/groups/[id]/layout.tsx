import Sidebar from "@/components/pages/with-onboarding/groups/group-view/Sidebar";
import { GroupIdType } from "@/schemas/model/group/group-types";
import { Flex } from "@chakra-ui/react";
import { ReactNode } from "react";

export default function GroupsLayout({
  params,
  children,
}: {
  params: { id: GroupIdType };
  children: ReactNode;
}) {
  const { id } = params;

  return (
    <Flex minHeight="calc(100vh - 6rem)" width="100%">
      <Sidebar id={id} />
      {children}
    </Flex>
  );
}
