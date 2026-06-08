import Link from "next/link"
import { ArrowLeft, Plane, Radar, ShieldCheck } from "lucide-react"

import { LiveFlightGlobe } from "@/components/sites/LiveFlightGlobe"

function TrackerLogo() {
  return (
    <div className="flex items-center gap-3 text-white">
      <span className="flex size-10 items-center justify-center rounded-lg bg-[#f6b21a] text-[#06255b] shadow-lg shadow-[#f6b21a]/20">
        <Plane className="size-5 -rotate-12" />
      </span>
      <span className="leading-none">
        <span className="block text-2xl font-bold tracking-normal">
          Sha<span className="text-[#f6b21a]">Best</span>
        </span>
        <span className="mt-1 block text-[0.68rem] font-semibold uppercase tracking-[0.42em] text-white/78">Airways</span>
      </span>
    </div>
  )
}

export function NikaFlightTrackerPage() {
  return (
    <main className="min-h-screen bg-[#020917] text-white">
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_10%,rgba(75,184,255,0.24),transparent_34%),radial-gradient(circle_at_85%_4%,rgba(246,178,26,0.16),transparent_28%),linear-gradient(180deg,#061d4f_0%,#020917_44%,#03122c_100%)]" />
        <header className="relative z-10 border-b border-white/10">
          <div className="mx-auto flex min-h-16 max-w-7xl items-center justify-between gap-5 px-5 py-3 sm:px-8">
            <Link href="/" aria-label="ShaBest Airways home">
              <TrackerLogo />
            </Link>
            <Link href="/" className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-white/16 bg-white/8 px-4 text-sm font-bold text-white hover:bg-white/14">
              <ArrowLeft className="size-4" />
              Back to airline
            </Link>
          </div>
        </header>

        <div className="relative z-10 mx-auto max-w-7xl px-5 pb-8 pt-5 sm:px-8 lg:pt-6">
          <div className="grid gap-4 lg:grid-cols-[1fr_380px] lg:items-end">
            <div>
              <p className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/8 px-4 py-2 text-[0.68rem] font-bold uppercase tracking-[0.18em] text-[#f6b21a]">
                <Radar className="size-4" />
                Live public aircraft map
              </p>
              <h1 className="mt-3 max-w-4xl text-balance text-4xl font-bold leading-[1.04] tracking-normal lg:text-5xl">
                ShaBest live flight tracker.
              </h1>
              <p className="mt-3 max-w-2xl text-base leading-7 text-white/72">
                Live public ADS-B positions are displayed as ShaBest operations with aircraft figures, country landmasses and projected heading trails.
              </p>
            </div>
            <div className="rounded-2xl border border-white/12 bg-white/8 p-4 shadow-2xl shadow-black/18 backdrop-blur-xl">
              <div className="flex items-center gap-3">
                <ShieldCheck className="size-6 text-[#f6b21a]" />
                <h2 className="text-lg font-bold">Data note</h2>
              </div>
              <p className="mt-2 text-sm leading-6 text-white/66">
                OpenSky provides live state vectors, not full itinerary routes. The gold trails are heading projections from live position and heading data where available.
              </p>
            </div>
          </div>

          <div className="mt-6">
            <LiveFlightGlobe />
          </div>
        </div>
      </section>
    </main>
  )
}
