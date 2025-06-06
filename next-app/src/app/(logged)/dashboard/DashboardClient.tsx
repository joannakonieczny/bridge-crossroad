'use client';

import { logout } from "@/services/actions";

export default function DashboardClient({ userId }: { userId: string | null }) {
  return (
    <>
      <p>{userId ? `Twój ID to: ${userId}` : "Nie jesteś zalogowany."}</p>
      <button style={{ backgroundColor: "blue", color: "white", padding: "8px 16px" }} onClick={logout}> 
        {userId ? "Wyloguj się" : "Zaloguj się"}
      </button>
    </>
  );
}