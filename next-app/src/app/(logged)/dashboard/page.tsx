// app/(logged)/dashboard/page.tsx
import { cookies } from "next/headers";
import { decrypt } from "@/services/session";
import DashboardClient from "./DashboardClient";

export default async function DashboardPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("session")?.value;
  const session = await decrypt(token);

  return <DashboardClient userId={session?.userId ?? null} />;
}
