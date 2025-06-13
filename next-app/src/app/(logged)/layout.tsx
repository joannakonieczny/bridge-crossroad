import { requireUserId } from "@/services/auth/actions";

// firewall for logged pages
export default async function LoggedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireUserId();
  return <>{
    children}
  </>;
}
