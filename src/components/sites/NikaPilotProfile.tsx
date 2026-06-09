"use client"

import { useState } from "react"
import Link from "next/link"
import {
  BadgeCheck,
  Bell,
  Bookmark,
  CalendarDays,
  ChevronLeft,
  Coffee,
  Heart,
  Lock,
  MessageCircle,
  Plane,
  Send,
  Share2,
  Sparkles,
  Star,
  UserRound,
  X,
} from "lucide-react"

import { Button } from "@/components/ui/button"

const venmoUrl = "https://venmo.com/Nika_Shabestari?txn=pay&note=Pilot%20education%20fund"

const stats = [
  ["128", "posts"],
  ["42", "training logs"],
  ["9.8K", "fans"],
]

const tabs = ["Posts", "Media", "About"] as const

const posts = [
  {
    title: "Captain's log: crosswind practice",
    body: "A clean little training update from the unofficial ShaBest flight deck. Full photo set lands when Nika sends the assets.",
    meta: "Today",
    locked: false,
  },
  {
    title: "Behind the controls",
    body: "Cockpit study notes, flight-school milestones and the coffee-to-hours conversion chart.",
    meta: "2 days ago",
    locked: true,
  },
  {
    title: "Preflight fit check",
    body: "Uniform, headset, checklists and the kind of confidence that gets a fake airline funded.",
    meta: "This week",
    locked: true,
  },
]

function PilotLogo() {
  return (
    <span className="inline-flex size-10 items-center justify-center rounded-xl bg-[#1da1ff] text-white shadow-lg shadow-[#1da1ff]/25">
      <Plane className="size-5 -rotate-12" />
    </span>
  )
}

function PlaceholderTile({ label, locked = false }: { label: string; locked?: boolean }) {
  return (
    <div className="relative aspect-square overflow-hidden rounded-xl border border-[#d7e6f7] bg-[radial-gradient(circle_at_30%_20%,#74d7ff_0%,#1d75ff_32%,#071c48_100%)]">
      <div className="absolute inset-0 bg-[linear-gradient(145deg,rgba(255,255,255,0.2),transparent_42%,rgba(0,0,0,0.32))]" />
      <div className="absolute inset-x-3 bottom-3 rounded-lg bg-[#03122c]/58 px-3 py-2 text-xs font-bold text-white backdrop-blur-md">
        {label}
      </div>
      {locked && (
        <div className="absolute inset-0 grid place-items-center bg-[#03122c]/38 backdrop-blur-[2px]">
          <Lock className="size-7 text-white" />
        </div>
      )}
    </div>
  )
}

export function NikaPilotProfile() {
  const [activeTab, setActiveTab] = useState<(typeof tabs)[number]>("Posts")
  const [subscribed, setSubscribed] = useState(false)
  const [showSubscribeNotice, setShowSubscribeNotice] = useState(false)

  function subscribe() {
    setSubscribed(true)
    setShowSubscribeNotice(true)
  }

  return (
    <main className="min-h-screen bg-[#f2f8ff] text-[#071c48]">
      <header className="sticky top-0 z-40 border-b border-[#d5e7f8] bg-white/88 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4 sm:px-6">
          <Link href="/" className="inline-flex items-center gap-3 text-sm font-bold text-[#071c48]">
            <ChevronLeft className="size-5" />
            ShaBest
          </Link>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="rounded-full text-[#0b4c99]" aria-label="Notifications">
              <Bell className="size-5" />
            </Button>
            <Button variant="ghost" size="icon" className="rounded-full text-[#0b4c99]" aria-label="Share profile">
              <Share2 className="size-5" />
            </Button>
          </div>
        </div>
      </header>

      <section className="mx-auto max-w-5xl bg-white shadow-[0_24px_80px_rgba(7,28,72,0.08)] sm:mt-6 sm:overflow-hidden sm:rounded-2xl sm:border sm:border-[#d5e7f8]">
        <div className="relative h-52 overflow-hidden bg-[#071c48] sm:h-72">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_16%_12%,rgba(116,215,255,0.95)_0%,transparent_34%),linear-gradient(125deg,#071c48_0%,#0b4c99_47%,#48c7ff_100%)]" />
          <div className="absolute inset-0 opacity-35 [background-image:linear-gradient(90deg,rgba(255,255,255,.22)_1px,transparent_1px),linear-gradient(180deg,rgba(255,255,255,.18)_1px,transparent_1px)] [background-size:42px_42px]" />
          <div className="absolute bottom-5 left-5 flex items-center gap-3 rounded-2xl border border-white/18 bg-white/12 px-4 py-3 text-white backdrop-blur-xl">
            <PilotLogo />
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-white/70">Pilot profile</p>
              <p className="text-sm font-semibold">Training routes now posting</p>
            </div>
          </div>
        </div>

        <div className="px-4 pb-5 sm:px-6">
          <div className="relative flex flex-col gap-4 border-b border-[#d7e6f7] pb-5 pt-4 sm:flex-row sm:items-end sm:justify-between">
            <div className="flex gap-4">
              <div className="-mt-16 grid size-28 shrink-0 place-items-center rounded-full border-4 border-white bg-[linear-gradient(145deg,#061d4f,#1da1ff)] text-white shadow-xl shadow-[#0b4c99]/18 sm:size-36">
                <UserRound className="size-16" />
              </div>
              <div className="pt-1 sm:pt-2">
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-3xl font-black tracking-normal sm:text-4xl">Nika Shabestari</h1>
                  <BadgeCheck className="size-6 fill-[#1da1ff] text-white" />
                </div>
                <p className="mt-1 text-sm font-semibold text-[#47709f]">@captain_nika</p>
                <p className="mt-3 max-w-xl text-[15px] leading-7 text-[#355b88]">
                  Student pilot, unofficial airline founder, coffee-powered checklist enjoyer. Subscribe for training updates, cockpit notes and future photo drops.
                </p>
              </div>
            </div>

            <div className="flex gap-2 sm:flex-col sm:items-end">
              <Button
                onClick={subscribe}
                className="h-11 rounded-full bg-[#1da1ff] px-6 text-white shadow-lg shadow-[#1da1ff]/20 hover:bg-[#0b8fed]"
              >
                <Sparkles className="size-4" />
                {subscribed ? "Subscribed" : "Subscribe for free"}
              </Button>
              <a
                href={venmoUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex h-11 items-center justify-center gap-2 rounded-full border border-[#b9d7f2] px-5 text-sm font-bold text-[#0b4c99] transition hover:bg-[#e6f4ff]"
              >
                <Coffee className="size-4" />
                Tip pilot
              </a>
            </div>
          </div>

          <div className="grid grid-cols-3 border-b border-[#d7e6f7] py-4 text-center">
            {stats.map(([value, label]) => (
              <div key={label}>
                <p className="text-xl font-black text-[#071c48]">{value}</p>
                <p className="text-xs font-bold uppercase tracking-[0.08em] text-[#6685aa]">{label}</p>
              </div>
            ))}
          </div>

          <nav className="flex border-b border-[#d7e6f7]" aria-label="Pilot profile sections">
            {tabs.map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className={`relative flex-1 px-4 py-4 text-sm font-black transition ${
                  activeTab === tab ? "text-[#0b4c99]" : "text-[#6685aa] hover:text-[#071c48]"
                }`}
              >
                {tab}
                {activeTab === tab && <span className="absolute inset-x-8 bottom-0 h-1 rounded-t-full bg-[#1da1ff]" />}
              </button>
            ))}
          </nav>

          {activeTab === "Posts" && (
            <div className="grid gap-4 py-5 lg:grid-cols-[1fr_320px]">
              <div className="space-y-4">
                <article className="rounded-2xl border border-[#d7e6f7] bg-[#f8fcff] p-4">
                  <div className="flex items-center gap-3">
                    <div className="grid size-11 place-items-center rounded-full bg-[#0b4c99] text-white">
                      <Plane className="size-5 -rotate-12" />
                    </div>
                    <div>
                      <p className="font-black">Captain Nika</p>
                      <p className="text-xs font-semibold text-[#6685aa]">Pinned post</p>
                    </div>
                  </div>
                  <p className="mt-4 text-[15px] leading-7 text-[#355b88]">
                    Welcome aboard. This profile is for flight-school progress, future pilot photos, behind-the-scenes ShaBest lore and coffee-funded aviation excellence.
                  </p>
                  <div className="mt-4 grid grid-cols-3 gap-2">
                    <PlaceholderTile label="uniform" />
                    <PlaceholderTile label="cockpit" locked={!subscribed} />
                    <PlaceholderTile label="study desk" locked={!subscribed} />
                  </div>
                  <div className="mt-4 flex items-center justify-between border-t border-[#d7e6f7] pt-3 text-[#6685aa]">
                    <span className="inline-flex items-center gap-4">
                      <Heart className="size-5" />
                      <MessageCircle className="size-5" />
                      <Send className="size-5" />
                    </span>
                    <Bookmark className="size-5" />
                  </div>
                </article>

                {posts.map((post) => (
                  <article key={post.title} className="rounded-2xl border border-[#d7e6f7] bg-white p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-xs font-bold uppercase tracking-[0.12em] text-[#6685aa]">{post.meta}</p>
                        <h2 className="mt-2 text-xl font-black">{post.title}</h2>
                      </div>
                      {post.locked && !subscribed && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-[#e6f4ff] px-3 py-1 text-xs font-black text-[#0b4c99]">
                          <Lock className="size-3.5" />
                          Locked
                        </span>
                      )}
                    </div>
                    <p className="mt-3 text-[15px] leading-7 text-[#355b88]">{post.body}</p>
                    {post.locked && !subscribed ? (
                      <button
                        type="button"
                        onClick={subscribe}
                        className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border border-[#b9d7f2] bg-[#f2f8ff] px-4 py-4 text-sm font-black text-[#0b4c99] hover:bg-[#e6f4ff]"
                      >
                        <Lock className="size-4" />
                        Subscribe free to unlock
                      </button>
                    ) : (
                      <div className="mt-4 grid grid-cols-2 gap-2">
                        <PlaceholderTile label="new drop" />
                        <PlaceholderTile label="training note" />
                      </div>
                    )}
                  </article>
                ))}
              </div>

              <aside className="space-y-4">
                <div className="rounded-2xl border border-[#d7e6f7] bg-white p-5">
                  <h2 className="text-lg font-black">Membership</h2>
                  <p className="mt-2 text-sm leading-6 text-[#47709f]">Free profile access with optional coffee support for pilot education.</p>
                  <Button onClick={subscribe} className="mt-4 h-11 w-full rounded-full bg-[#1da1ff] text-white hover:bg-[#0b8fed]">
                    {subscribed ? "Free access active" : "Subscribe for free"}
                  </Button>
                </div>
                <div className="rounded-2xl border border-[#d7e6f7] bg-[#071c48] p-5 text-white">
                  <Star className="size-6 text-[#74d7ff]" />
                  <h2 className="mt-3 text-lg font-black">Pilot fund</h2>
                  <p className="mt-2 text-sm leading-6 text-white/72">Coffee, simulator hours and study materials. No actual airline ticket included.</p>
                  <a href={venmoUrl} target="_blank" rel="noreferrer" className="mt-4 inline-flex h-11 w-full items-center justify-center rounded-full bg-white text-sm font-black text-[#071c48]">
                    Support on Venmo
                  </a>
                </div>
              </aside>
            </div>
          )}

          {activeTab === "Media" && (
            <div className="grid grid-cols-2 gap-3 py-5 sm:grid-cols-3">
              {["cover slot", "uniform slot", "cockpit slot", "flight school", "coffee run", "checklist"].map((item, index) => (
                <PlaceholderTile key={item} label={item} locked={!subscribed && index > 1} />
              ))}
            </div>
          )}

          {activeTab === "About" && (
            <div className="grid gap-4 py-5 lg:grid-cols-2">
              {[
                ["Location", "ShaBest operations desk"],
                ["Training status", "Student pilot"],
                ["Favorite route", "Anywhere with coffee on arrival"],
                ["Support", "Venmo @Nika_Shabestari"],
              ].map(([label, value]) => (
                <div key={label} className="rounded-2xl border border-[#d7e6f7] bg-white p-5">
                  <p className="text-xs font-bold uppercase tracking-[0.12em] text-[#6685aa]">{label}</p>
                  <p className="mt-2 text-lg font-black">{value}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <div className="sticky bottom-0 z-30 border-t border-[#d5e7f8] bg-white/92 px-4 py-3 backdrop-blur-xl sm:hidden">
        <Button onClick={subscribe} className="h-11 w-full rounded-full bg-[#1da1ff] text-white hover:bg-[#0b8fed]">
          {subscribed ? "Subscribed" : "Subscribe for free"}
        </Button>
      </div>

      {showSubscribeNotice && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-[#071c48]/64 px-4 backdrop-blur-sm" role="dialog" aria-modal="true">
          <div className="w-full max-w-md rounded-2xl border border-white/20 bg-white p-6 shadow-[0_30px_90px_rgba(7,28,72,0.28)]">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-black uppercase tracking-[0.12em] text-[#1da1ff]">Subscribed</p>
                <h2 className="mt-2 text-3xl font-black text-[#071c48]">Free pilot access unlocked.</h2>
              </div>
              <button type="button" onClick={() => setShowSubscribeNotice(false)} className="rounded-full p-2 text-[#6685aa] hover:bg-[#f2f8ff]" aria-label="Close">
                <X className="size-5" />
              </button>
            </div>
            <p className="mt-4 text-[15px] leading-7 text-[#355b88]">
              You are now viewing the subscriber version of Nika&apos;s pilot profile. Future photo drops can replace the placeholder media cards.
            </p>
            <Button onClick={() => setShowSubscribeNotice(false)} className="mt-6 h-11 w-full rounded-full bg-[#1da1ff] text-white hover:bg-[#0b8fed]">
              Continue
            </Button>
          </div>
        </div>
      )}

      <footer className="mx-auto max-w-5xl px-4 py-8 text-center text-xs font-semibold text-[#6685aa]">
        <CalendarDays className="mx-auto mb-2 size-4" />
        Private parody profile. Not indexed. Photos coming later.
      </footer>
    </main>
  )
}
