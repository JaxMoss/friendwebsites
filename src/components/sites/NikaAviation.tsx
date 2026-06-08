import Image from "next/image"
import Link from "next/link"
import {
  ArrowRight,
  BadgeCheck,
  CalendarDays,
  CheckCircle2,
  CircleUser,
  Clock3,
  Headphones,
  MapPin,
  Plane,
  ShieldCheck,
  Users,
} from "lucide-react"

import { Button } from "@/components/ui/button"

const navItems = ["Home", "Book", "Manage Booking", "Our Services", "Destinations", "About Us", "Contact Us"]

const bookingFields = [
  { label: "From", value: "Select City", icon: MapPin },
  { label: "To", value: "Select City", icon: MapPin },
  { label: "Depart", value: "Select Date", icon: CalendarDays },
  { label: "Return", value: "Select Date", icon: CalendarDays },
  { label: "Passengers", value: "1 Passenger", icon: CircleUser },
]

const benefits = [
  {
    icon: ShieldCheck,
    title: "Safe & Secure",
    copy: "Your safety is our top priority.",
  },
  {
    icon: BadgeCheck,
    title: "Comfort & Style",
    copy: "Modern cabins designed for your comfort.",
  },
  {
    icon: Clock3,
    title: "On-time, Every Time",
    copy: "Punctuality you can count on.",
  },
  {
    icon: Headphones,
    title: "24/7 Customer Care",
    copy: "We're here to help, anytime, anywhere.",
  },
]

const destinations = [
  { city: "Dubai", price: "PKR 45,000", gradient: "from-sky-300 via-blue-600 to-[#062b64]" },
  { city: "London", price: "PKR 65,000", gradient: "from-stone-300 via-slate-600 to-[#09255c]" },
  { city: "Istanbul", price: "PKR 55,000", gradient: "from-orange-200 via-sky-500 to-[#09255c]" },
  { city: "Kuala Lumpur", price: "PKR 50,000", gradient: "from-cyan-200 via-blue-700 to-[#061d4f]" },
  { city: "Toronto", price: "PKR 70,000", gradient: "from-blue-200 via-sky-700 to-[#09255c]" },
]

const services = ["Baggage Information", "In-Flight Services", "Travel Assistance", "ShaBest Rewards", "Corporate Travel"]

function Logo() {
  return (
    <div className="flex items-center gap-3 text-white">
      <span className="flex size-11 items-center justify-center rounded-md bg-[#f6a915] text-[#06255b]">
        <Plane className="size-6 -rotate-12" />
      </span>
      <span className="leading-none">
        <span className="block text-3xl font-bold tracking-normal">
          Sha<span className="text-[#f6a915]">Best</span>
        </span>
        <span className="mt-1 block text-[0.8rem] font-semibold uppercase tracking-[0.48em] text-white/90">
          Airways
        </span>
      </span>
    </div>
  )
}

export function NikaAviation() {
  return (
    <main className="min-h-screen bg-white text-[#061d4f]">
      <section className="relative overflow-hidden bg-[#062d68] text-white">
        <Image
          src="/assets/nika-aircraft-hero.png"
          alt="A commercial aircraft flying above clouds"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(3,29,76,0.98)_0%,rgba(3,39,92,0.87)_38%,rgba(3,39,92,0.24)_78%)]" />
        <div className="absolute inset-x-0 top-0 z-20">
          <div className="mx-auto flex h-24 max-w-7xl items-center justify-between px-5 sm:px-8">
            <Link href="/" aria-label="ShaBest Airways home">
              <Logo />
            </Link>
            <nav className="hidden items-center gap-7 text-xs font-semibold uppercase text-white lg:flex">
              {navItems.map((item) => (
                <a
                  key={item}
                  href={`#${item.toLowerCase().replaceAll(" ", "-")}`}
                  className={item === "Home" ? "border-b-2 border-[#f6a915] pb-3 text-[#f6a915]" : ""}
                >
                  {item}
                </a>
              ))}
            </nav>
            <Button className="h-11 rounded-md bg-[#f6a915] px-5 text-[#06255b] hover:bg-[#ffc04d]">
              Book Now
              <Plane className="size-4 rotate-45" />
            </Button>
          </div>
        </div>

        <div className="relative z-10 mx-auto max-w-7xl px-5 pb-8 pt-32 sm:px-8 lg:pb-0">
          <div className="max-w-[640px] pb-12 pt-4 lg:pb-10 lg:pt-16">
            <h1 className="text-balance text-5xl font-bold leading-[1.04] tracking-normal sm:text-7xl">
              Your Journey.
              <br />
              Our Priority.
              <br />
              <span className="text-[#f6a915]">Fly ShaBest.</span>
            </h1>
            <p className="mt-7 max-w-md text-lg leading-8 text-white/88">
              Experience comfort, safety and world-class service with ShaBest
              Airways.
            </p>
          </div>

          <div className="relative z-20 overflow-hidden rounded-lg border border-white/20 bg-[#06255b]/80 shadow-2xl shadow-black/20 backdrop-blur-md">
            <div className="grid border-b border-white/15 text-sm font-bold uppercase sm:grid-cols-3">
              <button className="flex h-16 items-center gap-3 border-b-2 border-[#f6a915] px-6 text-[#f6a915] sm:border-b-0 sm:border-r sm:border-[#ffffff1f]">
                <Plane className="size-5 -rotate-12" />
                Book a Flight
              </button>
              <button className="flex h-16 items-center gap-3 px-6 text-white sm:border-r sm:border-[#ffffff1f]">
                <CalendarDays className="size-5" />
                Manage Booking
              </button>
              <button className="flex h-16 items-center gap-3 px-6 text-white">
                <CheckCircle2 className="size-5" />
                Check-in
              </button>
            </div>
            <div className="grid gap-0 p-5 lg:grid-cols-[1fr_auto]">
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
                {bookingFields.map((field) => (
                  <div key={field.label} className="border-white/15 lg:border-r lg:px-4 first:lg:pl-0">
                    <p className="text-[0.68rem] font-semibold uppercase text-white/68">{field.label}</p>
                    <div className="mt-3 flex items-center gap-3 border-b border-white/20 pb-3">
                      <field.icon className="size-5 text-white/85" />
                      <span className="text-sm text-white">{field.value}</span>
                    </div>
                  </div>
                ))}
              </div>
              <Button className="mt-5 h-14 rounded-md bg-[#f6a915] px-7 text-[#06255b] hover:bg-[#ffc04d] lg:ml-5 lg:mt-0">
                Search Flights
              </Button>
            </div>
          </div>
        </div>

        <div id="our-services" className="relative z-10 mt-8 border-t border-white/15 bg-[#052b65]/92">
          <div className="mx-auto grid max-w-7xl gap-0 px-5 py-7 sm:grid-cols-2 sm:px-8 lg:grid-cols-4">
            {benefits.map((benefit) => (
              <article key={benefit.title} className="flex gap-4 border-white/15 py-3 lg:border-r lg:px-7 last:border-r-0">
                <benefit.icon className="size-12 shrink-0 text-[#f6a915]" />
                <div>
                  <h2 className="text-sm font-bold uppercase">{benefit.title}</h2>
                  <p className="mt-2 text-sm leading-6 text-white/80">{benefit.copy}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="about-us" className="mx-auto grid max-w-7xl gap-10 px-5 py-16 sm:px-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
        <div>
          <p className="text-sm font-bold uppercase text-[#f6a915]">About Us</p>
          <h2 className="mt-4 max-w-lg text-4xl font-bold leading-tight">
            Where Every Journey <span className="text-[#f6a915]">Takes You Further</span>
          </h2>
          <p className="mt-6 max-w-md text-[15px] leading-7 text-slate-700">
            ShaBest Airways is committed to connecting people, places and
            possibilities. With a modern fleet, exceptional service and a passion
            for excellence, we make every journey memorable.
          </p>
          <Button className="mt-8 h-11 rounded-md bg-[#06255b] px-5 text-white hover:bg-[#0b397e]">
            Learn More About Us
            <ArrowRight className="size-4" />
          </Button>
        </div>
        <div className="relative">
          <div className="relative aspect-[16/9] overflow-hidden rounded-lg">
            <Image
              src="/assets/shabest-cabin.png"
              alt="Premium ShaBest Airways style cabin interior"
              fill
              sizes="(min-width: 1024px) 640px, 100vw"
              className="object-cover"
            />
          </div>
          <div className="absolute -bottom-6 left-8 flex w-40 flex-col items-center rounded-lg bg-[#f6a915] p-5 text-center text-[#06255b] shadow-xl shadow-black/20">
            <Users className="size-9" />
            <strong className="mt-2 text-3xl">500K+</strong>
            <span className="text-xs font-bold">Happy Passengers</span>
          </div>
        </div>
      </section>

      <section className="bg-[#052b65] text-white">
        <div className="mx-auto grid max-w-7xl items-center gap-8 px-5 py-8 sm:px-8 lg:grid-cols-[180px_1fr_320px]">
          <div className="flex items-end gap-3">
            <div className="h-24 w-16 rounded-lg bg-[#06255b] shadow-xl shadow-black/30" />
            <div className="h-20 w-12 rounded-lg bg-[#f6a915] shadow-xl shadow-black/30" />
          </div>
          <div>
            <h2 className="text-3xl font-bold">Fly More, Save More!</h2>
            <p className="mt-2 text-white/82">Exclusive deals and offers on your favorite destinations.</p>
            <Button className="mt-5 h-11 rounded-md bg-[#f6a915] px-5 text-[#06255b] hover:bg-[#ffc04d]">
              Explore Offers
              <ArrowRight className="size-4" />
            </Button>
          </div>
          <div className="hidden items-center justify-end gap-8 text-[#f6a915] lg:flex">
            <span className="text-6xl leading-none">♡</span>
            <Plane className="size-16 rotate-45" />
          </div>
        </div>
      </section>

      <section id="destinations" className="mx-auto max-w-7xl px-5 py-16 sm:px-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-bold uppercase text-[#f6a915]">Top Destinations</p>
            <h2 className="mt-4 text-4xl font-bold">
              Explore the World with <span className="text-[#f6a915]">ShaBest Airways</span>
            </h2>
          </div>
          <Button className="h-11 rounded-md bg-[#06255b] px-5 text-white hover:bg-[#0b397e]">
            View All Destinations
            <ArrowRight className="size-4" />
          </Button>
        </div>

        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
          {destinations.map((destination) => (
            <article
              key={destination.city}
              className={`relative aspect-[1.45] overflow-hidden rounded-lg bg-gradient-to-br ${destination.gradient}`}
            >
              <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_25%,rgba(3,29,76,0.86)_100%)]" />
              <div className="absolute inset-x-0 bottom-0 p-4 text-white">
                <h3 className="text-xl font-bold">{destination.city}</h3>
                <p className="text-sm">
                  From <span className="font-bold text-[#f6a915]">{destination.price}</span>
                </p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <footer id="contact-us" className="bg-[#052b65] text-white">
        <div className="mx-auto grid max-w-7xl gap-10 px-5 py-12 sm:px-8 md:grid-cols-4">
          <div>
            <Logo />
            <p className="mt-5 max-w-xs text-sm leading-6 text-white/70">
              Connecting you to the world with care, comfort and commitment.
            </p>
          </div>
          <div>
            <h2 className="text-sm font-bold uppercase text-[#f6a915]">Quick Links</h2>
            <ul className="mt-4 space-y-2 text-sm text-white/78">
              {navItems.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="text-sm font-bold uppercase text-[#f6a915]">Our Services</h2>
            <ul className="mt-4 space-y-2 text-sm text-white/78">
              {services.map((service) => (
                <li key={service}>{service}</li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="text-sm font-bold uppercase text-[#f6a915]">Contact Us</h2>
            <ul className="mt-4 space-y-3 text-sm text-white/78">
              <li>123 Airways Avenue, Lahore, Pakistan</li>
              <li>+92 300 1234567</li>
              <li>info@shabestairways.com</li>
              <li>www.shabestairways.com</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-white/10 py-5 text-center text-xs text-white/50">
          © 2024 ShaBest Airways. All Rights Reserved.
        </div>
      </footer>
    </main>
  )
}
