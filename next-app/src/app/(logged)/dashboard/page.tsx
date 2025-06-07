// app/(logged)/dashboard/page.tsx
import { requireUserId } from "@/services/auth/actions";
import DashboardClient from "./DashboardClient";

export default async function DashboardPage() {
  const userId = await requireUserId();

  return <DashboardClient userId={userId} />;
}
