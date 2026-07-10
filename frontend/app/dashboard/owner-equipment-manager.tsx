"use client";

import { useAuth } from "@clerk/nextjs";
import {
  CalendarDays,
  ImagePlus,
  Loader2,
  PackagePlus,
  ShieldCheck,
  Upload,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import type { FormEvent } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { apiUrl } from "@/lib/auth-config";

type GearShareUser = {
  id: string;
  email: string;
  roles: string[];
};

type Category = {
  id: string;
  slug: string;
  name: string;
};

type OwnerListing = {
  id: string;
  title: string;
  description: string;
  category: Category;
  condition: string;
  pricePerDayCents: number;
  depositAmountCents: number;
  city: string;
  region: string;
  locationName: string;
  isPublished: boolean;
  reviewCount: number;
  bookingCount: number;
  ratingAverage: string | number;
  images: Array<{
    url: string;
    altText: string;
    cloudinaryPublicId: string;
  }>;
  availability: Array<{
    date: string;
    isAvailable: boolean;
  }>;
};

type LoadState =
  | { status: "idle" | "loading" }
  | { status: "ready" }
  | { status: "error"; message: string };

export function OwnerEquipmentManager({ user }: { user: GearShareUser }) {
  const { getToken } = useAuth();
  const [roles, setRoles] = useState(user.roles);
  const [categories, setCategories] = useState<Category[]>([]);
  const [listings, setListings] = useState<OwnerListing[]>([]);
  const [loadState, setLoadState] = useState<LoadState>({ status: "idle" });
  const [formState, setFormState] = useState<LoadState>({ status: "idle" });
  const [signatureMessage, setSignatureMessage] = useState<string>();

  const isOwner = useMemo(() => roles.includes("OWNER"), [roles]);
  const errorMessage =
    loadState.status === "error"
      ? loadState.message
      : formState.status === "error"
        ? formState.message
        : undefined;

  useEffect(() => {
    async function load() {
      setLoadState({ status: "loading" });

      try {
        const [categoryResponse, listingResponse] = await Promise.all([
          fetch(`${apiUrl}/api/v1/equipment/categories`),
          isOwner ? authedFetch(getToken, "/api/v1/owner/equipment") : undefined,
        ]);

        if (!categoryResponse.ok) {
          throw new Error("Unable to load categories.");
        }

        setCategories((await categoryResponse.json()) as Category[]);

        if (listingResponse) {
          if (!listingResponse.ok) {
            throw new Error("Unable to load owner listings.");
          }

          setListings((await listingResponse.json()) as OwnerListing[]);
        }

        setLoadState({ status: "ready" });
      } catch (error) {
        setLoadState({
          status: "error",
          message: error instanceof Error ? error.message : "Unable to load owner tools.",
        });
      }
    }

    void load();
  }, [getToken, isOwner]);

  async function becomeOwner() {
    setFormState({ status: "loading" });

    try {
      const response = await authedFetch(getToken, "/api/v1/me/owner", {
        method: "POST",
        body: JSON.stringify({ ownerBio: "GearShare equipment owner" }),
      });

      if (!response.ok) {
        throw new Error("Unable to activate owner access.");
      }

      const updatedUser = (await response.json()) as GearShareUser;
      setRoles(updatedUser.roles);
      setFormState({ status: "ready" });
    } catch (error) {
      setFormState({
        status: "error",
        message:
          error instanceof Error ? error.message : "Unable to activate owner access.",
      });
    }
  }

  async function createListing(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    setFormState({ status: "loading" });

    try {
      const payload = {
        title: String(form.get("title") ?? ""),
        description: String(form.get("description") ?? ""),
        categorySlug: String(form.get("categorySlug") ?? ""),
        condition: String(form.get("condition") ?? "GOOD"),
        pricePerDayCents: dollarsToCents(form.get("pricePerDay")),
        depositAmountCents: dollarsToCents(form.get("depositAmount")),
        deliveryAvailable: form.get("deliveryAvailable") === "on",
        deliveryFeeCents: dollarsToCents(form.get("deliveryFee")),
        locationName: String(form.get("locationName") ?? ""),
        city: String(form.get("city") ?? ""),
        region: String(form.get("region") ?? ""),
        specifications: parseSpecifications(String(form.get("specifications") ?? "")),
        images: imagePayloadFromForm(form),
      };
      const response = await authedFetch(getToken, "/api/v1/owner/equipment", {
        method: "POST",
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(await readApiMessage(response));
      }

      const created = (await response.json()) as OwnerListing;
      setListings((current) => [created, ...current]);
      event.currentTarget.reset();
      setFormState({ status: "ready" });
    } catch (error) {
      setFormState({
        status: "error",
        message: error instanceof Error ? error.message : "Unable to create listing.",
      });
    }
  }

  async function updatePublishState(listingId: string, publish: boolean) {
    const response = await authedFetch(
      getToken,
      `/api/v1/owner/equipment/${listingId}/${publish ? "publish" : "unpublish"}`,
      { method: "POST", body: JSON.stringify({}) },
    );

    if (!response.ok) {
      setFormState({ status: "error", message: await readApiMessage(response) });
      return;
    }

    const updated = (await response.json()) as OwnerListing;
    setListings((current) =>
      current.map((listing) => (listing.id === updated.id ? updated : listing)),
    );
  }

  async function deleteListing(listingId: string) {
    const response = await authedFetch(getToken, `/api/v1/owner/equipment/${listingId}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      setFormState({ status: "error", message: await readApiMessage(response) });
      return;
    }

    setListings((current) => current.filter((listing) => listing.id !== listingId));
  }

  async function replaceImages(event: FormEvent<HTMLFormElement>, listingId: string) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const response = await authedFetch(
      getToken,
      `/api/v1/owner/equipment/${listingId}/images`,
      {
        method: "PUT",
        body: JSON.stringify({ images: imagePayloadFromForm(form) }),
      },
    );

    if (!response.ok) {
      setFormState({ status: "error", message: await readApiMessage(response) });
      return;
    }

    const updated = (await response.json()) as OwnerListing;
    setListings((current) =>
      current.map((listing) => (listing.id === updated.id ? updated : listing)),
    );
    event.currentTarget.reset();
  }

  async function upsertAvailability(
    event: FormEvent<HTMLFormElement>,
    listingId: string,
  ) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const date = String(form.get("date") ?? "");

    if (!date) {
      return;
    }

    const response = await authedFetch(
      getToken,
      `/api/v1/owner/equipment/${listingId}/availability`,
      {
        method: "PUT",
        body: JSON.stringify({
          availability: [
            {
              date: new Date(`${date}T00:00:00.000Z`).toISOString(),
              isAvailable: form.get("isAvailable") === "on",
              note: String(form.get("note") ?? ""),
            },
          ],
        }),
      },
    );

    if (!response.ok) {
      setFormState({ status: "error", message: await readApiMessage(response) });
      return;
    }

    const updated = (await response.json()) as OwnerListing;
    setListings((current) =>
      current.map((listing) => (listing.id === updated.id ? updated : listing)),
    );
    event.currentTarget.reset();
  }

  async function createUploadSignature(listingId?: string) {
    setSignatureMessage(undefined);

    const response = await authedFetch(
      getToken,
      "/api/v1/uploads/cloudinary/equipment-image-signature",
      {
        method: "POST",
        body: JSON.stringify({ equipmentId: listingId }),
      },
    );

    if (!response.ok) {
      setSignatureMessage(await readApiMessage(response));
      return;
    }

    const signature = (await response.json()) as { folder: string; uploadUrl: string };
    setSignatureMessage(`${signature.folder} -> ${signature.uploadUrl}`);
  }

  return (
    <section className="mt-8">
      <div className="mb-5 flex flex-col justify-between gap-3 md:flex-row md:items-end">
        <div>
          <p className="text-sm font-semibold uppercase text-primary">Owner tools</p>
          <h2 className="mt-2 text-2xl font-bold">Equipment listings</h2>
        </div>
        {!isOwner ? (
          <Button onClick={becomeOwner} disabled={formState.status === "loading"}>
            <ShieldCheck className="h-4 w-4" aria-hidden="true" />
            Activate owner access
          </Button>
        ) : (
          <Button onClick={() => void createUploadSignature()}>
            <Upload className="h-4 w-4" aria-hidden="true" />
            Upload signature
          </Button>
        )}
      </div>

      {loadState.status === "loading" ? (
        <Card className="flex min-h-32 items-center justify-center p-6">
          <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
        </Card>
      ) : null}

      {errorMessage ? (
        <Card className="mb-5 border-destructive/40 p-4 text-sm text-destructive">
          {errorMessage}
        </Card>
      ) : null}

      {signatureMessage ? (
        <Card className="mb-5 p-4 text-sm text-muted-foreground">
          {signatureMessage}
        </Card>
      ) : null}

      {!isOwner ? (
        <Card className="p-6">
          <h3 className="text-lg font-semibold">Owner access required</h3>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            {user.email} has renter access. Activate owner access to manage listings.
          </p>
        </Card>
      ) : (
        <div className="grid gap-5 xl:grid-cols-[0.95fr_1.05fr]">
          <Card className="p-5">
            <div className="mb-5 flex items-center gap-2">
              <PackagePlus className="h-5 w-5 text-primary" aria-hidden="true" />
              <h3 className="text-lg font-semibold">Create listing</h3>
            </div>
            <form className="grid gap-3" onSubmit={createListing}>
              <Input name="title" placeholder="Listing title" required />
              <textarea
                name="description"
                className="min-h-24 rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
                placeholder="Description"
                required
              />
              <div className="grid gap-3 sm:grid-cols-2">
                <select
                  name="categorySlug"
                  className="h-11 rounded-md border border-input bg-background px-3 text-sm"
                  required
                >
                  <option value="">Category</option>
                  {categories.map((category) => (
                    <option key={category.slug} value={category.slug}>
                      {category.name}
                    </option>
                  ))}
                </select>
                <select
                  name="condition"
                  className="h-11 rounded-md border border-input bg-background px-3 text-sm"
                  defaultValue="GOOD"
                >
                  <option value="NEW">New</option>
                  <option value="EXCELLENT">Excellent</option>
                  <option value="GOOD">Good</option>
                  <option value="FAIR">Fair</option>
                </select>
              </div>
              <div className="grid gap-3 sm:grid-cols-3">
                <Input name="pricePerDay" placeholder="Daily price" required />
                <Input name="depositAmount" placeholder="Deposit" required />
                <Input name="deliveryFee" placeholder="Delivery fee" />
              </div>
              <label className="flex items-center gap-2 text-sm">
                <input name="deliveryAvailable" type="checkbox" />
                Delivery available
              </label>
              <div className="grid gap-3 sm:grid-cols-3">
                <Input name="locationName" placeholder="Pickup location" required />
                <Input name="city" placeholder="City" required />
                <Input name="region" placeholder="Region" required />
              </div>
              <textarea
                name="specifications"
                className="min-h-20 rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
                placeholder="Specifications JSON"
              />
              <div className="grid gap-3 sm:grid-cols-3">
                <Input name="imageUrl" placeholder="Image URL" />
                <Input name="cloudinaryPublicId" placeholder="Cloudinary public ID" />
                <Input name="altText" placeholder="Image alt text" />
              </div>
              <Button type="submit" disabled={formState.status === "loading"}>
                {formState.status === "loading" ? (
                  <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                ) : (
                  <PackagePlus className="h-4 w-4" aria-hidden="true" />
                )}
                Create listing
              </Button>
            </form>
          </Card>

          <div className="grid gap-4">
            {listings.map((listing) => (
              <Card key={listing.id} className="p-5">
                <div className="flex flex-col justify-between gap-3 md:flex-row">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-lg font-semibold">{listing.title}</h3>
                      <Badge>{listing.isPublished ? "published" : "draft"}</Badge>
                      <Badge>{listing.category.name}</Badge>
                    </div>
                    <p className="mt-2 text-sm text-muted-foreground">
                      {listing.city}, {listing.region} - $
                      {(listing.pricePerDayCents / 100).toFixed(0)}/day -{" "}
                      {listing.bookingCount} bookings - {listing.reviewCount} reviews
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Button
                      type="button"
                      variant="secondary"
                      onClick={() =>
                        void updatePublishState(listing.id, !listing.isPublished)
                      }
                    >
                      {listing.isPublished ? "Unpublish" : "Publish"}
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={() => void deleteListing(listing.id)}
                    >
                      Delete
                    </Button>
                  </div>
                </div>

                <div className="mt-5 grid gap-3 lg:grid-cols-2">
                  <form
                    className="grid gap-3"
                    onSubmit={(event) => void replaceImages(event, listing.id)}
                  >
                    <div className="flex items-center gap-2 text-sm font-semibold">
                      <ImagePlus className="h-4 w-4 text-primary" aria-hidden="true" />
                      Image
                    </div>
                    <Input name="imageUrl" placeholder="Image URL" />
                    <Input name="cloudinaryPublicId" placeholder="Cloudinary public ID" />
                    <Input name="altText" placeholder="Image alt text" />
                    <div className="flex gap-2">
                      <Button type="submit" variant="secondary">
                        Save image
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        onClick={() => void createUploadSignature(listing.id)}
                      >
                        Signature
                      </Button>
                    </div>
                  </form>

                  <form
                    className="grid gap-3"
                    onSubmit={(event) => void upsertAvailability(event, listing.id)}
                  >
                    <div className="flex items-center gap-2 text-sm font-semibold">
                      <CalendarDays
                        className="h-4 w-4 text-primary"
                        aria-hidden="true"
                      />
                      Availability
                    </div>
                    <Input name="date" type="date" />
                    <Input name="note" placeholder="Note" />
                    <label className="flex items-center gap-2 text-sm">
                      <input name="isAvailable" type="checkbox" defaultChecked />
                      Available
                    </label>
                    <Button type="submit" variant="secondary">
                      Save availability
                    </Button>
                  </form>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}

async function authedFetch(
  getToken: () => Promise<string | null>,
  path: string,
  init?: RequestInit,
) {
  const token = await getToken();

  if (!token) {
    throw new Error("Missing Clerk session token.");
  }

  return fetch(`${apiUrl}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      ...init?.headers,
    },
  });
}

function dollarsToCents(value: FormDataEntryValue | null) {
  const numericValue = Number.parseFloat(String(value ?? "0"));

  if (Number.isNaN(numericValue)) {
    return 0;
  }

  return Math.round(numericValue * 100);
}

function parseSpecifications(value: string) {
  if (!value.trim()) {
    return {};
  }

  try {
    const parsed = JSON.parse(value) as unknown;

    return typeof parsed === "object" && parsed !== null ? parsed : {};
  } catch {
    return {};
  }
}

function imagePayloadFromForm(form: FormData) {
  const url = String(form.get("imageUrl") ?? "").trim();

  if (!url) {
    return [];
  }

  const cloudinaryPublicId =
    String(form.get("cloudinaryPublicId") ?? "").trim() || `manual/${Date.now()}`;

  return [
    {
      url,
      cloudinaryPublicId,
      altText: String(form.get("altText") ?? "").trim() || "Equipment image",
      sortOrder: 0,
    },
  ];
}

async function readApiMessage(response: Response) {
  const body = (await response.json().catch(() => null)) as {
    message?: string | string[];
  } | null;
  const message = body?.message;

  return Array.isArray(message)
    ? message.join(", ")
    : (message ?? "API request failed.");
}
