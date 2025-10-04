import Groups from "@/components/pages/with-onboarding/groups/Groups";
import { Box } from "@chakra-ui/react";

export default function GroupsPage() {
  return (
    <Box minHeight="calc(100vh - 5rem)" width="100% ]" backgroundColor="border.50">
      <Groups />
    </Box>
  ); 
}
