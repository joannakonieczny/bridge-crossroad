import { redirect } from "next/navigation";
import { getUserId } from "@/services/auth/server-only/user-id";

// firewall for logged pages
export default async function LoggedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  let isAuthenticated = false;

  await getUserId({
    onAuthenticated: async () => {
      isAuthenticated = true;
    },
  });

  if (!isAuthenticated) {
    redirect("/auth");
  }

  return <>{children}</>;
}
