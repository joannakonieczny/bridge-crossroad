import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { decrypt } from "./services/session";

const protectedRoutes = ["/dashboard"];
const publicRoutes = ["/auth/login"];

export default async function middleware(req: NextRequest) {
    const path = req.nextUrl.pathname;
    const isProtected = protectedRoutes.includes(path);
    const isPublic = publicRoutes.includes(path);

    const cookie = await cookies();
    const cookieValue = cookie.get('session')?.value;

    const session = await decrypt(cookieValue);

    if (isProtected && !session?.userId) {
        return NextResponse.redirect(new URL("/auth/login", req.nextUrl));
    }

    if (isPublic && session?.userId) {
        return NextResponse.redirect(new URL("/dashboard", req.nextUrl));
    }

    return NextResponse.next();
}