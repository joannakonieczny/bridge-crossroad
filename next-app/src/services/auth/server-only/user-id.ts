"server-only";

import { cookies } from "next/headers";
import { decrypt } from "@/services/auth/server-only/session";
import type { UserIdType } from "@/schemas/model/user/user-types";

type GetUserIdProps = {
  //always wait for these functions to complete
  onAuthenticated?: (userId: UserIdType) => Promise<void> | void;
  onUnauthenticated?: () => Promise<void> | void;
};

export async function getUserId(
  props: GetUserIdProps
): Promise<UserIdType | null> {
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
