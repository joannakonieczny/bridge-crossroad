import Sidebar from "@/components/pages/with-onboarding/groups/group-view/Sidebar";
import type { GroupIdType } from "@/schemas/model/group/group-types";
import { Flex } from "@chakra-ui/react";
import type { ReactNode } from "react";

interface GroupsLayoutProps {
  params?: Promise<{ id: GroupIdType }> | undefined;
  children: ReactNode;
}

export default async function GroupsLayout(props: GroupsLayoutProps) {
  const { params: maybeParams, children } = props;
  const params = maybeParams ? await maybeParams : undefined;
  const { id } = params ?? ({} as { id: GroupIdType });

  return (
    <Flex minHeight="calc(100vh - 6rem)" width="100%">
      <Sidebar id={id} />
      {children}
    </Flex>
  );
}
