import type { Metadata } from "next"

import { NikaPilotProfile } from "@/components/sites/NikaPilotProfile"

export const metadata: Metadata = {
  metadataBase: new URL("https://nikashabestari.com"),
  title: "About the Pilot | ShaBest Airways",
  description: "A private ShaBest pilot profile page.",
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: {
      index: false,
      follow: false,
      noimageindex: true,
    },
  },
  alternates: {
    canonical: "https://nikashabestari.com/pilot",
  },
}

export default function PilotPage() {
  return <NikaPilotProfile />
}
