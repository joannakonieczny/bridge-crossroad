'use client';

import { useRouter } from "next/navigation";
import { logout } from "@/services/actions";

export default function DashboardClient({ userId }: { userId: string | null }) {
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.push("/auth/login");
  };

  return (
    <>
      <p>{userId ? `Twój ID to: ${userId}` : "Nie jesteś zalogowany."}</p>
      <button style={{ backgroundColor: "blue", color: "white", padding: "8px 16px" }} onClick={handleLogout}> 
        {userId ? "Wyloguj się" : "Zaloguj się"}
      </button>
    </>
  );
}