import { headers } from "next/headers"

import { CameronSocial } from "@/components/sites/CameronSocial"
import { NikaAviation } from "@/components/sites/NikaAviation"
import { siteFromHost } from "@/lib/sites/domains"

export default async function Home() {
  const host = (await headers()).get("host")
  const site = siteFromHost(host)

  if (site === "cameron") {
    return <CameronSocial />
  }

  return <NikaAviation />
}
