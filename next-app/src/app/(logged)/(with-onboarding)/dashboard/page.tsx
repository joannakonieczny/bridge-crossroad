// app/(logged)/dashboard/page.tsx
// import { requireUserId } from "@/services/auth/actions";
import Dashboard from "@/components/with-onboarding/dashboard/Dashboard";
export default async function DashboardPage() {
  // const userId = await requireUserId();

  return <Dashboard />;
}
