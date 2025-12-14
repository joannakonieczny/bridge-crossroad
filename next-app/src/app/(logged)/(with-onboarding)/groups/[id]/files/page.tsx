import type { GroupIdType } from "@/schemas/model/group/group-types";
import GroupChatFilesClient from "@/components/pages/with-onboarding/groups/files/GroupChatFilesClient";

type GroupChatFilesPageProps = {
  params: Promise<{ id: GroupIdType }>;
};

export default async function GroupChatFilesPage(
  props: GroupChatFilesPageProps
) {
  const { id } = await props.params;

  return <GroupChatFilesClient groupId={id} />;
}
