import type { Metadata } from "next"
import { headers } from "next/headers"

import { CameronSocial } from "@/components/sites/CameronSocial"
import { NikaAviation } from "@/components/sites/NikaAviation"
import { siteFromHost } from "@/lib/sites/domains"

const siteMetadata = {
  nika: {
    title: "ShaBest Airways | Fly ShaBest",
    description: "A cinematic ShaBest Airways landing page for Nikasha Bestari.",
    domain: "nikashabestari.com",
    image: "/assets/nika-aircraft-hero.png?v=shabest-20260608",
  },
  cameron: {
    title: "Cameron Morken | Personal Social",
    description: "Cameron Morken's personal social page.",
    domain: "cameronmorken.com",
    image: "/assets/cameron-avatar.svg?v=cameron-20260608",
  },
} as const

function absoluteUrl(path: string, domain: string) {
  return new URL(path, `https://${domain}`)
}

export async function generateMetadata(): Promise<Metadata> {
  const host = (await headers()).get("host")
  const site = siteFromHost(host)
  const meta = siteMetadata[site]
  const canonical = `https://${meta.domain}`
  const image = absoluteUrl(meta.image, meta.domain)

  return {
    title: meta.title,
    description: meta.description,
    metadataBase: new URL(canonical),
    alternates: {
      canonical,
    },
    openGraph: {
      title: meta.title,
      description: meta.description,
      url: canonical,
      siteName: meta.title,
      type: "website",
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: meta.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: meta.title,
      description: meta.description,
      images: [image],
    },
  }
}

export default async function Home() {
  const host = (await headers()).get("host")
  const site = siteFromHost(host)

  if (site === "cameron") {
    return <CameronSocial />
  }

  return <NikaAviation />
}
