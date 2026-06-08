import { cn } from "@/lib/utils"

type BrowserFrameProps = {
  className?: string
  children: React.ReactNode
}

export function BrowserFrame({ className, children }: BrowserFrameProps) {
  return (
    <div
      className={cn(
        "overflow-hidden rounded-lg border border-white/15 bg-white/10 shadow-2xl shadow-black/20 backdrop-blur",
        className
      )}
    >
      <div className="flex h-9 items-center gap-2 border-b border-white/15 bg-black/20 px-3">
        <span className="size-2.5 rounded-full bg-red-400" />
        <span className="size-2.5 rounded-full bg-yellow-300" />
        <span className="size-2.5 rounded-full bg-emerald-400" />
        <div className="ml-2 h-4 flex-1 rounded-sm bg-white/15" />
      </div>
      {children}
    </div>
  )
}
