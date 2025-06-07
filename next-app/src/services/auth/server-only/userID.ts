"server-only";

import { cookies } from "next/headers";
import { decrypt } from "@/services/auth/server-only/session";

export type UserId = string;

type GetUserIdProps = {
  //always wait for these functions to complete
  onAuthenticated?: (userId: string) => Promise<void> | void;
  onUnauthenticated?: () => Promise<void> | void;
};

export async function getUserId(props: GetUserIdProps): Promise<UserId | null> {
  const cookie = await cookies();
  const cookieValue = cookie.get("session")?.value;
  try {
    const session = await decrypt(cookieValue);
    if (!session?.userId) {
      await props.onUnauthenticated?.();
      return null;
    }
    await props.onAuthenticated?.(session.userId);
    return session.userId;
  } catch {
    await props.onUnauthenticated?.();
    return null;
  }
}
