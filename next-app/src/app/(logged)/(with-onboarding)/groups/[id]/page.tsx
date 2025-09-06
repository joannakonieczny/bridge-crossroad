import GroupView from "@/components/pages/with-onboarding/groups/group-view/GroupView";

interface GroupPageProps {
  params: Promise<{ id: string }>;
}

export default async function GroupPage({ params }: GroupPageProps) {
  const { id } = await params;

  return (
    <GroupView id={Number(id)}/>
  );
}
