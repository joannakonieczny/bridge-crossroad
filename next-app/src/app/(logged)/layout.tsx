import { requireUserId } from "@/services/auth/actions";
import type { PropsWithChildren } from "react";

// firewall for logged pages
export default async function LoggedLayout({ children }: PropsWithChildren) {
  await requireUserId();
  return <>{children}</>;
}
