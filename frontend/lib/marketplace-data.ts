import {
  AudioLines,
  Camera,
  Drill,
  Hammer,
  Leaf,
  Projector,
  TentTree,
  Truck,
  Zap,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

export type Category = {
  name: string;
  slug: string;
  listingCount: number;
  icon: LucideIcon;
};

export type FeaturedListing = {
  id: string;
  title: string;
  category: string;
  location: string;
  pricePerDay: number;
  deposit: number;
  rating: number;
  reviews: number;
  imageUrl: string;
  owner: string;
  availability: string;
  delivery: boolean;
};

export const categories: Category[] = [
  { name: "Power tools", slug: "power-tools", listingCount: 1180, icon: Drill },
  { name: "Garden", slug: "garden", listingCount: 864, icon: Leaf },
  { name: "Cameras", slug: "cameras", listingCount: 642, icon: Camera },
  { name: "Generators", slug: "generators", listingCount: 310, icon: Zap },
  { name: "Projectors", slug: "projectors", listingCount: 221, icon: Projector },
  { name: "Event sound", slug: "event-sound", listingCount: 188, icon: AudioLines },
  { name: "Camping", slug: "camping", listingCount: 524, icon: TentTree },
  { name: "Trailers", slug: "trailers", listingCount: 147, icon: Truck },
  { name: "Construction", slug: "construction", listingCount: 290, icon: Hammer },
];

export const featuredListings: FeaturedListing[] = [
  {
    id: "pressure-washer-pro-3200",
    title: "Simpson Pro 3200 PSI pressure washer",
    category: "Garden",
    location: "Austin, TX",
    pricePerDay: 42,
    deposit: 150,
    rating: 4.96,
    reviews: 74,
    imageUrl:
      "https://images.unsplash.com/photo-1621905252507-b35492cc74b4?auto=format&fit=crop&w=1100&q=80",
    owner: "Maya R.",
    availability: "Available tomorrow",
    delivery: true,
  },
  {
    id: "canon-r6-video-kit",
    title: "Canon R6 mirrorless video kit",
    category: "Cameras",
    location: "Denver, CO",
    pricePerDay: 95,
    deposit: 500,
    rating: 4.98,
    reviews: 112,
    imageUrl:
      "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=1100&q=80",
    owner: "Darren K.",
    availability: "2 day minimum",
    delivery: false,
  },
  {
    id: "honda-eu2200i-generator",
    title: "Honda EU2200i quiet generator",
    category: "Generators",
    location: "Nashville, TN",
    pricePerDay: 58,
    deposit: 250,
    rating: 4.92,
    reviews: 45,
    imageUrl:
      "https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?auto=format&fit=crop&w=1100&q=80",
    owner: "Avery L.",
    availability: "Weekend slots open",
    delivery: true,
  },
];

export const trustStats = [
  { label: "Avg. owner response", value: "18 min" },
  { label: "Bookings protected", value: "$5M+" },
  { label: "Verified listings", value: "98%" },
];

export function filterListings(query?: string | string[]) {
  const rawQuery = Array.isArray(query) ? query[0] : query;
  const normalizedQuery = rawQuery?.trim().toLowerCase();

  if (!normalizedQuery) {
    return featuredListings;
  }

  return featuredListings.filter((listing) =>
    [listing.title, listing.category, listing.location, listing.owner]
      .join(" ")
      .toLowerCase()
      .includes(normalizedQuery),
  );
}
