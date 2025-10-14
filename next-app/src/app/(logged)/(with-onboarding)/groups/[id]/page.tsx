import GroupView from "@/components/pages/with-onboarding/groups/group-view/GroupView";
import type { GroupIdType } from "@/schemas/model/group/group-types";

interface GroupPageProps {
  params: Promise<{ id: GroupIdType }>;
}

export default async function GroupPage(props: GroupPageProps) {
  const { id } = await props.params;

  return (
    <GroupView id={id}/>
  );
}
