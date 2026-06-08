import Image from "next/image"
import Link from "next/link"
import { Bell, Camera, Grid3X3, Heart, Lock, MessageCircle, MoreHorizontal, Settings, Sparkles, UserPlus } from "lucide-react"

import { Button } from "@/components/ui/button"

const posts = [
  { title: "Lake day", color: "from-sky-200 to-emerald-200" },
  { title: "Night out", color: "from-rose-200 to-zinc-900" },
  { title: "Gym check", color: "from-zinc-200 to-blue-300" },
  { title: "New reel", color: "from-violet-200 to-orange-200" },
  { title: "Fit pic", color: "from-stone-200 to-zinc-500" },
  { title: "Weekend", color: "from-cyan-100 to-lime-200" },
]

export function CameronSocial() {
  return (
    <main className="min-h-screen bg-[#f7f7f8] text-[#111114]">
      <div className="mx-auto min-h-screen max-w-6xl border-x border-black/10 bg-white">
        <header className="sticky top-0 z-20 flex h-14 items-center justify-between border-b border-black/10 bg-white/90 px-4 backdrop-blur">
          <Link className="text-lg font-semibold" href="/">
            Cameron Morken
          </Link>
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="icon" aria-label="Notifications">
              <Bell className="size-4" />
            </Button>
            <Button variant="ghost" size="icon" aria-label="Settings">
              <Settings className="size-4" />
            </Button>
          </div>
        </header>

        <section className="relative">
          <div className="h-48 bg-[linear-gradient(135deg,#111114_0%,#33383f_38%,#ebedef_100%)] sm:h-64" />
          <div className="px-4 pb-6 sm:px-8">
            <div className="-mt-14 flex flex-col gap-5 sm:-mt-16 sm:flex-row sm:items-end sm:justify-between">
              <div className="flex items-end gap-4">
                <div className="relative size-28 overflow-hidden rounded-lg border-4 border-white bg-zinc-200 shadow-sm sm:size-32">
                  <Image
                    src="/assets/cameron-avatar.svg"
                    alt="Cameron profile avatar"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="pb-2">
                  <div className="flex items-center gap-2">
                    <h1 className="text-3xl font-semibold leading-none">Cameron</h1>
                    <span className="rounded-sm bg-[#111114] px-1.5 py-0.5 text-xs font-semibold text-white">
                      PRO
                    </span>
                  </div>
                  <p className="mt-2 text-sm text-zinc-500">@cameronmorken</p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button className="h-10 rounded-md bg-[#00a3ff] px-4 text-white hover:bg-[#048de0]">
                  <UserPlus className="size-4" />
                  Follow
                </Button>
                <Button variant="outline" className="h-10 rounded-md px-4">
                  <MessageCircle className="size-4" />
                  Message
                </Button>
                <Button variant="outline" size="icon" className="h-10 w-10 rounded-md">
                  <MoreHorizontal className="size-4" />
                </Button>
              </div>
            </div>

            <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_320px]">
              <div>
                <p className="max-w-2xl text-[15px] leading-7 text-zinc-700">
                  Personal photo stream, updates, and behind-the-scenes posts in a
                  clean creator profile format.
                </p>
                <div className="mt-5 flex flex-wrap gap-6 border-y border-black/10 py-4 text-sm">
                  <span>
                    <strong className="text-base">128</strong> posts
                  </span>
                  <span>
                    <strong className="text-base">14.8k</strong> followers
                  </span>
                  <span>
                    <strong className="text-base">342</strong> following
                  </span>
                </div>
              </div>
              <aside className="rounded-lg border border-black/10 bg-[#f7f7f8] p-4">
                <div className="flex items-center gap-2 text-sm font-semibold">
                  <Sparkles className="size-4 text-[#00a3ff]" />
                  Creator pass
                </div>
                <p className="mt-2 text-sm leading-6 text-zinc-600">
                  A tasteful subscription-style panel for private updates,
                  galleries, and direct messages.
                </p>
                <Button className="mt-4 h-10 w-full rounded-md bg-[#111114] text-white hover:bg-zinc-800">
                  Join updates
                </Button>
              </aside>
            </div>
          </div>
        </section>

        <nav className="grid grid-cols-3 border-y border-black/10 text-sm font-medium text-zinc-500">
          <a className="flex h-12 items-center justify-center gap-2 border-b-2 border-[#00a3ff] text-[#111114]" href="#posts">
            <Grid3X3 className="size-4" />
            Posts
          </a>
          <a className="flex h-12 items-center justify-center gap-2" href="#media">
            <Camera className="size-4" />
            Media
          </a>
          <a className="flex h-12 items-center justify-center gap-2" href="#likes">
            <Heart className="size-4" />
            Likes
          </a>
        </nav>

        <section id="posts" className="grid gap-px bg-black/10 p-px sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post, index) => (
            <article
              key={post.title}
              className="group relative aspect-square overflow-hidden bg-white"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${post.color}`} />
              <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_45%,rgba(0,0,0,0.58)_100%)] opacity-85" />
              {index % 3 === 1 && (
                <div className="absolute right-3 top-3 flex size-8 items-center justify-center rounded-md bg-black/50 text-white backdrop-blur">
                  <Lock className="size-4" />
                </div>
              )}
              <div className="absolute inset-x-0 bottom-0 p-4 text-white">
                <p className="font-semibold">{post.title}</p>
                <p className="mt-1 text-sm text-white/75">Tap to preview</p>
              </div>
            </article>
          ))}
        </section>
      </div>
    </main>
  )
}
