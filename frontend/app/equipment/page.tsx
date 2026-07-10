import { ArrowLeft, MapPin, Search, Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { categories, filterListings } from "@/lib/marketplace-data";

type EquipmentPageProps = {
  searchParams: Promise<{
    q?: string;
    location?: string;
    category?: string;
  }>;
};

export default async function EquipmentPage({ searchParams }: EquipmentPageProps) {
  const params = await searchParams;
  const category = categories.find((item) => item.slug === params.category);
  const listings = filterListings(params.q).filter((listing) =>
    category ? listing.category.toLowerCase() === category.name.toLowerCase() : true,
  );

  return (
    <main>
      <header className="border-b border-border bg-background/80 backdrop-blur">
        <div className="container flex min-h-20 items-center justify-between gap-4 py-4">
          <Button asChild variant="ghost">
            <Link href="/">
              <ArrowLeft className="h-4 w-4" aria-hidden="true" />
              GearShare
            </Link>
          </Button>
          <Button>List gear</Button>
        </div>
      </header>

      <section className="container py-10">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase text-primary">
            Equipment search
          </p>
          <h1 className="mt-2 text-4xl font-bold">
            {category ? `${category.name} rentals` : "Browse rentable gear"}
          </h1>
          <p className="mt-4 leading-7 text-muted-foreground">
            Filtered marketplace results are wired now; live inventory, distance,
            price, rating, and availability filters plug into this route in the
            search phase.
          </p>
        </div>

        <form
          action="/equipment"
          className="mt-8 grid gap-3 rounded-lg border border-border bg-card p-3 shadow-sm md:grid-cols-[1fr_0.72fr_auto]"
        >
          <label className="relative">
            <span className="sr-only">Search equipment</span>
            <Search
              className="pointer-events-none absolute left-3 top-3.5 h-4 w-4 text-muted-foreground"
              aria-hidden="true"
            />
            <Input
              name="q"
              defaultValue={params.q}
              className="pl-9"
              placeholder="Search listings"
            />
          </label>
          <label className="relative">
            <span className="sr-only">Location</span>
            <MapPin
              className="pointer-events-none absolute left-3 top-3.5 h-4 w-4 text-muted-foreground"
              aria-hidden="true"
            />
            <Input
              name="location"
              defaultValue={params.location}
              className="pl-9"
              placeholder="City or ZIP"
            />
          </label>
          <Button className="w-full md:w-auto">Search</Button>
        </form>

        <div className="mt-8 grid gap-5 md:grid-cols-3">
          {listings.map((listing) => (
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
                <h2 className="text-lg font-semibold">{listing.title}</h2>
                <p className="mt-2 text-sm text-muted-foreground">
                  {listing.location} - {listing.availability}
                </p>
                <div className="mt-5 flex items-end justify-between gap-3">
                  <div>
                    <p className="text-2xl font-bold">${listing.pricePerDay}</p>
                    <p className="text-sm text-muted-foreground">per day</p>
                  </div>
                  <p className="text-right text-sm text-muted-foreground">
                    ${listing.deposit} deposit
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {listings.length === 0 ? (
          <Card className="mt-8 p-8 text-center">
            <h2 className="text-xl font-semibold">No matching equipment yet</h2>
            <p className="mt-2 text-muted-foreground">
              Try another search term or browse a popular category.
            </p>
          </Card>
        ) : null}
      </section>
    </main>
  );
}
