import { NextResponse } from "next/server"

export const dynamic = "force-dynamic"

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

const demoFlights = [
  { id: "demo-jfk-lhr", callsign: "BAW112", country: "United Kingdom", latitude: 52.7, longitude: -31.4, altitude: 11277, velocity: 251, heading: 83, verticalRate: 0, onGround: false },
  { id: "demo-lax-hnd", callsign: "ANA105", country: "Japan", latitude: 38.1, longitude: -158.8, altitude: 11887, velocity: 263, heading: 294, verticalRate: 0, onGround: false },
  { id: "demo-dxb-sin", callsign: "UAE354", country: "United Arab Emirates", latitude: 8.2, longitude: 70.6, altitude: 10972, velocity: 247, heading: 111, verticalRate: 0, onGround: false },
  { id: "demo-cdg-jfk", callsign: "AFR006", country: "France", latitude: 49.9, longitude: -18.3, altitude: 11582, velocity: 259, heading: 276, verticalRate: 0, onGround: false },
  { id: "demo-syd-lax", callsign: "QFA011", country: "Australia", latitude: -24.4, longitude: -170.1, altitude: 12192, velocity: 268, heading: 48, verticalRate: 0, onGround: false },
]

function normalizeState(state: OpenSkyState) {
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

export async function GET() {
  try {
    const response = await fetch("https://opensky-network.org/api/states/all", {
      cache: "no-store",
      headers: {
        "User-Agent": "ShaBest-Airways-Flight-Tracker/1.0",
      },
    })

    if (!response.ok) {
      return NextResponse.json({
        source: "demo",
        sourceLabel: `Demo tracker. OpenSky returned ${response.status}.`,
        updatedAt: new Date().toISOString(),
        flights: demoFlights,
      })
    }

    const data = (await response.json()) as { time?: number; states?: OpenSkyState[] }
    const flights = (data.states ?? [])
      .map(normalizeState)
      .filter((flight): flight is NonNullable<ReturnType<typeof normalizeState>> => Boolean(flight))
      .sort((a, b) => b.altitude - a.altitude)
      .slice(0, 900)

    return NextResponse.json({
      source: "opensky",
      sourceLabel: "Live public ADS-B state vectors from OpenSky Network.",
      updatedAt: data.time ? new Date(data.time * 1000).toISOString() : new Date().toISOString(),
      flights,
    })
  } catch {
    return NextResponse.json({
      source: "demo",
      sourceLabel: "Demo tracker. Live OpenSky request failed.",
      updatedAt: new Date().toISOString(),
      flights: demoFlights,
    })
  }
}
