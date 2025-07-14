import { requireUserId } from "@/services/auth/actions";
import { ReactNode } from "react";

// firewall for logged pages
export default async function LoggedLayout({
  children,
}: {
  children: ReactNode;
}) {
  await requireUserId();
  return <>{children}</>;
}
