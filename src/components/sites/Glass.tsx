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
  bezel?: number
  curve?: number
  thickness?: number
  dispersion?: number
  blur?: number
  tint?: number
  border?: number
  glow?: number
  edge?: number
  light?: number
  saturate?: number
  refract?: boolean
  reveal?: boolean
  uniformBorder?: boolean
  surfaceClassName?: string
  contentClassName?: string
}

export function Glass({
  children,
  id,
  className,
  preset = "hero",
  radius = 28,
  scale,
  bezel,
  curve,
  thickness,
  dispersion,
  blur,
  tint,
  border,
  glow,
  edge,
  light,
  saturate,
  refract,
  reveal = false,
  uniformBorder = false,
  surfaceClassName,
  contentClassName,
}: GlassProps) {
  return (
    <div id={id} className={`glass-control relative isolate overflow-hidden ${className ?? ""}`}>
      <GlassSurface
        preset={preset}
        radius={radius}
        scale={scale}
        bezel={bezel}
        curve={curve}
        thickness={thickness}
        dispersion={dispersion}
        blur={blur}
        saturate={saturate}
        tint={tint}
        border={border}
        glow={glow}
        edge={edge}
        light={light}
        refract={refract}
        reveal={reveal}
        className={surfaceClassName}
      />
      {uniformBorder && <div className="pointer-events-none absolute inset-0 z-[1] rounded-[inherit] border border-white/26 shadow-[inset_0_1px_0_rgba(255,255,255,0.18)]" />}
      <div className={`relative z-10 ${contentClassName ?? ""}`}>{children}</div>
    </div>
  )
}
