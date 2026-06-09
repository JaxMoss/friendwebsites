"use client"

import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import * as THREE from "three"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js"
import ThreeGlobe from "three-globe"
import { feature } from "topojson-client"
import countries110m from "world-atlas/countries-110m.json"
import { Activity, Globe2, Plane, RefreshCw, Route, Satellite } from "lucide-react"

import { Button } from "@/components/ui/button"

type LiveFlight = {
  id: string
  callsign: string
  country: string
  latitude: number
  longitude: number
  altitude: number
  velocity: number
  heading: number
  verticalRate: number
}

type LiveFlightResponse = {
  source: "airplanes_live" | "opensky" | "demo"
  sourceLabel: string
  updatedAt: string
  flights: LiveFlight[]
}

type CountryFeature = {
  geometry: {
    type: string
    coordinates: number[]
  }
  properties?: Record<string, unknown>
}

type TrackPoint = {
  lat: number
  lng: number
  alt: number
}

type TrackPath = {
  id: string
  points: TrackPoint[]
  color: string[]
}

function trackPointFromFlight(flight: LiveFlight): TrackPoint {
  return {
    lat: flight.latitude,
    lng: flight.longitude,
    alt: altitudeToGlobeAltitude(flight.altitude),
  }
}

function sameTrackPoint(a: TrackPoint, b: TrackPoint) {
  return Math.abs(a.lat - b.lat) < 0.006 && Math.abs(a.lng - b.lng) < 0.006
}

const countryFeatures = (
  (feature as unknown as (topology: unknown, object: unknown) => { features: CountryFeature[] })(
    countries110m,
    (countries110m as unknown as { objects: { countries: object } }).objects.countries
  )
).features

function projectPoint(latitude: number, longitude: number, heading: number, distanceDegrees: number) {
  const rad = Math.PI / 180
  const distance = distanceDegrees * rad
  const bearing = heading * rad
  const lat1 = latitude * rad
  const lon1 = longitude * rad

  const lat2 = Math.asin(Math.sin(lat1) * Math.cos(distance) + Math.cos(lat1) * Math.sin(distance) * Math.cos(bearing))
  const lon2 =
    lon1 +
    Math.atan2(
      Math.sin(bearing) * Math.sin(distance) * Math.cos(lat1),
      Math.cos(distance) - Math.sin(lat1) * Math.sin(lat2)
    )

  return {
    latitude: lat2 / rad,
    longitude: ((lon2 / rad + 540) % 360) - 180,
  }
}

function altitudeToGlobeAltitude(altitude: number) {
  return 0.045 + Math.min(Math.max(altitude, 0) / 300000, 0.05)
}

function flightAlias(flight: LiveFlight) {
  const digits = flight.callsign.replace(/\D/g, "").slice(-3)
  return `SB ${digits || flight.id.slice(-3).toUpperCase()}`
}

function makeTrackPath(flight: LiveFlight): TrackPath {
  const altitude = altitudeToGlobeAltitude(flight.altitude)
  const speedFactor = Math.min(Math.max(flight.velocity || 180, 120) / 260, 1.25)
  const behindFar = projectPoint(flight.latitude, flight.longitude, flight.heading + 180, 1.9 * speedFactor)
  const behindNear = projectPoint(flight.latitude, flight.longitude, flight.heading + 180, 0.72 * speedFactor)
  const ahead = projectPoint(flight.latitude, flight.longitude, flight.heading, 0.38 * speedFactor)

  return {
    id: flight.id,
    color: ["rgba(246, 178, 26, 0.04)", "rgba(246, 178, 26, 0.58)", "rgba(255, 255, 255, 0.28)"],
    points: [
      { lat: behindFar.latitude, lng: behindFar.longitude, alt: altitude * 0.92 },
      { lat: behindNear.latitude, lng: behindNear.longitude, alt: altitude * 0.98 },
      { lat: flight.latitude, lng: flight.longitude, alt: altitude },
      { lat: ahead.latitude, lng: ahead.longitude, alt: altitude * 1.02 },
    ],
  }
}

function makeObservedTrackPath(flight: LiveFlight, observedPoints?: TrackPoint[]): TrackPath {
  if (observedPoints && observedPoints.length > 1) {
    return {
      id: flight.id,
      color: ["rgba(246, 178, 26, 0.06)", "rgba(246, 178, 26, 0.62)", "rgba(255, 255, 255, 0.34)"],
      points: observedPoints,
    }
  }

  return makeTrackPath(flight)
}

let aircraftTexture: THREE.CanvasTexture | null = null

function getAircraftTexture() {
  if (aircraftTexture || typeof document === "undefined") return aircraftTexture

  const canvas = document.createElement("canvas")
  canvas.width = 96
  canvas.height = 96
  const ctx = canvas.getContext("2d")
  if (!ctx) return null

  ctx.translate(48, 48)
  ctx.rotate(-Math.PI / 4)
  ctx.fillStyle = "#f6b21a"
  ctx.strokeStyle = "rgba(3, 18, 44, 0.92)"
  ctx.lineWidth = 4
  ctx.lineJoin = "round"
  ctx.beginPath()
  ctx.moveTo(0, -35)
  ctx.lineTo(9, -8)
  ctx.lineTo(36, 3)
  ctx.lineTo(36, 12)
  ctx.lineTo(7, 6)
  ctx.lineTo(7, 23)
  ctx.lineTo(17, 31)
  ctx.lineTo(17, 38)
  ctx.lineTo(0, 30)
  ctx.lineTo(-17, 38)
  ctx.lineTo(-17, 31)
  ctx.lineTo(-7, 23)
  ctx.lineTo(-7, 6)
  ctx.lineTo(-36, 12)
  ctx.lineTo(-36, 3)
  ctx.lineTo(-9, -8)
  ctx.closePath()
  ctx.stroke()
  ctx.fill()

  aircraftTexture = new THREE.CanvasTexture(canvas)
  aircraftTexture.colorSpace = THREE.SRGBColorSpace
  aircraftTexture.needsUpdate = true
  return aircraftTexture
}

function makeAircraftSprite(flight: LiveFlight) {
  const texture = getAircraftTexture()
  const material = new THREE.SpriteMaterial({
    map: texture ?? undefined,
    color: texture ? "#ffffff" : "#f6b21a",
    transparent: true,
    opacity: 0.96,
    depthWrite: false,
    depthTest: true,
    sizeAttenuation: false,
    rotation: THREE.MathUtils.degToRad(-(flight.heading || 0)),
  })
  const sprite = new THREE.Sprite(material)
  sprite.scale.set(0.028, 0.028, 1)
  return sprite
}

function MetricSkeleton() {
  return (
    <div className="rounded-xl border border-white/10 bg-white/8 p-4">
      <div className="h-5 w-5 rounded bg-white/18" />
      <div className="mt-4 h-7 w-16 rounded bg-white/18" />
      <div className="mt-2 h-3 w-20 rounded bg-white/12" />
    </div>
  )
}

function FlightListSkeleton() {
  return (
    <div className="space-y-3">
      {Array.from({ length: 6 }).map((_, index) => (
        <article key={index} className="rounded-xl border border-white/10 bg-white/7 p-4">
          <div className="flex items-center justify-between gap-3">
            <div className="h-4 w-20 rounded bg-white/16" />
            <div className="h-3 w-24 rounded bg-white/12" />
          </div>
          <div className="mt-4 h-3 w-32 rounded bg-white/12" />
          <div className="mt-3 h-3 w-52 max-w-full rounded bg-white/10" />
        </article>
      ))}
    </div>
  )
}

export function LiveFlightGlobe() {
  const mountRef = useRef<HTMLDivElement | null>(null)
  const globeRef = useRef<ThreeGlobe | null>(null)
  const [flights, setFlights] = useState<LiveFlight[]>([])
  const [trackHistories, setTrackHistories] = useState<Record<string, TrackPoint[]>>({})
  const [sourceLabel, setSourceLabel] = useState("Loading public aircraft positions.")
  const [updatedAt, setUpdatedAt] = useState("")
  const [isLoading, setIsLoading] = useState(true)

  const isInitialLoading = isLoading && flights.length === 0
  const visibleFlights = useMemo(() => flights.slice(0, 420), [flights])
  const trackPaths = useMemo(
    () => visibleFlights.slice(0, 90).map((flight) => makeObservedTrackPath(flight, trackHistories[flight.id])),
    [trackHistories, visibleFlights]
  )
  const featuredFlights = flights.slice(0, 10)

  const updateObservedTracks = useCallback((nextFlights: LiveFlight[]) => {
    setTrackHistories((currentHistories) => {
      const nextHistories: Record<string, TrackPoint[]> = {}

      nextFlights.slice(0, 520).forEach((flight) => {
        const nextPoint = trackPointFromFlight(flight)
        const current = currentHistories[flight.id] ?? []
        const lastPoint = current[current.length - 1]
        nextHistories[flight.id] = !lastPoint || !sameTrackPoint(lastPoint, nextPoint)
          ? [...current, nextPoint].slice(-16)
          : current
      })

      return nextHistories
    })
  }, [])

  const loadFlights = useCallback(async () => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/shabest/live-flights")
      const data = (await response.json()) as LiveFlightResponse
      setFlights(data.flights)
      updateObservedTracks(data.flights)
      setSourceLabel(data.sourceLabel)
      setUpdatedAt(data.updatedAt)
    } catch {
      setSourceLabel("Live tracker could not reach the ShaBest operations feed.")
    } finally {
      setIsLoading(false)
    }
  }, [updateObservedTracks])

  useEffect(() => {
    const initialLoad = window.setTimeout(loadFlights, 0)
    const interval = window.setInterval(loadFlights, 60000)
    return () => {
      window.clearTimeout(initialLoad)
      window.clearInterval(interval)
    }
  }, [loadFlights])

  useEffect(() => {
    const mount = mountRef.current
    if (!mount) return

    const scene = new THREE.Scene()
    scene.fog = new THREE.FogExp2("#020917", 0.00135)

    const camera = new THREE.PerspectiveCamera(36, 1, 0.1, 1000)
    camera.position.set(0, 0.1, 305)

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.2))
    renderer.setClearColor(0x000000, 0)
    mount.appendChild(renderer.domElement)

    const globe = new ThreeGlobe({ animateIn: true })
      .showAtmosphere(true)
      .atmosphereColor("#6ec8ff")
      .atmosphereAltitude(0.14)
      .globeMaterial(
        new THREE.MeshBasicMaterial({
          color: "#0a315f",
        })
      )
      .polygonsData(countryFeatures)
      .polygonGeoJsonGeometry((country) => (country as CountryFeature).geometry)
      .polygonAltitude(() => 0.009)
      .polygonCapColor(() => "rgba(77, 155, 134, 0.78)")
      .polygonSideColor(() => "rgba(18, 62, 92, 0.62)")
      .polygonStrokeColor(() => "rgba(218, 242, 255, 0.36)")
      .polygonsTransitionDuration(600)
      .arcsData([])
      .arcsTransitionDuration(700)
      .pathsData([])
      .pathPoints("points")
      .pathPointLat("lat")
      .pathPointLng("lng")
      .pathPointAlt("alt")
      .pathColor((path: object) => (path as TrackPath).color)
      .pathStroke(() => 0.2)
      .pathDashLength(() => 1)
      .pathDashGap(() => 0)
      .pathDashInitialGap(() => 0)
      .pathDashAnimateTime(() => 0)
      .pathTransitionDuration(900)
      .pointsData([])
      .pointLat("latitude")
      .pointLng("longitude")
      .pointAltitude((flight) => altitudeToGlobeAltitude((flight as LiveFlight).altitude) * 0.96)
      .pointRadius(() => 0.105)
      .pointResolution(8)
      .pointColor(() => "rgba(246, 178, 26, 0.92)")
      .pointsTransitionDuration(900)
      .objectsData([])
      .objectLat("latitude")
      .objectLng("longitude")
      .objectAltitude((flight) => altitudeToGlobeAltitude((flight as LiveFlight).altitude))
      .objectFacesSurface(false)
      .objectThreeObject((flight) => makeAircraftSprite(flight as LiveFlight))

    globe.rotation.y = 0.08
    globe.rotation.x = -0.18
    scene.add(globe)
    globeRef.current = globe

    const controls = new OrbitControls(camera, renderer.domElement)
    controls.enableDamping = true
    controls.dampingFactor = 0.07
    controls.enablePan = false
    controls.minDistance = 165
    controls.maxDistance = 470
    controls.rotateSpeed = 0.64
    controls.zoomSpeed = 0.62
    controls.autoRotate = true
    controls.autoRotateSpeed = 0.28
    controls.touches = {
      ONE: THREE.TOUCH.ROTATE,
      TWO: THREE.TOUCH.DOLLY_ROTATE,
    }
    renderer.domElement.style.cursor = "grab"
    renderer.domElement.style.touchAction = "none"
    controls.addEventListener("start", () => {
      controls.autoRotate = false
      renderer.domElement.style.cursor = "grabbing"
    })
    controls.addEventListener("end", () => {
      renderer.domElement.style.cursor = "grab"
    })

    const starsGeometry = new THREE.BufferGeometry()
    const starPositions = new Float32Array(360)
    for (let index = 0; index < starPositions.length; index += 3) {
      starPositions[index] = (Math.random() - 0.5) * 900
      starPositions[index + 1] = (Math.random() - 0.5) * 560
      starPositions[index + 2] = -Math.random() * 420
    }
    starsGeometry.setAttribute("position", new THREE.BufferAttribute(starPositions, 3))
    const stars = new THREE.Points(
      starsGeometry,
      new THREE.PointsMaterial({ color: "#d7ecff", size: 0.85, transparent: true, opacity: 0.34 })
    )
    scene.add(stars)

    scene.add(new THREE.AmbientLight("#9fdcff", 1.12))
    const key = new THREE.DirectionalLight("#fff2cb", 2.8)
    key.position.set(220, 120, 260)
    scene.add(key)
    const rim = new THREE.DirectionalLight("#4bb8ff", 1.8)
    rim.position.set(-220, -80, 180)
    scene.add(rim)

    let frame = 0
    let isVisible = true
    const resize = () => {
      const width = mount.clientWidth
      const height = mount.clientHeight
      camera.aspect = width / Math.max(height, 1)
      camera.updateProjectionMatrix()
      renderer.setSize(width, height)
      globe.rendererSize(new THREE.Vector2(width, height))
    }

    const animate = () => {
      frame = requestAnimationFrame(animate)
      if (!isVisible || document.hidden) return
      controls.update()
      stars.rotation.y -= 0.00026
      renderer.render(scene, camera)
    }

    const resizeObserver = new ResizeObserver(resize)
    const intersectionObserver = new IntersectionObserver(([entry]) => {
      isVisible = Boolean(entry?.isIntersecting)
    }, { threshold: 0.08 })
    resizeObserver.observe(mount)
    intersectionObserver.observe(mount)
    resize()
    animate()

    return () => {
      cancelAnimationFrame(frame)
      resizeObserver.disconnect()
      intersectionObserver.disconnect()
      controls.dispose()
      globe._destructor()
      scene.traverse((object) => {
        const mesh = object as THREE.Mesh
        mesh.geometry?.dispose()
        const material = mesh.material
        if (Array.isArray(material)) material.forEach((item) => item.dispose())
        else material?.dispose()
      })
      renderer.dispose()
      renderer.domElement.remove()
      globeRef.current = null
    }
  }, [])

  useEffect(() => {
    const globe = globeRef.current
    if (!globe) return

    globe.objectsData(visibleFlights as unknown as object[])
    globe.pointsData(visibleFlights as unknown as object[])
    globe.pathsData(trackPaths as unknown as object[])
  }, [trackPaths, visibleFlights])

  return (
    <section className="overflow-hidden rounded-3xl border border-white/10 bg-[#020917] text-white shadow-2xl shadow-slate-950/30">
      <div className="grid min-h-[780px] xl:grid-cols-[minmax(0,1.52fr)_390px]">
        <div className="relative min-h-[560px] overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_38%_34%,rgba(50,154,221,0.2),transparent_34%),radial-gradient(circle_at_76%_66%,rgba(246,178,26,0.08),transparent_28%),linear-gradient(140deg,#071f4b,#020917_64%,#03122c)]" />
          <div ref={mountRef} className="absolute inset-0" aria-hidden="true" />

          <div className="pointer-events-none absolute inset-x-5 top-5 flex flex-wrap items-start justify-between gap-4">
            <div className="tracker-glass rounded-2xl p-4">
              <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-[#f6b21a]">
                <Globe2 className="size-4" />
                Live aircraft layer
              </p>
              {isInitialLoading ? (
                <div className="mt-3 animate-pulse">
                  <div className="h-9 w-44 rounded bg-white/16" />
                  <div className="mt-3 h-4 w-56 rounded bg-white/10" />
                </div>
              ) : (
                <>
                  <h3 className="mt-2 text-4xl font-bold">{flights.length.toLocaleString()} aircraft</h3>
                  <p className="mt-1 text-sm text-white/64">
                    Showing {visibleFlights.length.toLocaleString()} planes and {trackPaths.length.toLocaleString()} live/observed tracks.
                  </p>
                </>
              )}
            </div>

            {isInitialLoading && (
              <div className="tracker-glass rounded-2xl px-4 py-3 text-sm font-semibold text-white/72">
                Loading globe, countries and live positions...
              </div>
            )}
          </div>

          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-44 bg-gradient-to-t from-[#03122c] via-[#03122c]/44 to-transparent" />
        </div>

        <aside className="border-t border-white/10 bg-[#03122c]/72 p-5 backdrop-blur-xl xl:border-l xl:border-t-0">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#f6b21a]">Operations board</p>
              <h2 className="mt-2 text-2xl font-bold">Flights happening now</h2>
            </div>
            <Button onClick={loadFlights} disabled={isLoading} className="h-10 rounded-xl bg-[#f6b21a] px-4 text-[#06255b] hover:bg-[#ffc451] disabled:opacity-70">
              <RefreshCw className={`size-4 ${isLoading ? "animate-spin" : ""}`} />
              Refresh
            </Button>
          </div>

          <div className="mt-5 grid grid-cols-3 gap-3">
            {isInitialLoading ? (
              <>
                <MetricSkeleton />
                <MetricSkeleton />
                <MetricSkeleton />
              </>
            ) : (
              <>
                <div className="tracker-glass rounded-xl p-4">
                  <Satellite className="size-5 text-[#f6b21a]" />
                  <p className="mt-3 text-2xl font-bold">{flights.filter((flight) => flight.altitude > 10000).length.toLocaleString()}</p>
                  <p className="text-xs text-white/58">Cruising</p>
                </div>
                <div className="tracker-glass rounded-xl p-4">
                  <Activity className="size-5 text-[#f6b21a]" />
                  <p className="mt-3 text-2xl font-bold">{flights.filter((flight) => Math.abs(flight.verticalRate) > 2).length.toLocaleString()}</p>
                  <p className="text-xs text-white/58">Changing level</p>
                </div>
                <div className="tracker-glass rounded-xl p-4">
                  <Route className="size-5 text-[#f6b21a]" />
                  <p className="mt-3 text-2xl font-bold">{new Set(flights.map((flight) => flight.country)).size.toLocaleString()}</p>
                  <p className="text-xs text-white/58">Countries</p>
                </div>
              </>
            )}
          </div>

          <p className="mt-5 text-xs leading-5 text-white/56">
            {sourceLabel}
            {updatedAt ? ` Updated ${new Date(updatedAt).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })}.` : ""}
            {" "}Drag or touch the globe to rotate it. Tracks use observed positions while this page is open, then fall back to short heading vectors.
          </p>

          <div className="mt-5 max-h-[430px] overflow-y-auto pr-1">
            {isInitialLoading ? (
              <div className="animate-pulse">
                <FlightListSkeleton />
              </div>
            ) : (
              <div className="space-y-3">
                {featuredFlights.map((flight) => (
                  <article key={flight.id} className="tracker-glass rounded-xl p-4">
                    <div className="flex items-center justify-between gap-3">
                      <strong className="inline-flex items-center gap-2 text-[#f6b21a]">
                        <Plane className="size-4 rotate-45" />
                        {flightAlias(flight)}
                      </strong>
                      <span className="text-xs text-white/50">Real: {flight.callsign}</span>
                    </div>
                    <p className="mt-2 text-sm font-semibold text-white/84">{flight.country}</p>
                    <p className="mt-2 text-xs leading-5 text-white/54">
                      {flight.latitude.toFixed(2)}, {flight.longitude.toFixed(2)} · {Math.round(flight.altitude).toLocaleString()}m · {flight.velocity}m/s · heading {Math.round(flight.heading)} deg
                    </p>
                  </article>
                ))}
              </div>
            )}
          </div>
        </aside>
      </div>
    </section>
  )
}
