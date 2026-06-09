import { NextResponse, type NextRequest } from "next/server"

import { isKalRedirectHost, normalizeHost, productionDomains } from "@/lib/sites/domains"

export function proxy(request: NextRequest) {
  const host = normalizeHost(request.headers.get("host"))
  const { pathname } = request.nextUrl

  if (isKalRedirectHost(host)) {
    return NextResponse.redirect("https://kkdraganov.github.io/", 308)
  }

  if (pathname === "/favicon.ico") {
    const faviconPath = host === productionDomains.cameron ? "/favicons/cameron.svg" : "/favicons/shabest.svg"
    return NextResponse.rewrite(new URL(faviconPath, request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/favicon.ico", "/((?!api|_next/static|_next/image|.*\\.png$|.*\\.svg$).*)"],
}
