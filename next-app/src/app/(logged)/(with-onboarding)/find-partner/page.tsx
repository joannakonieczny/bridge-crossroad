// app/(logged)/dashboard/page.tsx
import { requireUserId } from "@/services/auth/actions";

export default async function DashboardPage() {
  const userId = await requireUserId();

  return <>szukaj partnera</>;
}
