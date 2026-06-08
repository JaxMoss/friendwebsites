import { NextResponse } from "next/server"

export const revalidate = 45

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
  onGround: boolean
  lastContact?: number | null
}

type OpenSkyState = [
  string,
  string | null,
  string,
  number | null,
  number,
  number | null,
  number | null,
  number | null,
  boolean,
  number | null,
  number | null,
  number | null,
  number[] | null,
  number | null,
  string | null,
  boolean,
  number,
  number
]

type AirplanesLiveAircraft = {
  hex?: string
  flight?: string
  r?: string
  t?: string
  desc?: string
  alt_baro?: number | "ground"
  alt_geom?: number
  gs?: number
  track?: number
  baro_rate?: number
  geom_rate?: number
  lat?: number
  lon?: number
  seen?: number
  seen_pos?: number
}

type AirplanesLiveResponse = {
  now?: number
  total?: number
  ac?: AirplanesLiveAircraft[]
}

const demoFlights: LiveFlight[] = [
  { id: "demo-jfk-lhr", callsign: "BAW112", country: "United Kingdom", latitude: 52.7, longitude: -31.4, altitude: 11277, velocity: 251, heading: 83, verticalRate: 0, onGround: false },
  { id: "demo-lax-hnd", callsign: "ANA105", country: "Japan", latitude: 38.1, longitude: -158.8, altitude: 11887, velocity: 263, heading: 294, verticalRate: 0, onGround: false },
  { id: "demo-dxb-sin", callsign: "UAE354", country: "United Arab Emirates", latitude: 8.2, longitude: 70.6, altitude: 10972, velocity: 247, heading: 111, verticalRate: 0, onGround: false },
  { id: "demo-cdg-jfk", callsign: "AFR006", country: "France", latitude: 49.9, longitude: -18.3, altitude: 11582, velocity: 259, heading: 276, verticalRate: 0, onGround: false },
  { id: "demo-syd-lax", callsign: "QFA011", country: "Australia", latitude: -24.4, longitude: -170.1, altitude: 12192, velocity: 268, heading: 48, verticalRate: 0, onGround: false },
]

const liveRegions = [
  { label: "North America", lat: 40.7, lon: -74, radius: 250 },
  { label: "US West", lat: 34.05, lon: -118.25, radius: 250 },
  { label: "Western Europe", lat: 51.5, lon: -0.1, radius: 250 },
  { label: "Gulf", lat: 25.2, lon: 55.3, radius: 250 },
  { label: "East Asia", lat: 35.7, lon: 139.7, radius: 250 },
  { label: "Southeast Asia", lat: 1.35, lon: 103.8, radius: 250 },
  { label: "Australia", lat: -33.86, lon: 151.2, radius: 250 },
  { label: "South America", lat: -23.55, lon: -46.63, radius: 250 },
  { label: "Southern Africa", lat: -26.2, lon: 28.0, radius: 250 },
]

function feetToMeters(value?: number | "ground") {
  if (typeof value !== "number") return 0
  return Math.round(value * 0.3048)
}

function knotsToMetersPerSecond(value?: number) {
  return value ? Math.round(value * 0.514444) : 0
}

function feetPerMinuteToMetersPerSecond(value?: number) {
  return value ? Math.round(value * 0.00508) : 0
}

function normalizeOpenSkyState(state: OpenSkyState): LiveFlight | null {
  const [icao24, callsign, country, , lastContact, longitude, latitude, baroAltitude, onGround, velocity, heading, verticalRate, , geoAltitude] = state

  if (typeof latitude !== "number" || typeof longitude !== "number") return null
  if (onGround) return null

  return {
    id: icao24,
    callsign: callsign?.trim() || icao24.toUpperCase(),
    country,
    latitude,
    longitude,
    altitude: Math.round(geoAltitude ?? baroAltitude ?? 0),
    velocity: velocity ? Math.round(velocity) : 0,
    heading: heading ? Math.round(heading) : 0,
    verticalRate: verticalRate ? Math.round(verticalRate) : 0,
    onGround,
    lastContact,
  }
}

function normalizeAirplanesLiveAircraft(aircraft: AirplanesLiveAircraft, region: string): LiveFlight | null {
  if (typeof aircraft.lat !== "number" || typeof aircraft.lon !== "number") return null
  if (aircraft.alt_baro === "ground") return null

  const id = aircraft.hex ?? aircraft.r ?? `${aircraft.lat}:${aircraft.lon}`
  const callsign = aircraft.flight?.trim() || aircraft.r || aircraft.hex?.toUpperCase() || "LIVE"

  return {
    id,
    callsign,
    country: region,
    latitude: aircraft.lat,
    longitude: aircraft.lon,
    altitude: feetToMeters(aircraft.alt_geom ?? aircraft.alt_baro),
    velocity: knotsToMetersPerSecond(aircraft.gs),
    heading: Math.round(aircraft.track ?? 0),
    verticalRate: feetPerMinuteToMetersPerSecond(aircraft.geom_rate ?? aircraft.baro_rate),
    onGround: false,
    lastContact: aircraft.seen,
  }
}

async function fetchJson<T>(url: string, timeoutMs = 8000): Promise<T> {
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), timeoutMs)

  try {
    const response = await fetch(url, {
      next: { revalidate },
      signal: controller.signal,
      headers: {
        "User-Agent": "ShaBest-Airways-Flight-Tracker/1.0",
        Accept: "application/json",
      },
    })

    if (!response.ok) throw new Error(`${url} returned ${response.status}`)
    return (await response.json()) as T
  } finally {
    clearTimeout(timeout)
  }
}

function dedupeAndLimit(flights: LiveFlight[], limit = 900) {
  const deduped = new Map<string, LiveFlight>()

  flights.forEach((flight) => {
    if (!deduped.has(flight.id)) deduped.set(flight.id, flight)
  })

  return [...deduped.values()]
    .filter((flight) => Number.isFinite(flight.latitude) && Number.isFinite(flight.longitude))
    .sort((a, b) => b.altitude - a.altitude)
    .slice(0, limit)
}

async function getAirplanesLiveFlights() {
  const results = await Promise.allSettled(
    liveRegions.map(async (region) => {
      const data = await fetchJson<AirplanesLiveResponse>(`https://api.airplanes.live/v2/point/${region.lat}/${region.lon}/${region.radius}`, 7000)
      return (data.ac ?? [])
        .map((aircraft) => normalizeAirplanesLiveAircraft(aircraft, region.label))
        .filter((flight): flight is LiveFlight => Boolean(flight))
    })
  )

  const flights = dedupeAndLimit(
    results.flatMap((result) => (result.status === "fulfilled" ? result.value : []))
  )

  if (flights.length < 25) throw new Error("Airplanes.live returned too few aircraft")

  return {
    source: "airplanes_live",
    sourceLabel: `Live public ADS-B positions from Airplanes.live across ${liveRegions.length} global regions.`,
    updatedAt: new Date().toISOString(),
    flights,
  }
}

async function getOpenSkyFlights() {
  const data = await fetchJson<{ time?: number; states?: OpenSkyState[] }>("https://opensky-network.org/api/states/all", 8000)
  const flights = dedupeAndLimit(
    (data.states ?? [])
      .map(normalizeOpenSkyState)
      .filter((flight): flight is LiveFlight => Boolean(flight))
  )

  if (flights.length < 25) throw new Error("OpenSky returned too few aircraft")

  return {
    source: "opensky",
    sourceLabel: "Live public ADS-B state vectors from OpenSky Network.",
    updatedAt: data.time ? new Date(data.time * 1000).toISOString() : new Date().toISOString(),
    flights,
  }
}

export async function GET() {
  try {
    return NextResponse.json(await getAirplanesLiveFlights())
  } catch {
    try {
      return NextResponse.json(await getOpenSkyFlights())
    } catch {
      return NextResponse.json({
        source: "demo",
        sourceLabel: "Demo tracker. Live public ADS-B feeds are temporarily unavailable.",
        updatedAt: new Date().toISOString(),
        flights: demoFlights,
      })
    }
  }
}
