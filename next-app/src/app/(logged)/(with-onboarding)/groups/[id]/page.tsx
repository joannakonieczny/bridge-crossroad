import GroupView from "@/components/pages/with-onboarding/groups/group-view/GroupView";

interface GroupPageProps {
  params: Promise<{ id: string }>;
}

export default async function GroupPage(props: GroupPageProps) {
  const { id } = await props.params;

  return (
    <GroupView id={id}/>
  );
}
