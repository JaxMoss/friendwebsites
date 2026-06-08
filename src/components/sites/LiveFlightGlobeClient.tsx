"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import * as THREE from "three"
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
  source: "opensky" | "demo"
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

type TrackArc = {
  id: string
  startLat: number
  startLng: number
  endLat: number
  endLng: number
  altitude: number
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

function makeTrackArc(flight: LiveFlight): TrackArc {
  const start = projectPoint(flight.latitude, flight.longitude, flight.heading + 180, 1.2)
  const end = projectPoint(flight.latitude, flight.longitude, flight.heading, 3.8)

  return {
    id: flight.id,
    startLat: start.latitude,
    startLng: start.longitude,
    endLat: end.latitude,
    endLng: end.longitude,
    altitude: altitudeToGlobeAltitude(flight.altitude),
  }
}

function makeAircraftObject() {
  const group = new THREE.Group()
  const gold = new THREE.MeshStandardMaterial({
    color: "#f6b21a",
    emissive: "#c67800",
    emissiveIntensity: 0.32,
    metalness: 0.35,
    roughness: 0.28,
  })
  const white = new THREE.MeshStandardMaterial({
    color: "#f8fbff",
    emissive: "#8dbdff",
    emissiveIntensity: 0.12,
    metalness: 0.18,
    roughness: 0.34,
  })

  const body = new THREE.Mesh(new THREE.ConeGeometry(0.018, 0.096, 4), white)
  body.rotation.x = Math.PI / 2
  group.add(body)

  const wing = new THREE.Mesh(new THREE.BoxGeometry(0.086, 0.008, 0.014), gold)
  wing.position.z = -0.008
  group.add(wing)

  const tail = new THREE.Mesh(new THREE.BoxGeometry(0.044, 0.007, 0.012), gold)
  tail.position.z = -0.042
  tail.rotation.y = 0.42
  group.add(tail)

  group.scale.setScalar(1.8)
  return group
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
  const [sourceLabel, setSourceLabel] = useState("Loading public aircraft positions.")
  const [updatedAt, setUpdatedAt] = useState("")
  const [isLoading, setIsLoading] = useState(true)

  const isInitialLoading = isLoading && flights.length === 0
  const visibleFlights = useMemo(() => flights.slice(0, 420), [flights])
  const trackArcs = useMemo(() => visibleFlights.slice(0, 180).map(makeTrackArc), [visibleFlights])
  const featuredFlights = flights.slice(0, 10)

  async function loadFlights() {
    setIsLoading(true)
    try {
      const response = await fetch("/api/shabest/live-flights")
      const data = (await response.json()) as LiveFlightResponse
      setFlights(data.flights)
      setSourceLabel(data.sourceLabel)
      setUpdatedAt(data.updatedAt)
    } catch {
      setSourceLabel("Live tracker could not reach the ShaBest operations feed.")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    const initialLoad = window.setTimeout(loadFlights, 0)
    const interval = window.setInterval(loadFlights, 60000)
    return () => {
      window.clearTimeout(initialLoad)
      window.clearInterval(interval)
    }
  }, [])

  useEffect(() => {
    const mount = mountRef.current
    if (!mount) return

    const scene = new THREE.Scene()
    scene.fog = new THREE.FogExp2("#020917", 0.0018)

    const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 1000)
    camera.position.set(0, 0.32, 355)

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.7))
    renderer.setClearColor(0x000000, 0)
    mount.appendChild(renderer.domElement)

    const globe = new ThreeGlobe({ animateIn: true })
      .showAtmosphere(true)
      .atmosphereColor("#75cfff")
      .atmosphereAltitude(0.19)
      .globeMaterial(
        new THREE.MeshStandardMaterial({
          color: "#0b3f78",
          emissive: "#0a3470",
          emissiveIntensity: 0.72,
          metalness: 0.02,
          roughness: 0.7,
        })
      )
      .polygonsData(countryFeatures)
      .polygonGeoJsonGeometry((country) => (country as CountryFeature).geometry)
      .polygonAltitude(() => 0.012)
      .polygonCapColor(() => "rgba(74, 188, 156, 0.86)")
      .polygonSideColor(() => "rgba(25, 84, 110, 0.62)")
      .polygonStrokeColor(() => "rgba(224, 249, 255, 0.64)")
      .polygonsTransitionDuration(600)
      .arcsData([])
      .arcStartLat("startLat")
      .arcStartLng("startLng")
      .arcEndLat("endLat")
      .arcEndLng("endLng")
      .arcAltitude((arc) => (arc as TrackArc).altitude)
      .arcColor(() => ["rgba(246, 178, 26, 0)", "rgba(246, 178, 26, 0.95)", "rgba(126, 207, 255, 0.5)"])
      .arcStroke(() => 0.42)
      .arcDashLength(() => 0.22)
      .arcDashGap(() => 0.78)
      .arcDashInitialGap(() => Math.random())
      .arcDashAnimateTime(() => 2600)
      .arcsTransitionDuration(700)
      .objectsData([])
      .objectLat("latitude")
      .objectLng("longitude")
      .objectAltitude((flight) => altitudeToGlobeAltitude((flight as LiveFlight).altitude))
      .objectFacesSurface(true)
      .objectRotation((flight) => ({ z: THREE.MathUtils.degToRad((flight as LiveFlight).heading - 90) }))
      .objectThreeObject(() => makeAircraftObject())

    globe.rotation.y = 0.08
    globe.rotation.x = -0.18
    scene.add(globe)
    globeRef.current = globe

    const starsGeometry = new THREE.BufferGeometry()
    const starPositions = new Float32Array(900)
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

    scene.add(new THREE.AmbientLight("#9fdcff", 1.35))
    const key = new THREE.DirectionalLight("#fff2cb", 3.8)
    key.position.set(220, 120, 260)
    scene.add(key)
    const rim = new THREE.DirectionalLight("#4bb8ff", 2.2)
    rim.position.set(-220, -80, 180)
    scene.add(rim)

    let frame = 0
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
      globe.rotation.y += 0.00115
      stars.rotation.y -= 0.00026
      renderer.render(scene, camera)
    }

    const resizeObserver = new ResizeObserver(resize)
    resizeObserver.observe(mount)
    resize()
    animate()

    return () => {
      cancelAnimationFrame(frame)
      resizeObserver.disconnect()
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
    globe.arcsData(trackArcs as unknown as object[])
  }, [trackArcs, visibleFlights])

  return (
    <section className="overflow-hidden rounded-3xl border border-white/12 bg-[#03122c] text-white shadow-2xl shadow-slate-950/30">
      <div className="grid min-h-[760px] xl:grid-cols-[minmax(0,1.45fr)_420px]">
        <div className="relative min-h-[560px] overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_38%_34%,rgba(50,154,221,0.34),transparent_36%),radial-gradient(circle_at_76%_62%,rgba(246,178,26,0.16),transparent_30%),linear-gradient(140deg,#061d4f,#020917_62%,#03122c)]" />
          <div ref={mountRef} className="absolute inset-0" aria-hidden="true" />

          <div className="pointer-events-none absolute inset-x-5 top-5 flex flex-wrap items-start justify-between gap-4">
            <div className="rounded-2xl border border-white/12 bg-[#03122c]/66 p-4 shadow-xl shadow-black/18 backdrop-blur-xl">
              <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-[#f6b21a]">
                <Globe2 className="size-4" />
                ShaBest live ops
              </p>
              {isInitialLoading ? (
                <div className="mt-3 animate-pulse">
                  <div className="h-9 w-44 rounded bg-white/16" />
                  <div className="mt-3 h-4 w-56 rounded bg-white/10" />
                </div>
              ) : (
                <>
                  <h3 className="mt-2 text-4xl font-bold">{flights.length.toLocaleString()} aircraft</h3>
                  <p className="mt-1 text-sm text-white/64">Public ADS-B aircraft presented as ShaBest operations.</p>
                </>
              )}
            </div>

            {isInitialLoading && (
              <div className="rounded-2xl border border-white/12 bg-[#03122c]/58 px-4 py-3 text-sm font-semibold text-white/72 shadow-xl shadow-black/18 backdrop-blur-xl">
                Loading globe, countries and live positions...
              </div>
            )}
          </div>

          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-44 bg-gradient-to-t from-[#03122c] via-[#03122c]/44 to-transparent" />
        </div>

        <aside className="border-t border-white/10 bg-[#03122c]/88 p-5 xl:border-l xl:border-t-0">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.14em] text-[#f6b21a]">Operations board</p>
              <h2 className="mt-2 text-3xl font-bold">Flights happening now</h2>
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
                <div className="rounded-xl border border-white/10 bg-white/8 p-4">
                  <Satellite className="size-5 text-[#f6b21a]" />
                  <p className="mt-3 text-2xl font-bold">{flights.filter((flight) => flight.altitude > 10000).length.toLocaleString()}</p>
                  <p className="text-xs text-white/58">Cruising</p>
                </div>
                <div className="rounded-xl border border-white/10 bg-white/8 p-4">
                  <Activity className="size-5 text-[#f6b21a]" />
                  <p className="mt-3 text-2xl font-bold">{flights.filter((flight) => Math.abs(flight.verticalRate) > 2).length.toLocaleString()}</p>
                  <p className="text-xs text-white/58">Changing level</p>
                </div>
                <div className="rounded-xl border border-white/10 bg-white/8 p-4">
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
            {" "}Trails are heading projections from public state data.
          </p>

          <div className="mt-5 max-h-[430px] overflow-y-auto pr-1">
            {isInitialLoading ? (
              <div className="animate-pulse">
                <FlightListSkeleton />
              </div>
            ) : (
              <div className="space-y-3">
                {featuredFlights.map((flight) => (
                  <article key={flight.id} className="rounded-xl border border-white/10 bg-white/7 p-4 shadow-lg shadow-black/8">
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
