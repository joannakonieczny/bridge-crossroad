import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { decrypt } from "@/services/session";

export default async function middleware(req: NextRequest) {
    const cookie = await cookies();
    const cookieValue = cookie.get('session')?.value;

    const session = await decrypt(cookieValue);

    if (!session?.userId) {
        return NextResponse.redirect(new URL("/auth/login", req.nextUrl));
    }

    return NextResponse.next();
}