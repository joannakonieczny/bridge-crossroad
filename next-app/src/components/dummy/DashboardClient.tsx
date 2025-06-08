"use client";

import { useState, useEffect } from "react";
import { logout } from "@/services/auth/actions";
import { UserId } from "@/services/auth/server-only/user-id";
import { getUser } from "@/services/onboarding/actions";
import { SanitizedUser } from "@/services/onboarding/server-only/sanitize";

export default function DashboardClient({ userId }: { userId: UserId }) {
  const [serverUser, setServerUser] = useState<SanitizedUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Wywołaj requireUserId jako Server Action
    const fetchUserId = async () => {
      try {
        setIsLoading(true);
        const result = await getUser();
        console.log("Fetched user data:", result);
        setServerUser(result);
      } catch (err) {
        setError("Nie udało się pobrać ID użytkownika");
        console.error("Error fetching user ID:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserId();
  }, []);

  return (
    <>
      <p>
        {userId
          ? `Twój ID z props to: ${userId}`
          : "Nie jesteś zalogowany (z props)."}
      </p>

      <div
        style={{
          margin: "20px 0",
          padding: "10px",
          backgroundColor: "#f0f0f0",
          borderRadius: "5px",
        }}
      >
        <h3>Wynik wywołania requireUserId():</h3>
        {isLoading ? (
          <p>Ładowanie ID użytkownika...</p>
        ) : error ? (
          <p style={{ color: "red" }}>{error}</p>
        ) : (
          <p style={{ fontWeight: "bold" }}>
            {serverUser
              ? `User z Server Action: ${JSON.stringify(serverUser)}`
              : "Brak ID z Server Action"}
          </p>
        )}
      </div>

      <button
        style={{
          backgroundColor: "blue",
          color: "white",
          padding: "8px 16px",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer",
        }}
        onClick={logout}
      >
        {userId ? "Wyloguj się" : "Zaloguj się"}
      </button>
    </>
  );
}
