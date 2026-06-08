import Image from "next/image"
import Link from "next/link"
import { ArrowUpRight, Gauge, Plane, RadioTower, Route } from "lucide-react"

import { Button } from "@/components/ui/button"
import { BrowserFrame } from "@/components/shared/BrowserFrame"

const stats = [
  { label: "Cruise", value: "Mach .84" },
  { label: "Ceiling", value: "45,000 ft" },
  { label: "Range", value: "3,200 nm" },
]

const systems = [
  {
    icon: Plane,
    label: "Aircraft",
    value: "Gulfstream profile",
    detail: "Long-range cabin, swept wings, clean modern silhouette.",
  },
  {
    icon: Route,
    label: "Route",
    value: "Teterboro to Nice",
    detail: "A transatlantic flight plan with oceanic waypoints and fuel margins.",
  },
  {
    icon: RadioTower,
    label: "Comms",
    value: "HF / CPDLC",
    detail: "Aviation-grade overlays inspired by dispatch and cockpit tooling.",
  },
  {
    icon: Gauge,
    label: "Performance",
    value: "Balanced climb",
    detail: "Fast, polished, and built around motion without feeling noisy.",
  },
]

export function NikaAviation() {
  return (
    <main className="min-h-screen bg-[#f6f8f8] text-[#111817]">
      <section className="relative min-h-[92svh] overflow-hidden bg-[#dce9ee]">
        <Image
          src="/assets/nika-aircraft-hero.png"
          alt="A sleek private jet banking above a cloud layer"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(246,248,248,0.92)_0%,rgba(246,248,248,0.72)_34%,rgba(246,248,248,0.08)_72%)]" />
        <div className="absolute inset-x-0 top-0 z-10 border-b border-black/10 bg-white/55 backdrop-blur-md">
          <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 sm:px-8">
            <Link className="flex items-center gap-2 font-semibold" href="/">
              <span className="flex size-8 items-center justify-center rounded-md bg-[#101817] text-white">
                <Plane className="size-4" />
              </span>
              Nika Shabestari
            </Link>
            <nav className="hidden items-center gap-7 text-sm font-medium text-[#31413f] md:flex">
              <a href="#mission">Mission</a>
              <a href="#systems">Systems</a>
              <a href="#contact">Flight deck</a>
            </nav>
          </div>
        </div>

        <div className="relative z-10 mx-auto flex min-h-[92svh] max-w-7xl items-center px-5 pb-20 pt-24 sm:px-8">
          <div className="max-w-2xl">
            <div className="mb-5 inline-flex items-center gap-2 rounded-md border border-[#111817]/15 bg-white/70 px-3 py-1.5 text-sm font-medium text-[#31413f] backdrop-blur">
              <span className="size-2 rounded-full bg-[#2f8f83]" />
              Private aviation concept
            </div>
            <h1 className="text-balance text-5xl font-semibold leading-[0.98] tracking-normal text-[#101817] sm:text-7xl">
              Nika Shabestari
            </h1>
            <p className="mt-6 max-w-xl text-pretty text-lg leading-8 text-[#31413f]">
              A cinematic flight-deck inspired site built around speed, altitude,
              and a premium aircraft experience.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button className="h-11 rounded-md bg-[#101817] px-4 text-white hover:bg-[#243332]">
                View flight plan
                <ArrowUpRight className="size-4" />
              </Button>
              <Button
                variant="outline"
                className="h-11 rounded-md border-[#101817]/20 bg-white/70 px-4 backdrop-blur hover:bg-white"
              >
                Open hangar
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section id="mission" className="border-y border-black/10 bg-[#101817] text-white">
        <div className="mx-auto grid max-w-7xl gap-6 px-5 py-8 sm:grid-cols-3 sm:px-8">
          {stats.map((stat) => (
            <div key={stat.label} className="flex items-baseline justify-between gap-4">
              <span className="text-sm uppercase tracking-[0.18em] text-white/50">
                {stat.label}
              </span>
              <span className="text-2xl font-semibold">{stat.value}</span>
            </div>
          ))}
        </div>
      </section>

      <section id="systems" className="mx-auto grid max-w-7xl gap-8 px-5 py-16 sm:px-8 lg:grid-cols-[0.9fr_1.1fr]">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#2f8f83]">
            Systems online
          </p>
          <h2 className="mt-3 max-w-md text-3xl font-semibold leading-tight">
            Built like a dispatch board, styled like a launch sequence.
          </h2>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          {systems.map((system) => (
            <article
              key={system.label}
              className="rounded-lg border border-black/10 bg-white p-5 shadow-sm"
            >
              <system.icon className="size-5 text-[#2f8f83]" />
              <p className="mt-4 text-sm font-medium uppercase tracking-[0.16em] text-[#66716f]">
                {system.label}
              </p>
              <h3 className="mt-2 text-lg font-semibold">{system.value}</h3>
              <p className="mt-2 text-sm leading-6 text-[#52615f]">{system.detail}</p>
            </article>
          ))}
        </div>
      </section>

      <section id="contact" className="bg-[#dfe8e7] px-5 py-16 sm:px-8">
        <div className="mx-auto max-w-7xl">
          <BrowserFrame>
            <div className="grid gap-0 bg-[#0b1111] text-white lg:grid-cols-[0.8fr_1.2fr]">
              <div className="border-b border-white/10 p-6 lg:border-b-0 lg:border-r">
                <p className="text-sm uppercase tracking-[0.2em] text-white/45">
                  Flight deck
                </p>
                <h2 className="mt-3 text-3xl font-semibold">Approach briefing</h2>
                <p className="mt-4 text-sm leading-6 text-white/65">
                  This panel is ready to evolve into schedules, photo galleries,
                  maps, or whatever the reference mockup calls for.
                </p>
              </div>
              <div className="grid gap-4 p-6 sm:grid-cols-3">
                {["Altitude", "Heading", "ETA"].map((label, index) => (
                  <div key={label} className="rounded-md border border-white/10 bg-white/5 p-4">
                    <p className="text-xs uppercase tracking-[0.18em] text-white/40">{label}</p>
                    <p className="mt-5 font-mono text-2xl">
                      {index === 0 ? "410" : index === 1 ? "084" : "18:42"}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </BrowserFrame>
        </div>
      </section>
    </main>
  )
}
