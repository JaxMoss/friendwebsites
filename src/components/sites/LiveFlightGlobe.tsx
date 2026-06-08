"use client"

import dynamic from "next/dynamic"
import { Globe2 } from "lucide-react"

const GlobeClient = dynamic(() => import("@/components/sites/LiveFlightGlobeClient").then((module) => module.LiveFlightGlobe), {
  ssr: false,
  loading: () => <LiveFlightGlobeLoading />,
})

function LiveFlightGlobeLoading() {
  return (
    <section className="overflow-hidden rounded-3xl border border-white/12 bg-[#03122c] text-white shadow-2xl shadow-slate-950/30">
      <div className="grid min-h-[760px] xl:grid-cols-[minmax(0,1.45fr)_420px]">
        <div className="relative min-h-[560px] overflow-hidden bg-[radial-gradient(circle_at_38%_34%,rgba(50,154,221,0.34),transparent_36%),linear-gradient(140deg,#061d4f,#020917_62%,#03122c)]">
          <div className="absolute left-5 top-5 rounded-2xl border border-white/12 bg-[#03122c]/66 p-4 shadow-xl shadow-black/18 backdrop-blur-xl">
            <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-[#f6b21a]">
              <Globe2 className="size-4" />
              ShaBest live ops
            </p>
            <div className="mt-3 animate-pulse">
              <div className="h-9 w-44 rounded bg-white/16" />
              <div className="mt-3 h-4 w-56 rounded bg-white/10" />
            </div>
          </div>
          <div className="absolute inset-0 grid place-items-center">
            <div className="size-72 animate-pulse rounded-full border border-sky-200/20 bg-sky-300/10 shadow-[0_0_120px_rgba(80,180,255,0.2)]" />
          </div>
        </div>
        <aside className="border-t border-white/10 bg-[#03122c]/88 p-5 xl:border-l xl:border-t-0">
          <div className="animate-pulse">
            <div className="h-4 w-36 rounded bg-[#f6b21a]/24" />
            <div className="mt-4 h-8 w-64 rounded bg-white/14" />
            <div className="mt-6 grid grid-cols-3 gap-3">
              {Array.from({ length: 3 }).map((_, index) => (
                <div key={index} className="rounded-xl border border-white/10 bg-white/8 p-4">
                  <div className="h-5 w-5 rounded bg-white/18" />
                  <div className="mt-4 h-7 w-16 rounded bg-white/18" />
                  <div className="mt-2 h-3 w-20 rounded bg-white/12" />
                </div>
              ))}
            </div>
            <div className="mt-6 space-y-3">
              {Array.from({ length: 6 }).map((_, index) => (
                <div key={index} className="rounded-xl border border-white/10 bg-white/7 p-4">
                  <div className="h-4 w-28 rounded bg-white/16" />
                  <div className="mt-4 h-3 w-36 rounded bg-white/12" />
                  <div className="mt-3 h-3 w-56 max-w-full rounded bg-white/10" />
                </div>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </section>
  )
}

export function LiveFlightGlobe() {
  return <GlobeClient />
}
