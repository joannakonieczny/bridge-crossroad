import type { GroupIdType } from "@/schemas/model/group/group-types";
import GroupChatFiles from "@/components/pages/with-onboarding/groups/files/GroupChatFiles";

type GroupChatFilesPageProps = {
  params: Promise<{ id: GroupIdType }>;
};

export default async function GroupChatFilesPage(
  props: GroupChatFilesPageProps
) {
  const { id } = await props.params;

  return <GroupChatFiles groupId={id} />;
}
