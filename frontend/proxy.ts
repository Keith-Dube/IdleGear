import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse, type NextFetchEvent, type NextRequest } from "next/server";

import { isClerkConfigured } from "@/lib/auth-config";

const isProtectedRoute = createRouteMatcher(["/dashboard(.*)"]);

const clerkProxy = isClerkConfigured
  ? clerkMiddleware(async (auth, request) => {
      if (isProtectedRoute(request)) {
        await auth.protect();
      }
    })
  : undefined;

export default function proxy(request: NextRequest, event: NextFetchEvent) {
  if (!isClerkConfigured || !clerkProxy) {
    return NextResponse.next();
  }

  return clerkProxy(request, event);
}

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
    "/__clerk/(.*)",
  ],
};
