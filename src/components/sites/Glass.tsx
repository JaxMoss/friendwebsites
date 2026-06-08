"use client"

import { type ReactNode } from "react"
import { GlassSurface, type GlassPresetName } from "glass-lens-react"

type GlassProps = {
  children: ReactNode
  id?: string
  className?: string
  preset?: GlassPresetName
  radius?: number
  scale?: number
  blur?: number
  tint?: number
  border?: number
  glow?: number
  edge?: number
  saturate?: number
  refract?: boolean
  reveal?: boolean
}

export function Glass({
  children,
  id,
  className,
  preset = "hero",
  radius = 28,
  scale,
  blur,
  tint,
  border,
  glow,
  edge,
  saturate,
  refract,
  reveal = false,
}: GlassProps) {
  return (
    <div id={id} className={`glass-control relative isolate overflow-hidden ${className ?? ""}`}>
      <GlassSurface
        preset={preset}
        radius={radius}
        scale={scale}
        blur={blur}
        saturate={saturate}
        tint={tint}
        border={border}
        glow={glow}
        edge={edge}
        refract={refract}
        reveal={reveal}
      />
      <div className="relative z-10">{children}</div>
    </div>
  )
}
