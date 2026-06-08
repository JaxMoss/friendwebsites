import { NextRequest, NextResponse } from "next/server"

export const dynamic = "force-dynamic"

type SearchApiLeg = {
  airline?: string
  flight_number?: string
  airplane?: string
  duration?: number
  departure_airport?: {
    id?: string
    name?: string
    time?: string
  }
  arrival_airport?: {
    id?: string
    name?: string
    time?: string
  }
}

type SearchApiFlight = {
  flights?: SearchApiLeg[]
  price?: number | string
  total_duration?: number
  type?: string
}

type AmadeusFlightOffer = {
  itineraries?: Array<{
    duration?: string
    segments?: Array<{
      carrierCode?: string
      number?: string
      aircraft?: { code?: string }
      duration?: string
      departure?: { iataCode?: string; at?: string }
      arrival?: { iataCode?: string; at?: string }
    }>
  }>
  price?: {
    total?: string
    currency?: string
  }
  travelerPricings?: Array<{
    fareDetailsBySegment?: Array<{
      cabin?: string
    }>
  }>
}

type AmadeusResponse = {
  data?: AmadeusFlightOffer[]
  dictionaries?: {
    carriers?: Record<string, string>
    aircraft?: Record<string, string>
  }
}

type NormalizedFlight = {
  code: string
  time: string
  arrival: string
  duration: string
  stops: string
  cabin: string
  price: string
  aircraft: string
  route: string
  operatedBy?: string
}

const fallbackFlights = [
  {
    code: "SB 108",
    time: "08:40",
    arrival: "16:00",
    duration: "7h 20m",
    stops: "Nonstop",
    cabin: "Main Cabin",
    price: "$186",
    aircraft: "A320neo",
    operatedBy: "ShaBest training schedule",
  },
  {
    code: "SB 226",
    time: "13:15",
    arrival: "20:10",
    duration: "6h 55m",
    stops: "Nonstop",
    cabin: "ShaBest Plus",
    price: "$214",
    aircraft: "A321",
    operatedBy: "ShaBest training schedule",
  },
  {
    code: "SB 777",
    time: "20:05",
    arrival: "06:30 +1",
    duration: "Overnight",
    stops: "1 stop",
    cabin: "Captain's Pick",
    price: "$301",
    aircraft: "Training Jet",
    operatedBy: "ShaBest training schedule",
  },
]

function getIata(value: string | null) {
  return value?.match(/\(([A-Z]{3})\)/)?.[1] ?? value?.match(/[A-Z]{3}/)?.[0] ?? ""
}

function cityName(value: string) {
  return value.split(" (")[0]
}

function formatTime(value?: string) {
  if (!value) return "--"
  const time = value.match(/\b\d{1,2}:\d{2}\b/)?.[0]
  return time ?? value
}

function formatIsoTime(value?: string) {
  if (!value) return "--"
  return new Intl.DateTimeFormat("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(new Date(value))
}

function formatMinutes(minutes?: number) {
  if (!minutes) return "Schedule pending"
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60
  return mins ? `${hours}h ${mins}m` : `${hours}h`
}

function parseIsoDuration(value?: string) {
  if (!value) return undefined
  const match = value.match(/^PT(?:(\d+)H)?(?:(\d+)M)?$/)
  if (!match) return undefined
  return Number(match[1] ?? 0) * 60 + Number(match[2] ?? 0)
}

function formatPrice(value?: number | string, currency = "USD") {
  if (typeof value === "number") return `$${value.toLocaleString("en-US")}`
  if (typeof value === "string" && value.length > 0) {
    if (currency === "USD") return value.startsWith("$") ? value : `$${Number(value).toLocaleString("en-US")}`
    return `${currency} ${Number(value).toLocaleString("en-US")}`
  }
  return "Fare pending"
}

function normalizeCabin(value?: string) {
  if (!value) return "Main Cabin"
  return value
    .toLowerCase()
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ")
}

function shabestCodeFrom(realFlightNumber: string | undefined, index: number) {
  return `SB ${realFlightNumber?.replace(/\D/g, "").slice(-3) || `${108 + index}`}`
}

function normalizeSearchApiFlight(item: SearchApiFlight, index: number, from: string, to: string): NormalizedFlight {
  const legs = item.flights ?? []
  const first = legs[0] ?? {}
  const last = legs[legs.length - 1] ?? first
  const realFlightNumber = first.flight_number?.replace(/\s+/g, " ") ?? `${100 + index}`

  return {
    code: shabestCodeFrom(realFlightNumber, index),
    time: formatTime(first.departure_airport?.time),
    arrival: formatTime(last.arrival_airport?.time),
    duration: formatMinutes(item.total_duration ?? legs.reduce((total, leg) => total + (leg.duration ?? 0), 0)),
    stops: legs.length <= 1 ? "Nonstop" : `${legs.length - 1} stop${legs.length > 2 ? "s" : ""}`,
    cabin: item.type ?? "Main Cabin",
    price: formatPrice(item.price),
    aircraft: first.airplane ?? "Aircraft pending",
    route: `${from} to ${to}`,
    operatedBy: `${first.airline ?? "Partner airline"} ${realFlightNumber}`,
  }
}

function normalizeAmadeusFlight(item: AmadeusFlightOffer, index: number, from: string, to: string, response: AmadeusResponse): NormalizedFlight {
  const itinerary = item.itineraries?.[0]
  const segments = itinerary?.segments ?? []
  const first = segments[0] ?? {}
  const last = segments[segments.length - 1] ?? first
  const carrierName = first.carrierCode ? response.dictionaries?.carriers?.[first.carrierCode] ?? first.carrierCode : "Partner airline"
  const aircraftName = first.aircraft?.code ? response.dictionaries?.aircraft?.[first.aircraft.code] ?? first.aircraft.code : "Aircraft pending"
  const realFlightNumber = `${first.carrierCode ?? ""}${first.number ?? `${100 + index}`}`
  const itineraryMinutes = parseIsoDuration(itinerary?.duration)
  const segmentMinutes = segments.reduce((total, segment) => total + (parseIsoDuration(segment.duration) ?? 0), 0)
  const cabin = item.travelerPricings?.[0]?.fareDetailsBySegment?.[0]?.cabin

  return {
    code: shabestCodeFrom(realFlightNumber, index),
    time: formatIsoTime(first.departure?.at),
    arrival: formatIsoTime(last.arrival?.at),
    duration: formatMinutes(itineraryMinutes ?? segmentMinutes),
    stops: segments.length <= 1 ? "Nonstop" : `${segments.length - 1} stop${segments.length > 2 ? "s" : ""}`,
    cabin: normalizeCabin(cabin),
    price: formatPrice(item.price?.total, item.price?.currency),
    aircraft: aircraftName,
    route: `${from} to ${to}`,
    operatedBy: `${carrierName} ${realFlightNumber}`,
  }
}

function demoResponse(from: string, to: string, reason = "ShaBest sample schedule. Live fare provider is not configured.") {
  return NextResponse.json({
    source: "demo",
    sourceLabel: reason,
    updatedAt: new Date().toISOString(),
    flights: fallbackFlights.map((flight) => ({
      ...flight,
      route: `${cityName(from)} to ${cityName(to)}`,
    })),
  })
}

async function getSearchApiFlights(params: {
  from: string
  to: string
  depart: string
  returnDate: string
  passengers: number
  tripType: string
}) {
  const apiKey = process.env.SEARCHAPI_API_KEY
  if (!apiKey) return null

  const searchParams = new URLSearchParams({
    engine: "google_flights",
    api_key: apiKey,
    departure_id: getIata(params.from),
    arrival_id: getIata(params.to),
    outbound_date: params.depart,
    adults: String(Math.max(params.passengers, 1)),
    currency: "USD",
    hl: "en",
    gl: "us",
  })

  if (params.tripType !== "One way") {
    searchParams.set("return_date", params.returnDate)
  }

  const response = await fetch(`https://www.searchapi.io/api/v1/search?${searchParams.toString()}`, {
    cache: "no-store",
  })

  if (!response.ok) throw new Error(`SearchAPI returned ${response.status}`)

  const data = await response.json()
  const rawFlights = [...(data.best_flights ?? []), ...(data.other_flights ?? [])].slice(0, 8)
  if (rawFlights.length === 0) throw new Error("SearchAPI returned no flights")

  return {
    source: "google_flights",
    sourceLabel: "Live Google Flights data via SearchAPI, presented as ShaBest service.",
    updatedAt: new Date().toISOString(),
    flights: rawFlights.map((item: SearchApiFlight, index: number) => normalizeSearchApiFlight(item, index, params.from, params.to)),
  }
}

async function getAmadeusAccessToken() {
  const clientId = process.env.AMADEUS_API_KEY
  const clientSecret = process.env.AMADEUS_API_SECRET
  if (!clientId || !clientSecret) return null

  const baseUrl = process.env.AMADEUS_ENV === "production" ? "https://api.amadeus.com" : "https://test.api.amadeus.com"
  const response = await fetch(`${baseUrl}/v1/security/oauth2/token`, {
    method: "POST",
    cache: "no-store",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      grant_type: "client_credentials",
      client_id: clientId,
      client_secret: clientSecret,
    }),
  })

  if (!response.ok) throw new Error(`Amadeus token request returned ${response.status}`)
  const data = (await response.json()) as { access_token?: string }
  if (!data.access_token) throw new Error("Amadeus did not return an access token")

  return { baseUrl, accessToken: data.access_token }
}

async function getAmadeusFlights(params: {
  from: string
  to: string
  depart: string
  returnDate: string
  passengers: number
  tripType: string
}) {
  const credentials = await getAmadeusAccessToken()
  if (!credentials) return null

  const searchParams = new URLSearchParams({
    originLocationCode: getIata(params.from),
    destinationLocationCode: getIata(params.to),
    departureDate: params.depart,
    adults: String(Math.max(params.passengers, 1)),
    currencyCode: "USD",
    max: "8",
  })

  if (params.tripType !== "One way") {
    searchParams.set("returnDate", params.returnDate)
  }

  const response = await fetch(`${credentials.baseUrl}/v2/shopping/flight-offers?${searchParams.toString()}`, {
    cache: "no-store",
    headers: {
      Authorization: `Bearer ${credentials.accessToken}`,
    },
  })

  if (!response.ok) throw new Error(`Amadeus returned ${response.status}`)

  const data = (await response.json()) as AmadeusResponse
  const rawFlights = (data.data ?? []).slice(0, 8)
  if (rawFlights.length === 0) throw new Error("Amadeus returned no flights")

  return {
    source: "amadeus",
    sourceLabel: "Live flight-offer data via Amadeus, presented as ShaBest service.",
    updatedAt: new Date().toISOString(),
    flights: rawFlights.map((item, index) => normalizeAmadeusFlight(item, index, params.from, params.to, data)),
  }
}

export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams
  const query = {
    from: params.get("from") ?? "New York (JFK)",
    to: params.get("to") ?? "Dubai (DXB)",
    depart: params.get("depart") ?? "2026-07-18",
    returnDate: params.get("returnDate") ?? "2026-07-25",
    passengers: Number(params.get("passengers")?.match(/\d+/)?.[0] ?? "1"),
    tripType: params.get("tripType") ?? "Round trip",
  }

  try {
    const searchApiFlights = await getSearchApiFlights(query)
    if (searchApiFlights) return NextResponse.json(searchApiFlights)
  } catch {
    // Fall through to Amadeus or the polished sample schedule.
  }

  try {
    const amadeusFlights = await getAmadeusFlights(query)
    if (amadeusFlights) return NextResponse.json(amadeusFlights)
  } catch {
    // Fall through to the polished sample schedule.
  }

  return demoResponse(query.from, query.to)
}
