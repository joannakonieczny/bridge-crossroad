import { NextRequest, NextResponse } from "next/server";
import { getUserId } from "@/services/auth/server-only/userID";

// additional firewall
export default async function middleware(req: NextRequest) {
  let res;
  await getUserId({
    onUnauthenticated: async () => {
      res = NextResponse.redirect(new URL("/auth/login", req.nextUrl));
    },
    onAuthenticated: async () => {
      res = NextResponse.next();
    },
  });
  return res;
}
