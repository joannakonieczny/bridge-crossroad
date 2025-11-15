import ChatView from "@/components/pages/with-onboarding/groups/chat/ChatView";
import type { GroupIdType } from "@/schemas/model/group/group-types";

interface GroupPageProps {
  params: Promise<{ id: GroupIdType }>;
}

export default async function GroupPage(props: GroupPageProps) {
  const { id } = await props.params;

  return <ChatView groupId={id} />;
}
