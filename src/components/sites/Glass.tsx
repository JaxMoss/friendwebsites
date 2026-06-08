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
}

export function Glass({
  children,
  id,
  className,
  preset = "hero",
  radius = 28,
  scale,
}: GlassProps) {
  return (
    <div id={id} className={`glass-control relative isolate overflow-hidden ${className ?? ""}`}>
      <GlassSurface preset={preset} radius={radius} scale={scale} reveal />
      <div className="relative z-10">{children}</div>
    </div>
  )
}
