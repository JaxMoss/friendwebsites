"use client"

import { useState, type FormEvent, type ReactNode } from "react"
import Image from "next/image"
import Link from "next/link"
import {
  ArrowRight,
  BadgeCheck,
  BriefcaseBusiness,
  CalendarDays,
  CheckCircle2,
  CircleUser,
  Clock3,
  Coffee,
  CreditCard,
  Globe2,
  Headphones,
  HelpCircle,
  Info,
  Luggage,
  MapPin,
  Plane,
  Search,
  ShieldCheck,
  Star,
  Ticket,
  Users,
  WalletCards,
  X,
} from "lucide-react"
import type { LucideIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { AircraftScrollExperience } from "@/components/sites/AircraftScrollExperience"
import { Glass } from "@/components/sites/Glass"

const venmoUrl = "https://venmo.com/Nika_Shabestari?txn=pay&note=Pilot%20education%20fund"

const airports = [
  "New York (JFK)",
  "Los Angeles (LAX)",
  "Miami (MIA)",
  "London (LHR)",
  "Dubai (DXB)",
  "Toronto (YYZ)",
  "Istanbul (IST)",
  "Lahore (LHE)",
]

const navItems = [
  { key: "home", label: "Home" },
  { key: "book", label: "Book" },
  { key: "manage", label: "Manage" },
  { key: "status", label: "Status" },
  { key: "tracker", label: "Tracker" },
  { key: "destinations", label: "Destinations" },
  { key: "help", label: "Help" },
] as const

const bookingTabs = [
  { key: "book", label: "Book", icon: Plane },
  { key: "manage", label: "Manage", icon: BriefcaseBusiness },
  { key: "checkin", label: "Check-in", icon: CheckCircle2 },
  { key: "status", label: "Status", icon: Clock3 },
] as const

const fallbackFlights = [
  { code: "SB 108", time: "08:40", arrival: "16:00", duration: "7h 20m", stops: "Nonstop", cabin: "Main", price: "$186", aircraft: "A320neo", route: "New York to Dubai", operatedBy: "ShaBest training schedule" },
  { code: "SB 226", time: "13:15", arrival: "20:10", duration: "6h 55m", stops: "Nonstop", cabin: "Plus", price: "$214", aircraft: "A321", route: "New York to Dubai", operatedBy: "ShaBest training schedule" },
  { code: "SB 777", time: "20:05", arrival: "06:30 +1", duration: "Overnight", stops: "1 stop", cabin: "Captain", price: "$301", aircraft: "Training Jet", route: "New York to Dubai", operatedBy: "ShaBest training schedule" },
]

const benefits = [
  { icon: ShieldCheck, title: "Safety", copy: "Training-route alerts, travel requirements and operational notices in one place." },
  { icon: BadgeCheck, title: "Cabin", copy: "Fare families, seat preferences and baggage options before checkout." },
  { icon: Clock3, title: "Status", copy: "Flight lookup, live public aircraft tracking and schedule-style cards." },
  { icon: Headphones, title: "Support", copy: "Manage trips, receipts, credits, accessibility and policy paths." },
]

const destinations = [
  { city: "Dubai", airport: "Dubai (DXB)", price: "PKR 45,000", gradient: "from-sky-300 via-blue-600 to-[#062b64]" },
  { city: "London", airport: "London (LHR)", price: "PKR 65,000", gradient: "from-stone-300 via-slate-600 to-[#09255c]" },
  { city: "Istanbul", airport: "Istanbul (IST)", price: "PKR 55,000", gradient: "from-orange-200 via-sky-500 to-[#09255c]" },
  { city: "Toronto", airport: "Toronto (YYZ)", price: "PKR 70,000", gradient: "from-blue-200 via-sky-700 to-[#09255c]" },
]

const serviceCards = [
  { title: "Bags", copy: "Carry-on limits, checked bags and delayed-bag support.", icon: Luggage },
  { title: "Seats", copy: "Compare cabins and choose comfort preferences.", icon: Ticket },
  { title: "Payments", copy: "Cards, credits and the pilot education fund.", icon: WalletCards },
  { title: "Refunds", copy: "Unused value, cancellation rules and exceptions.", icon: CreditCard },
]

const helpTopics = [
  "Change or cancel a trip",
  "Baggage allowance",
  "Airport check-in times",
  "Accessibility assistance",
  "Receipts and travel credits",
  "Pilot education contributions",
]

type PageKey = (typeof navItems)[number]["key"] | "checkin" | "rewards"
type BookingTab = (typeof bookingTabs)[number]["key"]
type Notice = "book" | "manage" | "checkin" | "status" | "offers" | null
type BookingState = {
  from: string
  to: string
  depart: string
  returnDate: string
  passengers: string
  tripType: string
  farePreference: string
  redeemMiles: boolean
  refundableOnly: boolean
  nearbyAirports: boolean
}

type FlightOption = {
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

type FlightSearchResponse = {
  source: "google_flights" | "amadeus" | "demo"
  sourceLabel: string
  updatedAt: string
  flights: FlightOption[]
}

function Logo() {
  return (
    <div className="flex items-center gap-3 text-white">
      <span className="flex size-11 items-center justify-center rounded-lg bg-[#f6a915] text-[#06255b] shadow-lg shadow-[#f6a915]/20">
        <Plane className="size-6 -rotate-12" />
      </span>
      <span className="leading-none">
        <span className="block text-3xl font-bold tracking-normal">
          Sha<span className="text-[#f6a915]">Best</span>
        </span>
        <span className="mt-1 block text-[0.78rem] font-semibold uppercase tracking-[0.46em] text-white/86">Airways</span>
      </span>
    </div>
  )
}

function Panel({ children, className = "", id }: { children: ReactNode; className?: string; id?: string }) {
  return (
    <div id={id} className={`rounded-2xl border border-[#d8e0ee] bg-white shadow-[0_22px_70px_rgba(6,29,79,0.12)] ${className}`}>
      {children}
    </div>
  )
}

function DarkPanel({ children, className = "", id }: { children: ReactNode; className?: string; id?: string }) {
  return (
    <div id={id} className={`rounded-2xl border border-white/14 bg-[#061d4f]/92 text-white shadow-[0_26px_80px_rgba(0,0,0,0.28)] ${className}`}>
      {children}
    </div>
  )
}

function SectionHeader({ eyebrow, title, copy }: { eyebrow: string; title: string; copy?: string }) {
  return (
    <div>
      <p className="text-sm font-bold uppercase tracking-[0.12em] text-[#b97900]">{eyebrow}</p>
      <h2 className="mt-3 max-w-3xl text-balance text-4xl font-bold leading-tight text-[#061d4f]">{title}</h2>
      {copy && <p className="mt-4 max-w-2xl text-[15px] leading-7 text-slate-600">{copy}</p>}
    </div>
  )
}

function FieldShell({ label, icon: Icon, children }: { label: string; icon: LucideIcon; children: ReactNode }) {
  return (
    <label className="rounded-lg border border-white/12 bg-white/10 px-3 py-2.5">
      <span className="text-[0.62rem] font-bold uppercase tracking-[0.08em] text-white/56">{label}</span>
      <span className="mt-2 flex items-center gap-2">
        <Icon className="size-4 shrink-0 text-[#f6a915]" />
        {children}
      </span>
    </label>
  )
}

function TextInput({ placeholder, icon: Icon }: { placeholder: string; icon: LucideIcon }) {
  return (
    <label className="flex h-11 items-center gap-3 rounded-lg border border-white/12 bg-white/10 px-4 text-white">
      <Icon className="size-4 text-[#f6a915]" />
      <input required placeholder={placeholder} className="min-w-0 flex-1 bg-transparent text-sm placeholder:text-white/48 outline-none" />
    </label>
  )
}

export function NikaAviation() {
  const [activePage, setActivePage] = useState<PageKey>("home")
  const [activeTab, setActiveTab] = useState<BookingTab>("book")
  const [booking, setBooking] = useState<BookingState>({
    from: "New York (JFK)",
    to: "Dubai (DXB)",
    depart: "2026-07-18",
    returnDate: "2026-07-25",
    passengers: "1 Passenger",
    tripType: "Round trip",
    farePreference: "Main Cabin",
    redeemMiles: false,
    refundableOnly: false,
    nearbyAirports: false,
  })
  const [searchRan, setSearchRan] = useState(false)
  const [isSearching, setIsSearching] = useState(false)
  const [flightSource, setFlightSource] = useState("Demo schedule")
  const [flightUpdatedAt, setFlightUpdatedAt] = useState("")
  const [selectedFlights, setSelectedFlights] = useState<FlightOption[]>(fallbackFlights)
  const [notice, setNotice] = useState<Notice>(null)

  function updateBooking(field: keyof BookingState, value: string | boolean) {
    setBooking((current) => ({ ...current, [field]: value }))
  }

  function openPage(page: PageKey, tab?: BookingTab) {
    setActivePage(page)
    if (tab) setActiveTab(tab)
    requestAnimationFrame(() => document.getElementById("site-app")?.scrollIntoView({ behavior: "smooth", block: "start" }))
  }

  function openTrackerPage() {
    window.location.assign("/tracker")
  }

  function openNavItem(page: PageKey) {
    if (page === "tracker") {
      openTrackerPage()
      return
    }

    openPage(page, page === "book" ? "book" : page === "manage" ? "manage" : page === "status" ? "status" : undefined)
  }

  async function searchFlights() {
    setIsSearching(true)
    setSearchRan(true)
    setActivePage("book")
    setActiveTab("book")
    try {
      const params = new URLSearchParams({
        from: booking.from,
        to: booking.to,
        depart: booking.depart,
        returnDate: booking.returnDate,
        passengers: booking.passengers,
        tripType: booking.tripType,
      })
      const response = await fetch(`/api/shabest/flights?${params.toString()}`)
      const data = (await response.json()) as FlightSearchResponse
      setSelectedFlights(data.flights)
      setFlightSource(data.sourceLabel)
      setFlightUpdatedAt(data.updatedAt)
    } catch {
      setSelectedFlights(
        fallbackFlights.map((flight) => ({
          ...flight,
          route: `${booking.from.split(" ")[0]} to ${booking.to.split(" ")[0]}`,
        }))
      )
      setFlightSource("ShaBest sample schedule. Live flight search failed in the browser.")
      setFlightUpdatedAt(new Date().toISOString())
    } finally {
      setIsSearching(false)
      requestAnimationFrame(() => document.getElementById("flight-results")?.scrollIntoView({ behavior: "smooth", block: "nearest" }))
    }
  }

  function handleServiceSubmit(event: FormEvent<HTMLFormElement>, type: Exclude<Notice, null>) {
    event.preventDefault()
    setNotice(type)
  }

  function renderBookingPanel(variant: "hero" | "app" = "app") {
    const isHero = variant === "hero"
    const bookingPanel = (
      <>
        <div role="tablist" aria-label="Travel tools" className="grid border-b border-white/8 text-xs font-bold uppercase sm:grid-cols-4">
          {bookingTabs.map((tab) => (
            <button
              key={tab.key}
              type="button"
              role="tab"
              aria-selected={activeTab === tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex min-h-12 items-center justify-center gap-2 px-4 text-center transition sm:justify-start sm:text-left sm:border-r sm:border-white/8 ${
                activeTab === tab.key ? "bg-white/[0.09] text-[#f6a915]" : "text-white/78 hover:bg-white/[0.07] hover:text-white"
              }`}
            >
              <tab.icon className="size-4" />
              {tab.label}
            </button>
          ))}
        </div>

        <div className="min-h-[208px] p-4">
          {activeTab === "book" && (
            <div className="grid gap-4">
              <div className="flex flex-wrap items-center gap-2">
                {["Round trip", "One way", "Multi-city"].map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => updateBooking("tripType", item)}
                    className={`rounded-full border px-3 py-1.5 text-[0.68rem] font-bold uppercase transition ${
                      booking.tripType === item ? "border-[#f6a915] bg-[#f6a915] text-[#06255b]" : "border-white/16 text-white/70 hover:border-white/30 hover:text-white"
                    }`}
                  >
                    {item}
                  </button>
                ))}
                {[
                  ["redeemMiles", "Redeem ShaMiles"],
                  ["refundableOnly", "Refundable only"],
                  ["nearbyAirports", "Nearby airports"],
                ].map(([field, label]) => (
                  <label key={field} className="inline-flex h-8 items-center gap-2 rounded-full border border-white/16 px-3 text-[0.68rem] font-bold uppercase text-white/70">
                    <input
                      type="checkbox"
                      checked={Boolean(booking[field as keyof BookingState])}
                      onChange={(event) => updateBooking(field as keyof BookingState, event.target.checked)}
                      className="accent-[#f6a915]"
                    />
                    {label}
                  </label>
                ))}
              </div>

              <div className="grid gap-3 md:grid-cols-3 xl:grid-cols-6">
                <FieldShell label="From" icon={MapPin}>
                  <select value={booking.from} onChange={(event) => updateBooking("from", event.target.value)} className="w-full bg-transparent text-sm text-white outline-none">
                    {airports.map((airport) => <option key={airport} className="text-[#061d4f]">{airport}</option>)}
                  </select>
                </FieldShell>
                <FieldShell label="To" icon={MapPin}>
                  <select value={booking.to} onChange={(event) => updateBooking("to", event.target.value)} className="w-full bg-transparent text-sm text-white outline-none">
                    {airports.map((airport) => <option key={airport} className="text-[#061d4f]">{airport}</option>)}
                  </select>
                </FieldShell>
                <FieldShell label="Depart" icon={CalendarDays}>
                  <input type="date" value={booking.depart} onChange={(event) => updateBooking("depart", event.target.value)} className="w-full bg-transparent text-sm text-white outline-none [color-scheme:dark]" />
                </FieldShell>
                <FieldShell label="Return" icon={CalendarDays}>
                  <input type="date" value={booking.returnDate} onChange={(event) => updateBooking("returnDate", event.target.value)} className="w-full bg-transparent text-sm text-white outline-none [color-scheme:dark]" />
                </FieldShell>
                <FieldShell label="Travelers" icon={CircleUser}>
                  <select value={booking.passengers} onChange={(event) => updateBooking("passengers", event.target.value)} className="w-full bg-transparent text-sm text-white outline-none">
                    {["1 Passenger", "2 Passengers", "3 Passengers", "4 Passengers", "5 Passengers", "6 Passengers", "7 Passengers", "8 Passengers", "9 Passengers"].map((count) => <option key={count} className="text-[#061d4f]">{count}</option>)}
                  </select>
                </FieldShell>
                <FieldShell label="Fare" icon={WalletCards}>
                  <select value={booking.farePreference} onChange={(event) => updateBooking("farePreference", event.target.value)} className="w-full bg-transparent text-sm text-white outline-none">
                    {["Basic", "Main Cabin", "ShaBest Plus", "Business", "Captain First"].map((fare) => <option key={fare} className="text-[#061d4f]">{fare}</option>)}
                  </select>
                </FieldShell>
              </div>

              <div className="flex flex-col gap-3 border-t border-white/8 pt-3 lg:flex-row lg:items-center lg:justify-between">
                <div className="flex flex-wrap gap-4 text-xs font-semibold text-white/60">
                  <button type="button" onClick={() => setNotice("offers")} className="hover:text-white">Advanced / multi-city</button>
                  <button type="button" onClick={() => openPage("help")} className="hover:text-white">Bag fees</button>
                  <button type="button" onClick={() => setNotice("offers")} className="hover:text-white">Certificates & credits</button>
                </div>
                <Button onClick={searchFlights} disabled={isSearching} className="h-11 rounded-xl bg-[#f6a915] px-7 text-[#06255b] shadow-lg shadow-[#f6a915]/15 hover:bg-[#ffc04d] disabled:opacity-70">
                  <Search className="size-4" />
                  {isSearching ? "Searching" : "Search flights"}
                </Button>
              </div>
            </div>
          )}

          {activeTab === "manage" && (
            <form className="flex min-h-[176px] flex-col justify-between gap-4" onSubmit={(event) => handleServiceSubmit(event, "manage")}>
              <div>
                <p className="text-sm font-bold uppercase tracking-[0.12em] text-[#f6a915]">Find your trip</p>
                <p className="mt-2 max-w-2xl text-sm leading-6 text-white/62">Use a confirmation code or ticket number to manage seats, bags, receipts and travel credits.</p>
              </div>
              <div className="grid gap-3 lg:grid-cols-[1fr_1fr_auto]">
                <TextInput placeholder="Last name" icon={CircleUser} />
                <TextInput placeholder="Confirmation or ticket number" icon={Ticket} />
                <Button type="submit" className="h-12 rounded-xl bg-[#f6a915] px-7 text-[#06255b] hover:bg-[#ffc04d]">Find trip</Button>
              </div>
              <p className="text-xs leading-5 text-white/58">Confirmation codes are six characters. This lookup can lead to check-in, seat changes, bag purchases and receipts.</p>
            </form>
          )}

          {activeTab === "checkin" && (
            <form className="flex min-h-[176px] flex-col justify-between gap-4" onSubmit={(event) => handleServiceSubmit(event, "checkin")}>
              <div>
                <p className="text-sm font-bold uppercase tracking-[0.12em] text-[#f6a915]">Check in online</p>
                <p className="mt-2 max-w-2xl text-sm leading-6 text-white/62">Check-in opens 24 hours before departure. Boarding pass access appears after document review.</p>
              </div>
              <div className="grid gap-3 lg:grid-cols-[1fr_1fr_auto]">
                <TextInput placeholder="Passenger last name" icon={CircleUser} />
                <TextInput placeholder="Confirmation or ticket number" icon={Ticket} />
                <Button type="submit" className="h-12 rounded-xl bg-[#f6a915] px-7 text-[#06255b] hover:bg-[#ffc04d]">Check in</Button>
              </div>
              <p className="text-xs leading-5 text-white/58">Arrive 2 hours before domestic flights and 3 hours before international travel.</p>
            </form>
          )}

          {activeTab === "status" && (
            <form className="flex min-h-[176px] flex-col justify-between gap-4" onSubmit={(event) => handleServiceSubmit(event, "status")}>
              <div>
                <p className="text-sm font-bold uppercase tracking-[0.12em] text-[#f6a915]">Flight status</p>
                <p className="mt-2 max-w-2xl text-sm leading-6 text-white/62">Search a ShaBest display flight number or open the global tracker for live public aircraft positions.</p>
              </div>
              <div className="grid gap-3 lg:grid-cols-[1fr_1fr_auto]">
                <TextInput placeholder="Flight number, ex. SB108" icon={Plane} />
                <TextInput placeholder="Travel date" icon={CalendarDays} />
                <Button type="submit" className="h-12 rounded-xl bg-[#f6a915] px-7 text-[#06255b] hover:bg-[#ffc04d]">View status</Button>
              </div>
              <button type="button" onClick={openTrackerPage} className="w-fit text-xs font-bold uppercase tracking-[0.12em] text-white/58 hover:text-white">Open global live tracker</button>
            </form>
          )}
        </div>
      </>
    )

    if (!isHero) {
      return (
        <div id="book" className="overflow-hidden rounded-2xl border border-[#163a72] bg-[#071f4b] text-white shadow-[0_24px_70px_rgba(6,29,79,0.2)]">
          {bookingPanel}
        </div>
      )
    }

    return (
      <Glass
        id="hero-book"
        className="rounded-[18px] bg-transparent text-white shadow-[0_26px_90px_rgba(3,18,44,0.34)]"
        preset="plaque"
        radius={18}
        blur={1.5}
        saturate={1.42}
        scale={34}
        bezel={14}
        curve={2.8}
        thickness={0.3}
        dispersion={0.055}
        tint={0.055}
        border={0.18}
        glow={0.12}
        edge={0.38}
        light={305}
        refract
      >
        {bookingPanel}
      </Glass>
    )
  }

  function renderFlightResults() {
    if (!searchRan) return null

    if (isSearching) {
      return (
        <Panel id="flight-results" className="mt-6 overflow-hidden">
          <div className="flex flex-col gap-2 border-b border-slate-200 bg-[#f8fbff] p-5 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.12em] text-[#b97900]">Searching flights</p>
              <h3 className="mt-1 text-2xl font-bold text-[#061d4f]">{booking.from} to {booking.to}</h3>
            </div>
            <div className="text-sm font-semibold text-slate-600 md:text-right">
              <p>{booking.depart} · {booking.passengers} · {booking.tripType} · {booking.farePreference}</p>
              <p className="mt-1 text-xs font-medium text-slate-500">Checking available schedules and fare displays.</p>
            </div>
          </div>
          <div className="animate-pulse divide-y divide-slate-200">
            {Array.from({ length: 3 }).map((_, index) => (
              <article key={index} className="grid gap-4 p-5 lg:grid-cols-[1.2fr_1fr_180px] lg:items-center">
                <div className="flex items-center gap-5">
                  <div className="size-14 rounded-xl bg-slate-200" />
                  <div className="min-w-0 flex-1">
                    <div className="h-4 w-32 rounded bg-slate-200" />
                    <div className="mt-4 h-8 w-64 max-w-full rounded bg-slate-200" />
                    <div className="mt-3 h-4 w-72 max-w-full rounded bg-slate-100" />
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {Array.from({ length: 6 }).map((__, amenityIndex) => (
                    <div key={amenityIndex} className="h-10 rounded-lg bg-slate-100" />
                  ))}
                </div>
                <div className="rounded-xl border border-slate-200 bg-white p-4">
                  <div className="ml-auto h-3 w-12 rounded bg-slate-100" />
                  <div className="mt-4 ml-auto h-9 w-24 rounded bg-slate-200" />
                  <div className="mt-4 h-10 w-full rounded-xl bg-slate-100" />
                </div>
              </article>
            ))}
          </div>
        </Panel>
      )
    }

    return (
      <Panel id="flight-results" className="mt-6 overflow-hidden">
        <div className="flex flex-col gap-2 border-b border-slate-200 bg-[#f8fbff] p-5 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.12em] text-[#b97900]">Choose departing flight</p>
            <h3 className="mt-1 text-2xl font-bold text-[#061d4f]">{booking.from} to {booking.to}</h3>
          </div>
          <div className="text-sm font-semibold text-slate-600 md:text-right">
            <p>{booking.depart} · {booking.passengers} · {booking.tripType} · {booking.farePreference}</p>
            <p className="mt-1 text-xs font-medium text-slate-500">
              {flightSource}
              {flightUpdatedAt ? ` Updated ${new Date(flightUpdatedAt).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })}` : ""}
            </p>
          </div>
        </div>
        <div className="divide-y divide-slate-200">
          {selectedFlights.map((flight) => (
            <article key={flight.code} className="grid gap-4 p-5 lg:grid-cols-[1.2fr_1fr_180px] lg:items-center">
              <div className="flex items-center gap-5">
                <div className="flex size-14 items-center justify-center rounded-xl bg-[#061d4f] text-[#f6a915]">
                  <Plane className="size-7 rotate-45" />
                </div>
                <div>
                  <p className="text-sm font-bold text-[#b97900]">{flight.code} · {flight.aircraft}</p>
                  <p className="mt-1 text-3xl font-bold text-[#061d4f]">{flight.time} <span className="text-base text-slate-500">to</span> {flight.arrival}</p>
                  <p className="mt-1 text-sm text-slate-600">{flight.route} · {flight.duration} · {flight.stops}</p>
                  {flight.operatedBy && <p className="mt-1 text-xs font-semibold text-slate-500">Real schedule source: {flight.operatedBy}. Displayed as ShaBest service.</p>}
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2 text-sm">
                {["Seat map", "Wi-Fi", booking.refundableOnly ? "Refundable" : "Travel credit", booking.redeemMiles ? "ShaMiles fare" : "Miles earned", booking.nearbyAirports ? "Nearby airport" : "Standard airport", "Bag options"].map((amenity) => (
                  <span key={amenity} className="rounded-lg bg-slate-100 px-3 py-2 text-center font-semibold text-slate-700">{amenity}</span>
                ))}
              </div>
              <div className="rounded-xl border border-slate-200 bg-white p-4 text-right">
                <p className="text-xs font-bold uppercase text-slate-500">From</p>
                <p className="text-3xl font-bold text-[#061d4f]">{flight.price}</p>
                <p className="text-sm text-slate-500">{flight.cabin}</p>
                <Button onClick={() => setNotice("book")} className="mt-3 h-10 w-full rounded-xl bg-[#f6a915] text-[#06255b] hover:bg-[#ffc04d]">Continue</Button>
              </div>
            </article>
          ))}
        </div>
      </Panel>
    )
  }

  function renderPageContent() {
    if (activePage === "home") {
      return (
        <div className="space-y-14">
          <section className="grid gap-5 lg:grid-cols-4">
            {benefits.map((benefit) => (
              <Panel key={benefit.title} className="p-5">
                <benefit.icon className="size-9 text-[#b97900]" />
                <h3 className="mt-4 text-lg font-bold text-[#061d4f]">{benefit.title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">{benefit.copy}</p>
              </Panel>
            ))}
          </section>

          <section className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
            <div>
              <SectionHeader
                eyebrow="About ShaBest"
                title="A premium passenger portal for an unofficial airline."
                copy="ShaBest now behaves like a full airline product: flight search, trip tools, live tracking, destinations, rewards, help and policy surfaces."
              />
              <Button onClick={() => openPage("book", "book")} className="mt-8 h-11 rounded-xl bg-[#061d4f] px-5 text-white hover:bg-[#0b397e]">
                Start booking
                <ArrowRight className="size-4" />
              </Button>
            </div>
            <div className="relative">
              <div className="relative aspect-[16/9] overflow-hidden rounded-2xl border border-slate-200 shadow-2xl shadow-[#061d4f]/12">
                <Image src="/assets/shabest-cabin.png" alt="Premium ShaBest Airways cabin interior" fill sizes="(min-width: 1024px) 640px, 100vw" className="object-cover" />
              </div>
              <div className="absolute -bottom-6 left-8 flex w-40 flex-col items-center rounded-2xl bg-[#f6a915] p-5 text-center text-[#06255b] shadow-xl shadow-[#061d4f]/16">
                <Users className="size-9" />
                <strong className="mt-2 text-3xl">500K+</strong>
                <span className="text-xs font-bold">Happy passengers</span>
              </div>
            </div>
          </section>
        </div>
      )
    }

    if (activePage === "book") {
      return (
        <section>
          <SectionHeader eyebrow="Book travel" title="Search flights, compare fares and choose a cabin." copy="A realistic airline flow starts with route, dates, travelers and fare families before payment." />
          <div className="mt-7">{renderBookingPanel()}</div>
          {renderFlightResults()}
        </section>
      )
    }

    if (activePage === "manage") {
      return (
        <section className="grid gap-8 lg:grid-cols-[1fr_360px]">
          <div>
            <SectionHeader eyebrow="Manage trips" title="Find your itinerary." copy="Retrieve a trip, review seats, bags, receipts and schedule changes." />
            <div className="mt-7">{renderBookingPanel()}</div>
          </div>
          <Panel className="p-6">
            <h3 className="text-xl font-bold text-[#061d4f]">Trip tools</h3>
            {["Add bags", "Change seats", "Request receipt", "Apply travel credit"].map((tool) => (
              <button key={tool} onClick={() => setNotice("manage")} className="mt-4 flex w-full items-center justify-between rounded-xl bg-slate-100 px-4 py-3 text-left text-sm font-bold text-slate-700 hover:bg-slate-200">
                {tool}
                <ArrowRight className="size-4" />
              </button>
            ))}
          </Panel>
        </section>
      )
    }

    if (activePage === "checkin") {
      return (
        <section className="grid gap-8 lg:grid-cols-[1fr_360px]">
          <div>
            <SectionHeader eyebrow="Check-in" title="Prepare for departure." copy="Enter a ticket number or confirmation code, then review documents and seat details." />
            <div className="mt-7">{renderBookingPanel()}</div>
          </div>
          <DarkPanel className="p-6">
            <Info className="size-8 text-[#f6a915]" />
            <h3 className="mt-4 text-xl font-bold">Airport reminders</h3>
            <p className="mt-3 text-sm leading-6 text-white/72">Arrive 2 hours before domestic flights and 3 hours before international travel. Online check-in is simulated.</p>
          </DarkPanel>
        </section>
      )
    }

    if (activePage === "status") {
      return (
        <section>
          <SectionHeader eyebrow="Flight status" title="Track ShaBest operations." copy="Search by flight number or route, then view gate, schedule and operational notes." />
          <div className="mt-7">{renderBookingPanel()}</div>
          <div className="mt-8 grid gap-4 lg:grid-cols-3">
            {["SB 108 · On time · Gate A6", "SB 226 · Boarding soon · Gate B2", "SB 777 · Training hold · Captain review"].map((row) => (
              <Panel key={row} className="p-5">
                <p className="text-sm font-bold uppercase text-[#b97900]">Today</p>
                <h3 className="mt-2 text-xl font-bold text-[#061d4f]">{row}</h3>
                <p className="mt-3 text-sm leading-6 text-slate-600">Terminal, gate and timing details are updated in the ShaBest operations center.</p>
              </Panel>
            ))}
          </div>
          <Button onClick={openTrackerPage} className="mt-8 h-11 rounded-xl bg-[#061d4f] px-5 text-white hover:bg-[#0b397e]">
            Open live global tracker
            <Globe2 className="size-4" />
          </Button>
        </section>
      )
    }

    if (activePage === "tracker") {
      return (
        <section>
          <SectionHeader
            eyebrow="Live tracker"
            title="Open the full ShaBest live tracker."
            copy="The tracker now has its own full page with a larger globe, live aircraft positions, heading trails and an operations board."
          />
          <Button onClick={openTrackerPage} className="mt-8 h-11 rounded-xl bg-[#061d4f] px-5 text-white hover:bg-[#0b397e]">
            Launch tracker
            <Globe2 className="size-4" />
          </Button>
        </section>
      )
    }

    if (activePage === "destinations") {
      return (
        <section>
          <SectionHeader eyebrow="Destinations" title="Explore the ShaBest route map." copy="Destination cards behave like real airline entry points into flight search." />
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {destinations.map((destination) => (
              <button
                key={destination.city}
                type="button"
                onClick={() => {
                  updateBooking("to", destination.airport)
                  openPage("book", "book")
                  setSearchRan(true)
                }}
                className={`relative aspect-[1.35] overflow-hidden rounded-2xl bg-gradient-to-br ${destination.gradient} text-left shadow-xl shadow-[#061d4f]/12`}
              >
                <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_20%,rgba(3,29,76,0.9)_100%)]" />
                <div className="absolute inset-x-0 bottom-0 p-5 text-white">
                  <h3 className="text-2xl font-bold">{destination.city}</h3>
                  <p className="mt-1 text-sm">From <span className="font-bold text-[#f6a915]">{destination.price}</span></p>
                </div>
              </button>
            ))}
          </div>
        </section>
      )
    }

    if (activePage === "rewards") {
      return (
        <section className="grid gap-8 lg:grid-cols-[1fr_380px]">
          <div>
            <SectionHeader eyebrow="ShaMiles" title="Earn toward upgrades, priority boarding and pilot coffee." copy="A loyalty page makes the airline feel complete: account status, earning rules, benefits and partner-style offers." />
            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              {["0 miles", "Silver someday", "2x coffee credits"].map((metric) => (
                <Panel key={metric} className="p-5">
                  <Star className="size-7 text-[#b97900]" />
                  <p className="mt-4 text-2xl font-bold text-[#061d4f]">{metric}</p>
                </Panel>
              ))}
            </div>
          </div>
          <DarkPanel className="p-6">
            <h3 className="text-2xl font-bold">Join ShaMiles</h3>
            <p className="mt-3 text-sm leading-6 text-white/72">Create a simulated profile, save preferences and support Nika&apos;s pilot education fund at checkout.</p>
            <Button onClick={() => setNotice("offers")} className="mt-6 h-11 rounded-xl bg-[#f6a915] text-[#06255b] hover:bg-[#ffc04d]">Join now</Button>
          </DarkPanel>
        </section>
      )
    }

    return (
      <section>
        <SectionHeader eyebrow="Help center" title="Support for every part of the trip." copy="Airline sites feel real when help, legal, travel info and contact paths exist beyond the booking form." />
        <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {helpTopics.map((topic) => (
            <button key={topic} onClick={() => setNotice("offers")} className="rounded-2xl border border-[#d8e0ee] bg-white p-5 text-left font-bold text-[#061d4f] shadow-[0_18px_54px_rgba(6,29,79,0.08)] hover:bg-[#f8fbff]">
              <span className="flex items-center justify-between gap-4">
                {topic}
                <HelpCircle className="size-5 shrink-0 text-[#b97900]" />
              </span>
            </button>
          ))}
        </div>
      </section>
    )
  }

  return (
    <main id="main-content" className="min-h-screen bg-[#f4f7fb] text-[#061d4f]">
      <a href="#site-app" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-md focus:bg-white focus:px-4 focus:py-3 focus:text-sm focus:font-bold focus:text-[#061d4f]">
        Skip to main content
      </a>

      <section id="home" className="relative overflow-hidden bg-[#062d68] text-white">
        <Image src="/assets/nika-aircraft-hero.png" alt="A commercial aircraft flying above clouds" fill priority sizes="100vw" className="object-cover" />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(3,18,44,0.96)_0%,rgba(6,37,91,0.78)_42%,rgba(3,39,92,0.16)_82%),linear-gradient(180deg,rgba(3,18,44,0.08)_0%,rgba(3,18,44,0.18)_52%,rgba(3,18,44,0.72)_100%)]" />

        <header className="relative z-20 border-b border-white/10">
          <div className="mx-auto flex h-10 max-w-7xl items-center justify-between px-5 text-xs font-semibold text-white/70 sm:px-8">
            <div className="flex items-center gap-4">
              <span className="inline-flex items-center gap-2"><Globe2 className="size-3.5" /> United States</span>
              <button onClick={() => openPage("help")} className="hover:text-white">Help</button>
              <button onClick={() => openPage("status", "status")} className="hover:text-white">Flight status</button>
              <button onClick={openTrackerPage} className="hover:text-white">Live tracker</button>
            </div>
            <div className="hidden items-center gap-4 sm:flex">
              <button onClick={() => openPage("rewards")} className="inline-flex items-center gap-2 hover:text-white"><Star className="size-3.5" /> ShaMiles</button>
              <button onClick={() => setNotice("offers")} className="inline-flex items-center gap-2 hover:text-white"><CircleUser className="size-3.5" /> Sign in</button>
            </div>
          </div>

          <div className="mx-auto flex min-h-24 max-w-7xl items-center justify-between gap-5 px-5 py-4 sm:px-8">
            <Link href="/" aria-label="ShaBest Airways home"><Logo /></Link>
            <nav className="hidden flex-wrap items-center justify-end gap-5 text-xs font-bold uppercase text-white lg:flex">
              {navItems.map((item) => (
                <button
                  key={item.key}
                  type="button"
                  onClick={() => openNavItem(item.key)}
                  className={activePage === item.key ? "border-b-2 border-[#f6a915] pb-2 text-[#f6a915]" : "pb-2 text-white/82 hover:text-white"}
                >
                  {item.label}
                </button>
              ))}
            </nav>
            <Button onClick={() => openPage("book", "book")} className="h-11 shrink-0 rounded-xl bg-[#f6a915] px-5 text-[#06255b] hover:bg-[#ffc04d]">
              Book Now
              <Plane className="size-4 rotate-45" />
            </Button>
          </div>
        </header>

        <div className="relative z-10 mx-auto max-w-7xl px-5 pb-12 pt-12 sm:px-8 lg:pb-16 lg:pt-14">
          <div className="max-w-3xl">
            <h1 className="text-balance text-5xl font-bold leading-[1.04] tracking-normal sm:text-7xl">
              Your Journey.
              <br />
              Our Priority.
              <br />
              <span className="text-[#f6a915]">Fly ShaBest.</span>
            </h1>
            <p className="mt-7 max-w-md text-lg leading-8 text-white/86">
              Search flights, manage trips, check in and track the official unofficial airline of Captain Nika.
            </p>
          </div>
          <div className="mt-10 max-w-[1180px]">
            {renderBookingPanel("hero")}
          </div>
        </div>
      </section>

      <AircraftScrollExperience />

      <section id="site-app" className="mx-auto max-w-7xl px-5 py-16 sm:px-8">
        <div className="mb-8 flex gap-2 overflow-x-auto rounded-2xl border border-[#d8e0ee] bg-white p-2 shadow-[0_18px_54px_rgba(6,29,79,0.08)]">
          {navItems.map((item) => (
            <button
              key={item.key}
              type="button"
              onClick={() => openNavItem(item.key)}
              className={`shrink-0 rounded-xl px-4 py-3 text-sm font-bold ${
                activePage === item.key ? "bg-[#061d4f] text-white" : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
        {renderPageContent()}
      </section>

      <section className="bg-[#061d4f] text-white">
        <div className="mx-auto grid max-w-7xl gap-4 px-5 py-12 sm:px-8 md:grid-cols-4">
          {serviceCards.map((service) => (
            <button key={service.title} type="button" onClick={() => setNotice("offers")} className="flex items-start gap-4 rounded-2xl border border-white/10 bg-white/6 p-5 text-left transition hover:bg-white/10">
              <service.icon className="size-7 shrink-0 text-[#f6a915]" />
              <span>
                <span className="block text-sm font-bold uppercase text-white">{service.title}</span>
                <span className="mt-2 block text-sm leading-6 text-white/68">{service.copy}</span>
              </span>
            </button>
          ))}
        </div>
      </section>

      <footer id="contact-us" className="bg-[#03122c] text-white">
        <div id="site-footer" className="mx-auto grid max-w-7xl gap-10 px-5 py-12 sm:px-8 md:grid-cols-5">
          <div>
            <Logo />
            <p className="mt-5 max-w-xs text-sm leading-6 text-white/70">Connecting you to the world with care, comfort and commitment.</p>
          </div>
          <div>
            <h2 className="text-sm font-bold uppercase text-[#f6a915]">Travel</h2>
            <ul className="mt-4 space-y-2 text-sm text-white/78">
              {navItems.slice(1, 6).map((item) => (
                <li key={item.key}><button onClick={() => openNavItem(item.key)} className="hover:text-white">{item.label}</button></li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="text-sm font-bold uppercase text-[#f6a915]">Services</h2>
            <ul className="mt-4 space-y-2 text-sm text-white/78">
              {serviceCards.map((service) => (
                <li key={service.title}><button type="button" onClick={() => setNotice("offers")} className="hover:text-white">{service.title}</button></li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="text-sm font-bold uppercase text-[#f6a915]">Contact</h2>
            <ul className="mt-4 space-y-3 text-sm text-white/78">
              <li>123 Airways Avenue, Lahore, Pakistan</li>
              <li>+92 300 1234567</li>
              <li>support@shabestairways.com</li>
              <li>www.shabestairways.com</li>
            </ul>
          </div>
          <div>
            <h2 className="text-sm font-bold uppercase text-[#f6a915]">Policies</h2>
            <ul className="mt-4 space-y-2 text-sm text-white/78">
              {["Customer service plan", "Conditions of carriage", "Tarmac delay plan", "Privacy", "Web accessibility", "External link notice"].map((item) => (
                <li key={item}><button type="button" onClick={() => setNotice("offers")} className="hover:text-white">{item}</button></li>
              ))}
            </ul>
          </div>
        </div>
        <div className="border-t border-white/10 py-5 text-center text-xs text-white/50">2026 ShaBest Airways. All rights reserved.</div>
      </footer>

      {notice && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-[#03122c]/78 px-4 backdrop-blur-sm" role="dialog" aria-modal="true">
          <Panel className="w-full max-w-lg p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-bold uppercase text-[#b97900]">{notice === "book" ? "Flight no longer available" : "ShaBest service notice"}</p>
                <h2 className="mt-2 text-3xl font-bold leading-tight text-[#061d4f]">{notice === "book" ? "This fare just departed." : "This service is currently handled by Captain Nika."}</h2>
              </div>
              <button type="button" onClick={() => setNotice(null)} className="rounded-md p-2 text-slate-500 hover:bg-slate-100" aria-label="Close notice">
                <X className="size-5" />
              </button>
            </div>
            <p className="mt-5 leading-7 text-slate-700">
              ShaBest flights are no longer available for purchase today. You can still buy the pilot, Nika, a coffee or contribute to his pilot education fund.
            </p>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <a href={venmoUrl} target="_blank" rel="noreferrer" className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-[#f6a915] px-5 text-sm font-bold text-[#06255b] hover:bg-[#ffc04d]">
                <Coffee className="size-5" />
                Pay @Nika_Shabestari
              </a>
              <Button onClick={() => setNotice(null)} variant="outline" className="h-12 rounded-xl border-[#06255b] text-[#06255b]">Keep Browsing</Button>
            </div>
            <p className="mt-4 text-xs leading-5 text-slate-500">Venmo opens in a new tab with the note &quot;Pilot education fund.&quot; Payment is handled by Venmo.</p>
          </Panel>
        </div>
      )}
    </main>
  )
}
