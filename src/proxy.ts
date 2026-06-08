import { NextResponse, type NextRequest } from "next/server"

import { isKalRedirectHost, normalizeHost } from "@/lib/sites/domains"

export function proxy(request: NextRequest) {
  const host = normalizeHost(request.headers.get("host"))

  if (isKalRedirectHost(host)) {
    return NextResponse.redirect("https://kkdraganov.github.io/", 308)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|.*\\.png$|.*\\.svg$|favicon.ico).*)"],
}
