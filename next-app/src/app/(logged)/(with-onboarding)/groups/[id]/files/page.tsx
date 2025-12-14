import type { GroupIdType } from "@/schemas/model/group/group-types";

type GroupChatFilesPageProps = {
  params: Promise<{ id: GroupIdType }>;
};

export default async function GroupChatFilesPage(
  props: GroupChatFilesPageProps
) {
  const { id } = await props.params;

  return "hello" + id;
}
