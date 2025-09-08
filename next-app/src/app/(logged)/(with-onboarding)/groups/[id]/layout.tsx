import Sidebar from "@/components/pages/with-onboarding/groups/group-view/Sidebar";
import { Flex } from "@chakra-ui/react";
import { ReactNode } from "react";

export default function GroupsLayout({
  params,
  children,
}: {
  params: { id: string };
  children: ReactNode;
}) {
  const { id } = params; // <-- tu masz id z URL

  return (
    <Flex minHeight="calc(100vh - 6rem)" width="100%">
      <Sidebar id={Number(id)} />
      {children}
    </Flex>
  );
}
