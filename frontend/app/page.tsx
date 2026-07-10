import {
  ArrowRight,
  BadgeCheck,
  CalendarDays,
  CreditCard,
  MapPin,
  Search,
  ShieldCheck,
  Sparkles,
  Star,
  Wrench,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { AuthActions } from "@/components/auth/auth-actions";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  categories,
  featuredListings,
  trustStats,
} from "@/lib/marketplace-data";

const steps = [
  {
    title: "Find the right gear",
    body: "Search verified local equipment by location, category, price, rating, and availability.",
    icon: Search,
  },
  {
    title: "Book protected dates",
    body: "Reserve the rental window, add delivery when available, and pay securely online.",
    icon: CalendarDays,
  },
  {
    title: "Earn or get it done",
    body: "Owners approve bookings, renters pick up or receive delivery, and both sides review.",
    icon: CreditCard,
  },
];

const testimonials = [
  {
    quote:
      "GearShare paid for my trailer registration in two months. The approval flow keeps me in control of every booking.",
    author: "Nora P.",
    role: "Owner, Portland",
  },
  {
    quote:
      "I rented a projector and sound kit for one evening without buying anything I would only use once.",
    author: "Malik S.",
    role: "Renter, Atlanta",
  },
];

export default function HomePage() {
  return (
    <main className="overflow-hidden">
      <header className="container flex min-h-20 items-center justify-between py-4">
        <Link href="/" className="flex items-center gap-2 text-lg font-bold">
          <span className="flex h-9 w-9 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <Wrench className="h-5 w-5" aria-hidden="true" />
          </span>
          GearShare
        </Link>
        <nav className="hidden items-center gap-7 text-sm font-medium text-muted-foreground md:flex">
          <a className="hover:text-foreground" href="#categories">
            Categories
          </a>
          <a className="hover:text-foreground" href="#how-it-works">
            How it works
          </a>
          <a className="hover:text-foreground" href="#trust">
            Trust
          </a>
        </nav>
        <AuthActions />
      </header>

      <section className="container grid items-center gap-10 pb-16 pt-8 lg:grid-cols-[1.02fr_0.98fr] lg:pb-24 lg:pt-16">
        <div className="max-w-3xl">
          <Badge className="mb-5 gap-2">
            <Sparkles className="h-3.5 w-3.5 text-accent" aria-hidden="true" />
            Equipment rentals from trusted locals
          </Badge>
          <h1 className="max-w-4xl text-balance text-5xl font-bold leading-[1.03] md:text-6xl lg:text-7xl">
            Rent the gear you need. Earn from the gear you own.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-muted-foreground">
            GearShare connects renters with verified owners for tools, cameras,
            generators, trailers, event equipment, outdoor kits, and more.
          </p>

          <form
            action="/equipment"
            className="mt-8 grid gap-3 rounded-lg border border-border bg-card p-3 shadow-soft md:grid-cols-[1fr_0.72fr_auto]"
          >
            <label className="relative">
              <span className="sr-only">Search equipment</span>
              <Search
                className="pointer-events-none absolute left-3 top-3.5 h-4 w-4 text-muted-foreground"
                aria-hidden="true"
              />
              <Input
                name="q"
                className="pl-9"
                placeholder="Pressure washer, camera, generator"
              />
            </label>
            <label className="relative">
              <span className="sr-only">Location</span>
              <MapPin
                className="pointer-events-none absolute left-3 top-3.5 h-4 w-4 text-muted-foreground"
                aria-hidden="true"
              />
              <Input name="location" className="pl-9" placeholder="City or ZIP" />
            </label>
            <Button size="lg" className="w-full md:w-auto">
              Search gear
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Button>
          </form>

          <div className="mt-8 grid grid-cols-3 gap-3 text-sm text-muted-foreground">
            {trustStats.map((stat) => (
              <div key={stat.label}>
                <p className="text-xl font-bold text-foreground">{stat.value}</p>
                <p>{stat.label}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="relative min-h-[420px] overflow-hidden rounded-lg border border-border bg-card shadow-soft lg:min-h-[590px]">
          <Image
            src="https://images.unsplash.com/photo-1581092921461-eab62e97a780?auto=format&fit=crop&w=1400&q=85"
            alt="Professional tools and rental equipment on a workshop bench"
            fill
            priority
            sizes="(min-width: 1024px) 50vw, 100vw"
            className="object-cover"
          />
          <div className="absolute inset-x-4 bottom-4 grid gap-3 sm:grid-cols-2">
            <div className="rounded-lg bg-background/92 p-4 shadow-soft backdrop-blur">
              <div className="flex items-center gap-2 text-sm font-semibold">
                <ShieldCheck className="h-4 w-4 text-primary" aria-hidden="true" />
                Damage protection
              </div>
              <p className="mt-2 text-sm text-muted-foreground">
                Deposits, claims, and owner payouts built into the booking flow.
              </p>
            </div>
            <div className="rounded-lg bg-background/92 p-4 shadow-soft backdrop-blur">
              <div className="flex items-center gap-2 text-sm font-semibold">
                <BadgeCheck className="h-4 w-4 text-primary" aria-hidden="true" />
                Verified owners
              </div>
              <p className="mt-2 text-sm text-muted-foreground">
                Profile checks, reviews, audit logs, and moderated listings.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="categories" className="border-y border-border bg-background/65 py-14">
        <div className="container">
          <div className="mb-8 flex flex-col justify-between gap-3 md:flex-row md:items-end">
            <div>
              <p className="text-sm font-semibold uppercase text-primary">
                Popular categories
              </p>
              <h2 className="mt-2 text-3xl font-bold">Start with what you need</h2>
            </div>
            <Button asChild variant="secondary">
              <Link href="/equipment">
                Browse all
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </Button>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {categories.map((category) => {
              const Icon = category.icon;

              return (
                <Link
                  key={category.slug}
                  href={`/equipment?category=${category.slug}`}
                  className="group flex min-h-24 items-center justify-between rounded-lg border border-border bg-card p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-soft"
                >
                  <div>
                    <h3 className="font-semibold">{category.name}</h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {category.listingCount.toLocaleString()} active listings
                    </p>
                  </div>
                  <span className="flex h-12 w-12 items-center justify-center rounded-md bg-secondary text-primary">
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <section className="container py-16">
        <div className="mb-8 flex flex-col justify-between gap-3 md:flex-row md:items-end">
          <div>
            <p className="text-sm font-semibold uppercase text-primary">
              Featured listings
            </p>
            <h2 className="mt-2 text-3xl font-bold">
              High-demand gear near busy cities
            </h2>
          </div>
        </div>
        <div className="grid gap-5 md:grid-cols-3">
          {featuredListings.map((listing) => (
            <Card key={listing.id} className="overflow-hidden">
              <div className="relative h-56 w-full">
                <Image
                  src={listing.imageUrl}
                  alt={listing.title}
                  fill
                  sizes="(min-width: 768px) 33vw, 100vw"
                  className="object-cover"
                />
              </div>
              <div className="p-5">
                <div className="mb-3 flex items-center justify-between gap-3 text-sm">
                  <Badge>{listing.category}</Badge>
                  <span className="flex items-center gap-1 font-medium">
                    <Star
                      className="h-4 w-4 fill-accent text-accent"
                      aria-hidden="true"
                    />
                    {listing.rating}
                  </span>
                </div>
                <h3 className="text-lg font-semibold">{listing.title}</h3>
                <p className="mt-2 flex items-center gap-1.5 text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4" aria-hidden="true" />
                  {listing.location}
                </p>
                <div className="mt-5 flex items-end justify-between gap-3">
                  <div>
                    <p className="text-2xl font-bold">${listing.pricePerDay}</p>
                    <p className="text-sm text-muted-foreground">per day</p>
                  </div>
                  <p className="text-right text-sm text-muted-foreground">
                    {listing.delivery ? "Delivery offered" : "Pickup only"}
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </section>

      <section id="how-it-works" className="bg-card py-16">
        <div className="container">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase text-primary">
              How it works
            </p>
            <h2 className="mt-2 text-3xl font-bold">
              Marketplace mechanics built for trust
            </h2>
          </div>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {steps.map((step) => {
              const Icon = step.icon;

              return (
                <div
                  key={step.title}
                  className="rounded-lg border border-border bg-background p-6"
                >
                  <span className="flex h-11 w-11 items-center justify-center rounded-md bg-primary text-primary-foreground">
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <h3 className="mt-5 text-lg font-semibold">{step.title}</h3>
                  <p className="mt-2 leading-7 text-muted-foreground">{step.body}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section id="trust" className="container grid gap-8 py-16 lg:grid-cols-[0.9fr_1.1fr]">
        <div>
          <p className="text-sm font-semibold uppercase text-primary">
            Trust layer
          </p>
          <h2 className="mt-2 text-3xl font-bold">
            Safety features for both sides of every rental
          </h2>
          <p className="mt-4 leading-8 text-muted-foreground">
            The MVP is structured for role permissions, secure uploads, deposits,
            damage protection, owner approvals, payouts, audit logs, and review
            moderation as the platform scales.
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          {testimonials.map((item) => (
            <Card key={item.author} className="p-6">
              <p className="leading-7 text-muted-foreground">"{item.quote}"</p>
              <div className="mt-5">
                <p className="font-semibold">{item.author}</p>
                <p className="text-sm text-muted-foreground">{item.role}</p>
              </div>
            </Card>
          ))}
        </div>
      </section>

      <footer className="border-t border-border py-8">
        <div className="container flex flex-col justify-between gap-4 text-sm text-muted-foreground md:flex-row md:items-center">
          <p>(c) 2026 GearShare. Peer-to-peer equipment rentals.</p>
          <div className="flex gap-5">
            <Link href="/equipment" className="hover:text-foreground">
              Browse
            </Link>
            <a href="#trust" className="hover:text-foreground">
              Safety
            </a>
            <a href="mailto:hello@gearshare.local" className="hover:text-foreground">
              Contact
            </a>
          </div>
        </div>
      </footer>
    </main>
  );
}
