import {
  BookingStatus,
  EquipmentCondition,
  PrismaClient,
  UserRole,
} from "@prisma/client";

import { recalculateEquipmentAggregates } from "../src/modules/equipment/aggregates/equipment-aggregate.calculator";

const prisma = new PrismaClient();

const categories = [
  {
    id: "seed_category_power_tools",
    slug: "power-tools",
    name: "Power tools",
    description: "Drills, saws, sanders, compressors, and jobsite essentials.",
    sortOrder: 10,
  },
  {
    id: "seed_category_garden",
    slug: "garden",
    name: "Garden",
    description: "Pressure washers, mowers, trimmers, and outdoor maintenance gear.",
    sortOrder: 20,
  },
  {
    id: "seed_category_cameras",
    slug: "cameras",
    name: "Cameras",
    description: "Cameras, lenses, lighting, stabilizers, and production kits.",
    sortOrder: 30,
  },
  {
    id: "seed_category_generators",
    slug: "generators",
    name: "Generators",
    description: "Portable power for sites, homes, events, and camping.",
    sortOrder: 40,
  },
  {
    id: "seed_category_projectors",
    slug: "projectors",
    name: "Projectors",
    description: "Projectors, screens, and presentation equipment.",
    sortOrder: 50,
  },
  {
    id: "seed_category_event_sound",
    slug: "event-sound",
    name: "Event sound",
    description: "Speakers, mixers, microphones, and party sound systems.",
    sortOrder: 60,
  },
  {
    id: "seed_category_camping",
    slug: "camping",
    name: "Camping",
    description: "Tents, coolers, stoves, sleeping kits, and outdoor gear.",
    sortOrder: 70,
  },
  {
    id: "seed_category_trailers",
    slug: "trailers",
    name: "Trailers",
    description: "Utility trailers, enclosed trailers, and towing equipment.",
    sortOrder: 80,
  },
  {
    id: "seed_category_construction",
    slug: "construction",
    name: "Construction",
    description: "Mixers, ladders, compactors, and contractor equipment.",
    sortOrder: 90,
  },
];

const users = [
  {
    id: "seed_user_maya_owner",
    email: "maya.owner@gearshare.dev",
    externalAuthId: "seed_clerk_maya_owner",
    displayName: "Maya Rivera",
    city: "Austin",
    region: "TX",
    roles: [UserRole.RENTER, UserRole.OWNER],
  },
  {
    id: "seed_user_darren_owner",
    email: "darren.owner@gearshare.dev",
    externalAuthId: "seed_clerk_darren_owner",
    displayName: "Darren Kim",
    city: "Denver",
    region: "CO",
    roles: [UserRole.RENTER, UserRole.OWNER],
  },
  {
    id: "seed_user_avery_owner",
    email: "avery.owner@gearshare.dev",
    externalAuthId: "seed_clerk_avery_owner",
    displayName: "Avery Lewis",
    city: "Nashville",
    region: "TN",
    roles: [UserRole.RENTER, UserRole.OWNER],
  },
  {
    id: "seed_user_jordan_renter",
    email: "jordan.renter@gearshare.dev",
    externalAuthId: "seed_clerk_jordan_renter",
    displayName: "Jordan Patel",
    city: "Austin",
    region: "TX",
    roles: [UserRole.RENTER],
  },
  {
    id: "seed_user_admin",
    email: "admin@gearshare.dev",
    externalAuthId: "seed_clerk_admin",
    displayName: "GearShare Admin",
    city: "Remote",
    region: "US",
    roles: [UserRole.ADMIN],
  },
];

const equipment = [
  {
    id: "seed_equipment_pressure_washer",
    ownerEmail: "maya.owner@gearshare.dev",
    categorySlug: "garden",
    slug: "simpson-pro-3200-psi-pressure-washer",
    title: "Simpson Pro 3200 PSI pressure washer",
    description:
      "Commercial-grade pressure washer with surface cleaner attachment, hose, and safety instructions.",
    condition: EquipmentCondition.EXCELLENT,
    pricePerDayCents: 4200,
    depositAmountCents: 15000,
    deliveryAvailable: true,
    deliveryFeeCents: 1800,
    locationName: "South Austin pickup",
    city: "Austin",
    region: "TX",
    postalCode: "78704",
    latitude: "30.245300",
    longitude: "-97.780100",
    specifications: {
      pressurePsi: 3200,
      fuel: "Gas",
      includes: ["surface cleaner", "50 ft hose", "nozzle set"],
    },
    imageUrl:
      "https://images.unsplash.com/photo-1621905252507-b35492cc74b4?auto=format&fit=crop&w=1100&q=80",
  },
  {
    id: "seed_equipment_canon_r6",
    ownerEmail: "darren.owner@gearshare.dev",
    categorySlug: "cameras",
    slug: "canon-r6-mirrorless-video-kit",
    title: "Canon R6 mirrorless video kit",
    description:
      "Full-frame camera body with 24-70mm lens, batteries, cage, ND filters, and compact LED light.",
    condition: EquipmentCondition.EXCELLENT,
    pricePerDayCents: 9500,
    depositAmountCents: 50000,
    deliveryAvailable: false,
    locationName: "LoHi studio pickup",
    city: "Denver",
    region: "CO",
    postalCode: "80211",
    latitude: "39.759600",
    longitude: "-105.011500",
    specifications: {
      sensor: "Full frame",
      resolution: "20 MP",
      video: "4K 60p",
      includes: ["24-70mm lens", "3 batteries", "LED panel", "ND filters"],
    },
    imageUrl:
      "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=1100&q=80",
  },
  {
    id: "seed_equipment_honda_generator",
    ownerEmail: "avery.owner@gearshare.dev",
    categorySlug: "generators",
    slug: "honda-eu2200i-quiet-generator",
    title: "Honda EU2200i quiet generator",
    description:
      "Reliable inverter generator for events, camping, emergency home backup, and small job sites.",
    condition: EquipmentCondition.GOOD,
    pricePerDayCents: 5800,
    depositAmountCents: 25000,
    deliveryAvailable: true,
    deliveryFeeCents: 2200,
    locationName: "East Nashville pickup",
    city: "Nashville",
    region: "TN",
    postalCode: "37206",
    latitude: "36.179500",
    longitude: "-86.741400",
    specifications: {
      watts: 2200,
      fuel: "Gas",
      noiseDb: 48,
      runtimeHours: 8.1,
    },
    imageUrl:
      "https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?auto=format&fit=crop&w=1100&q=80",
  },
  {
    id: "seed_equipment_projector",
    ownerEmail: "maya.owner@gearshare.dev",
    categorySlug: "projectors",
    slug: "epson-4k-event-projector",
    title: "Epson 4K event projector and screen",
    description:
      "Bright event projector bundled with 100-inch portable screen, HDMI cable, and tripod stand.",
    condition: EquipmentCondition.GOOD,
    pricePerDayCents: 7600,
    depositAmountCents: 30000,
    deliveryAvailable: true,
    deliveryFeeCents: 1500,
    locationName: "South Austin pickup",
    city: "Austin",
    region: "TX",
    postalCode: "78704",
    latitude: "30.245300",
    longitude: "-97.780100",
    specifications: {
      resolution: "4K enhanced",
      brightnessLumens: 3200,
      screenSizeInches: 100,
    },
    imageUrl:
      "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=1100&q=80",
  },
];

const completedBookings = [
  {
    id: "seed_booking_pressure_washer_jordan",
    renterEmail: "jordan.renter@gearshare.dev",
    equipmentId: "seed_equipment_pressure_washer",
    startsAt: "2026-06-08T14:00:00.000Z",
    endsAt: "2026-06-09T14:00:00.000Z",
    rentalSubtotalCents: 4200,
    deliveryFeeCents: 1800,
    serviceFeeCents: 630,
    depositAmountCents: 15000,
    totalAmountCents: 21630,
    deliveryRequested: true,
  },
  {
    id: "seed_booking_canon_r6_jordan",
    renterEmail: "jordan.renter@gearshare.dev",
    equipmentId: "seed_equipment_canon_r6",
    startsAt: "2026-06-14T15:00:00.000Z",
    endsAt: "2026-06-16T15:00:00.000Z",
    rentalSubtotalCents: 19000,
    deliveryFeeCents: 0,
    serviceFeeCents: 2850,
    depositAmountCents: 50000,
    totalAmountCents: 71850,
    deliveryRequested: false,
  },
  {
    id: "seed_booking_generator_jordan",
    renterEmail: "jordan.renter@gearshare.dev",
    equipmentId: "seed_equipment_honda_generator",
    startsAt: "2026-06-22T13:00:00.000Z",
    endsAt: "2026-06-23T13:00:00.000Z",
    rentalSubtotalCents: 5800,
    deliveryFeeCents: 2200,
    serviceFeeCents: 870,
    depositAmountCents: 25000,
    totalAmountCents: 33870,
    deliveryRequested: true,
  },
];

const reviews = [
  {
    id: "seed_review_pressure_washer_jordan",
    bookingId: "seed_booking_pressure_washer_jordan",
    equipmentId: "seed_equipment_pressure_washer",
    reviewerEmail: "jordan.renter@gearshare.dev",
    revieweeEmail: "maya.owner@gearshare.dev",
    rating: 5,
    body: "Clean machine, clear pickup instructions, and the driveway job was finished faster than expected.",
  },
  {
    id: "seed_review_canon_r6_jordan",
    bookingId: "seed_booking_canon_r6_jordan",
    equipmentId: "seed_equipment_canon_r6",
    reviewerEmail: "jordan.renter@gearshare.dev",
    revieweeEmail: "darren.owner@gearshare.dev",
    rating: 5,
    body: "Everything was charged, labeled, and ready to shoot. Great kit for a weekend production.",
  },
  {
    id: "seed_review_generator_jordan",
    bookingId: "seed_booking_generator_jordan",
    equipmentId: "seed_equipment_honda_generator",
    reviewerEmail: "jordan.renter@gearshare.dev",
    revieweeEmail: "avery.owner@gearshare.dev",
    rating: 4,
    body: "Quiet generator and easy delivery. Fuel level notes were helpful for return.",
  },
];

async function main() {
  const categoryBySlug = new Map<string, string>();

  for (const category of categories) {
    const savedCategory = await prisma.category.upsert({
      where: { slug: category.slug },
      update: {
        name: category.name,
        description: category.description,
        sortOrder: category.sortOrder,
      },
      create: category,
    });

    categoryBySlug.set(savedCategory.slug, savedCategory.id);
  }

  const userByEmail = new Map<string, string>();

  for (const seedUser of users) {
    const user = await prisma.user.upsert({
      where: { email: seedUser.email },
      update: {
        externalAuthId: seedUser.externalAuthId,
      },
      create: {
        id: seedUser.id,
        email: seedUser.email,
        externalAuthId: seedUser.externalAuthId,
      },
    });

    await prisma.profile.upsert({
      where: { userId: user.id },
      update: {
        displayName: seedUser.displayName,
        city: seedUser.city,
        region: seedUser.region,
      },
      create: {
        userId: user.id,
        displayName: seedUser.displayName,
        city: seedUser.city,
        region: seedUser.region,
      },
    });

    for (const role of seedUser.roles) {
      await prisma.userRoleGrant.upsert({
        where: {
          userId_role: {
            userId: user.id,
            role,
          },
        },
        update: {},
        create: {
          userId: user.id,
          role,
        },
      });
    }

    userByEmail.set(seedUser.email, user.id);
  }

  const equipmentIds: string[] = [];

  for (const seedEquipment of equipment) {
    const ownerId = requiredMapValue(userByEmail, seedEquipment.ownerEmail);
    const categoryId = requiredMapValue(categoryBySlug, seedEquipment.categorySlug);
    const publishedAt = new Date("2026-07-01T10:00:00.000Z");

    const savedEquipment = await prisma.equipment.upsert({
      where: {
        ownerId_slug: {
          ownerId,
          slug: seedEquipment.slug,
        },
      },
      update: {
        categoryId,
        title: seedEquipment.title,
        description: seedEquipment.description,
        condition: seedEquipment.condition,
        pricePerDayCents: seedEquipment.pricePerDayCents,
        depositAmountCents: seedEquipment.depositAmountCents,
        deliveryAvailable: seedEquipment.deliveryAvailable,
        deliveryFeeCents: seedEquipment.deliveryFeeCents,
        locationName: seedEquipment.locationName,
        city: seedEquipment.city,
        region: seedEquipment.region,
        postalCode: seedEquipment.postalCode,
        latitude: seedEquipment.latitude,
        longitude: seedEquipment.longitude,
        specifications: seedEquipment.specifications,
        isPublished: true,
        publishedAt,
      },
      create: {
        id: seedEquipment.id,
        ownerId,
        categoryId,
        slug: seedEquipment.slug,
        title: seedEquipment.title,
        description: seedEquipment.description,
        condition: seedEquipment.condition,
        pricePerDayCents: seedEquipment.pricePerDayCents,
        depositAmountCents: seedEquipment.depositAmountCents,
        deliveryAvailable: seedEquipment.deliveryAvailable,
        deliveryFeeCents: seedEquipment.deliveryFeeCents,
        locationName: seedEquipment.locationName,
        city: seedEquipment.city,
        region: seedEquipment.region,
        postalCode: seedEquipment.postalCode,
        latitude: seedEquipment.latitude,
        longitude: seedEquipment.longitude,
        specifications: seedEquipment.specifications,
        isPublished: true,
        publishedAt,
      },
    });

    equipmentIds.push(savedEquipment.id);

    await prisma.equipmentImage.deleteMany({
      where: { equipmentId: savedEquipment.id },
    });
    await prisma.equipmentImage.create({
      data: {
        id: `${savedEquipment.id}_image_primary`,
        equipmentId: savedEquipment.id,
        url: seedEquipment.imageUrl,
        cloudinaryPublicId: `seed/${savedEquipment.slug}/primary`,
        altText: seedEquipment.title,
        sortOrder: 0,
      },
    });

    await seedAvailability(savedEquipment.id);
  }

  for (const booking of completedBookings) {
    const renterId = requiredMapValue(userByEmail, booking.renterEmail);
    const savedEquipment = await prisma.equipment.findUniqueOrThrow({
      where: { id: booking.equipmentId },
      select: { ownerId: true },
    });

    await prisma.booking.upsert({
      where: { id: booking.id },
      update: {
        status: BookingStatus.COMPLETED,
        startsAt: new Date(booking.startsAt),
        endsAt: new Date(booking.endsAt),
        rentalSubtotalCents: booking.rentalSubtotalCents,
        deliveryFeeCents: booking.deliveryFeeCents,
        serviceFeeCents: booking.serviceFeeCents,
        depositAmountCents: booking.depositAmountCents,
        totalAmountCents: booking.totalAmountCents,
        deliveryRequested: booking.deliveryRequested,
        completedAt: new Date(booking.endsAt),
      },
      create: {
        id: booking.id,
        renterId,
        ownerId: savedEquipment.ownerId,
        equipmentId: booking.equipmentId,
        status: BookingStatus.COMPLETED,
        startsAt: new Date(booking.startsAt),
        endsAt: new Date(booking.endsAt),
        rentalSubtotalCents: booking.rentalSubtotalCents,
        deliveryFeeCents: booking.deliveryFeeCents,
        serviceFeeCents: booking.serviceFeeCents,
        depositAmountCents: booking.depositAmountCents,
        totalAmountCents: booking.totalAmountCents,
        deliveryRequested: booking.deliveryRequested,
        approvedAt: new Date(booking.startsAt),
        completedAt: new Date(booking.endsAt),
      },
    });
  }

  for (const review of reviews) {
    await prisma.review.upsert({
      where: {
        bookingId_reviewerId: {
          bookingId: review.bookingId,
          reviewerId: requiredMapValue(userByEmail, review.reviewerEmail),
        },
      },
      update: {
        rating: review.rating,
        body: review.body,
      },
      create: {
        id: review.id,
        bookingId: review.bookingId,
        equipmentId: review.equipmentId,
        reviewerId: requiredMapValue(userByEmail, review.reviewerEmail),
        revieweeId: requiredMapValue(userByEmail, review.revieweeEmail),
        rating: review.rating,
        body: review.body,
      },
    });
  }

  const snapshots = await recalculateEquipmentAggregates(prisma, equipmentIds);

  console.log(
    `Seeded ${categories.length} categories, ${users.length} users, ${equipment.length} listings, ${completedBookings.length} bookings, and ${reviews.length} reviews.`,
  );
  console.table(snapshots);
}

async function seedAvailability(equipmentId: string) {
  const dates = [
    "2026-07-15T00:00:00.000Z",
    "2026-07-16T00:00:00.000Z",
    "2026-07-17T00:00:00.000Z",
    "2026-07-18T00:00:00.000Z",
    "2026-07-19T00:00:00.000Z",
  ];

  for (const date of dates) {
    await prisma.equipmentAvailability.upsert({
      where: {
        equipmentId_date: {
          equipmentId,
          date: new Date(date),
        },
      },
      update: {
        isAvailable: true,
      },
      create: {
        id: `${equipmentId}_availability_${date.slice(0, 10)}`,
        equipmentId,
        date: new Date(date),
        isAvailable: true,
      },
    });
  }
}

function requiredMapValue(map: Map<string, string>, key: string) {
  const value = map.get(key);

  if (!value) {
    throw new Error(`Missing seeded record for ${key}.`);
  }

  return value;
}

void main()
  .catch((error: unknown) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
