import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const protectedRoutes = ["/user-profile"];
const authOnlyRoutes = ["/auth"];

export function proxy(req: NextRequest) {
    const token = req.cookies.get("accessToken")?.value;
    const { pathname } = req.nextUrl;

    // 🔒 Protect private routes
    if (protectedRoutes.some((route) => pathname.startsWith(route))) {
        if (!token) {
            const url = req.nextUrl.clone();
            url.pathname = "/auth";
            return NextResponse.redirect(url);
        }
    }

    // 🚫 Block auth pages for logged-in users
    if (authOnlyRoutes.some((route) => pathname.startsWith(route))) {
        if (token) {
            const url = req.nextUrl.clone();
            url.pathname = "/";
            return NextResponse.redirect(url);
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/user-profile/:path*", "/auth/:path*"],
};