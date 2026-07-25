import { config as loadEnv } from "dotenv";
import { PrismaLibSql } from "@prisma/adapter-libsql";
import { PrismaClient } from "../src/generated/prisma/client";
import bcrypt from "bcryptjs";
import { mockBrands, mockCategories, mockServices, mockSettings, mockTestimonials } from "../src/data/mock-catalog";
import { mockVehicles } from "../src/data/mock-vehicles";
import { faqItems } from "../src/constants/faq";
import { resolveDatabaseUrl } from "../src/lib/db";

loadEnv({ path: ".env" });
loadEnv({ path: ".env.local", override: true });

const adapter = new PrismaLibSql({ url: resolveDatabaseUrl() });
const prisma = new PrismaClient({ adapter });

async function main() {
  const email = (process.env.ADMIN_EMAIL || "admin@aristo.com").toLowerCase();
  const password = process.env.ADMIN_PASSWORD || "AristoAdmin123!";

  await prisma.user.upsert({
    where: { email },
    update: { name: "Fellah Express LLC Admin" },
    create: {
      email,
      name: "Fellah Express LLC Admin",
      passwordHash: await bcrypt.hash(password, 10),
      role: "admin",
    },
  });

  await prisma.siteSetting.upsert({
    where: { id: "default" },
    update: {
      companyName: mockSettings.companyName,
      description: "Premium automotive dealership in Columbus, Ohio.",
    },
    create: {
      id: "default",
      companyName: mockSettings.companyName,
      description: "Premium automotive dealership in Columbus, Ohio.",
      phone: mockSettings.phone,
      whatsapp: mockSettings.whatsapp,
      email: mockSettings.email,
      address: mockSettings.address,
      heroTitle: mockSettings.heroTitle,
      heroSubtitle: mockSettings.heroSubtitle,
      heroImage: mockSettings.heroImage,
      financingRateFrom: mockSettings.financingRateFrom,
      socialJson: JSON.stringify(mockSettings.social),
      hoursJson: JSON.stringify([
        { day: "Monday – Friday", time: "9:00 AM – 7:00 PM" },
        { day: "Saturday", time: "10:00 AM – 6:00 PM" },
        { day: "Sunday", time: "By appointment" },
      ]),
    },
  });

  for (const [index, category] of mockCategories.entries()) {
    await prisma.category.upsert({
      where: { slug: category.slug },
      update: {
        name: category.name,
        description: category.description,
        image: category.image,
        sortOrder: index,
      },
      create: {
        id: category.id,
        name: category.name,
        slug: category.slug,
        description: category.description,
        image: category.image,
        sortOrder: index,
      },
    });
  }

  for (const brand of mockBrands) {
    await prisma.brand.upsert({
      where: { slug: brand.slug },
      update: { name: brand.name },
      create: {
        id: brand.id,
        name: brand.name,
        slug: brand.slug,
      },
    });
  }

  for (const [index, service] of mockServices.entries()) {
    await prisma.service.upsert({
      where: { slug: service.slug },
      update: {
        name: service.name,
        description: service.description,
        longDescription: service.longDescription,
        icon: service.icon,
        image: service.image,
        benefits: JSON.stringify(service.benefits),
        featured: service.featured,
        sortOrder: index,
        published: true,
      },
      create: {
        id: service.id,
        name: service.name,
        slug: service.slug,
        description: service.description,
        longDescription: service.longDescription,
        icon: service.icon,
        image: service.image,
        benefits: JSON.stringify(service.benefits),
        featured: service.featured,
        sortOrder: index,
        published: true,
      },
    });
  }

  for (const [index, item] of mockTestimonials.entries()) {
    await prisma.testimonial.upsert({
      where: { id: item.id },
      update: {
        name: item.name,
        role: item.role,
        rating: item.rating,
        content: item.content,
        vehiclePurchased: item.vehiclePurchased || "",
        sortOrder: index,
        published: true,
      },
      create: {
        id: item.id,
        name: item.name,
        role: item.role,
        rating: item.rating,
        content: item.content,
        vehiclePurchased: item.vehiclePurchased || "",
        sortOrder: index,
        published: true,
      },
    });
  }

  for (const [index, item] of faqItems.entries()) {
    const id = `faq-${index + 1}`;
    await prisma.faqItem.upsert({
      where: { id },
      update: {
        question: item.question,
        answer: item.answer,
        sortOrder: index,
        published: true,
      },
      create: {
        id,
        question: item.question,
        answer: item.answer,
        sortOrder: index,
        published: true,
      },
    });
  }

  for (const [index, vehicle] of mockVehicles.entries()) {
    const brand = await prisma.brand.findFirst({
      where: { name: vehicle.brand },
    });

    await prisma.vehicle.upsert({
      where: { id: vehicle.id },
      update: {
        name: vehicle.name,
        brandId: brand?.id,
        brandName: vehicle.brand,
        model: vehicle.model,
        year: vehicle.year,
        price: vehicle.price,
        mileage: vehicle.mileage,
        fuel: vehicle.fuel,
        transmission: vehicle.transmission,
        engine: vehicle.engine,
        doors: vehicle.doors,
        color: vehicle.color,
        condition: vehicle.condition,
        description: vehicle.description,
        bodyStyle: vehicle.bodyStyle,
        driveType: vehicle.driveType,
        vin: vehicle.vin || "",
        mpgCity: vehicle.mpgCity,
        mpgHighway: vehicle.mpgHighway,
        featured: vehicle.featured,
        published: true,
        categoryId: vehicle.categoryId || null,
        features: JSON.stringify(vehicle.features),
        sortOrder: index,
      },
      create: {
        id: vehicle.id,
        name: vehicle.name,
        brandId: brand?.id,
        brandName: vehicle.brand,
        model: vehicle.model,
        year: vehicle.year,
        price: vehicle.price,
        mileage: vehicle.mileage,
        fuel: vehicle.fuel,
        transmission: vehicle.transmission,
        engine: vehicle.engine,
        doors: vehicle.doors,
        color: vehicle.color,
        condition: vehicle.condition,
        description: vehicle.description,
        bodyStyle: vehicle.bodyStyle,
        driveType: vehicle.driveType,
        vin: vehicle.vin || "",
        mpgCity: vehicle.mpgCity,
        mpgHighway: vehicle.mpgHighway,
        featured: vehicle.featured,
        published: true,
        categoryId: vehicle.categoryId || null,
        features: JSON.stringify(vehicle.features),
        sortOrder: index,
        images: {
          create: vehicle.images.map((url, imageIndex) => ({
            url,
            alt: vehicle.name,
            sortOrder: imageIndex,
          })),
        },
        attributes: {
          create: [
            { label: "Fuel", value: vehicle.fuel, sortOrder: 0 },
            { label: "Transmission", value: vehicle.transmission, sortOrder: 1 },
            { label: "Drivetrain", value: vehicle.driveType, sortOrder: 2 },
            { label: "Body", value: vehicle.bodyStyle, sortOrder: 3 },
          ],
        },
      },
    });
  }

  const legacyWelcome = await prisma.article.findUnique({ where: { slug: "welcome-to-aristo" } });
  if (legacyWelcome) {
    await prisma.article.update({
      where: { id: legacyWelcome.id },
      data: {
        title: "Welcome to Fellah Express LLC",
        slug: "welcome-to-fellah-express",
        excerpt: "Discover how we curate premium vehicles and ownership experiences in Columbus.",
        content:
          "Fellah Express LLC brings boutique dealership standards to Central Ohio. Every vehicle is inspected, priced transparently, and supported with financing, trade-in, and delivery options.",
      },
    });
  }

  await prisma.article.upsert({
    where: { slug: "welcome-to-fellah-express" },
    update: {
      title: "Welcome to Fellah Express LLC",
      content:
        "Fellah Express LLC brings boutique dealership standards to Central Ohio. Every vehicle is inspected, priced transparently, and supported with financing, trade-in, and delivery options.",
    },
    create: {
      title: "Welcome to Fellah Express LLC",
      slug: "welcome-to-fellah-express",
      excerpt: "Discover how we curate premium vehicles and ownership experiences in Columbus.",
      content:
        "Fellah Express LLC brings boutique dealership standards to Central Ohio. Every vehicle is inspected, priced transparently, and supported with financing, trade-in, and delivery options.",
      coverImage:
        "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=1400&q=80",
      published: true,
      publishedAt: new Date(),
    },
  });

  console.log(`Seed complete. Admin login: ${email} / ${password}`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
