const kalRedirectDomains = ["kaldraganov.com", "kaloyandraganov.com"] as const

export const productionDomains = {
  nika: "nikashabestari.com",
  cameron: "cameronmorken.com",
  kalRedirects: kalRedirectDomains,
} as const

export type SiteKey = "nika" | "cameron"

export function normalizeHost(host: string | null) {
  return (host ?? "")
    .toLowerCase()
    .replace(/^www\./, "")
    .split(":")[0]
}

export function siteFromHost(host: string | null): SiteKey {
  const normalizedHost = normalizeHost(host)

  if (normalizedHost === productionDomains.cameron) {
    return "cameron"
  }

  return "nika"
}

export function isKalRedirectHost(host: string) {
  return (kalRedirectDomains as readonly string[]).includes(host)
}
