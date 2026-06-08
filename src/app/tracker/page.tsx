import type { Metadata } from "next"

import { NikaFlightTrackerPage } from "@/components/sites/NikaFlightTrackerPage"

export const metadata: Metadata = {
  metadataBase: new URL("https://nikashabestari.com"),
  title: "ShaBest Live Flight Tracker | ShaBest Airways",
  description: "A live public aircraft tracker for ShaBest Airways with country landmasses, aircraft figures and heading trails.",
  openGraph: {
    title: "ShaBest Live Flight Tracker | ShaBest Airways",
    description: "Track public live aircraft positions from the ShaBest operations deck.",
    images: ["/assets/nika-aircraft-hero.png?v=tracker-20260608"],
  },
  twitter: {
    card: "summary_large_image",
    title: "ShaBest Live Flight Tracker | ShaBest Airways",
    description: "Track public live aircraft positions from the ShaBest operations deck.",
    images: ["/assets/nika-aircraft-hero.png?v=tracker-20260608"],
  },
}

export default function TrackerPage() {
  return <NikaFlightTrackerPage />
}
