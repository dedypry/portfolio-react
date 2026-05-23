/**
 * Seed script — migrates the static portfolio data (`data/portfolio.ts` +
 * `i18n/locales/{en,id}.ts`) into the database, and creates the initial
 * admin user.
 *
 * Idempotent: safe to run multiple times. Uses upsert with stable keys.
 *
 * Run via: `npm run db:seed`
 */
import "dotenv/config";

import { PrismaClient, type ExperienceType as DbExperienceType } from "@prisma/client";
import bcrypt from "bcryptjs";

import {
  experienceIds,
  experiencesMeta,
  profile as profileData,
  projectIds,
  projectsMeta,
  skillGroupItems,
  skillGroupIds,
  type ExperienceId,
  type ProjectId,
  type SkillGroupId,
} from "../data/portfolio";
import { en } from "../i18n/locales/en";
import { id } from "../i18n/locales/id";

const prisma = new PrismaClient();

const TYPE_MAP: Record<string, DbExperienceType> = {
  fulltime: "FULL_TIME",
  freelance: "FREELANCE",
  projectBased: "CONTRACT",
};

async function seedAdminUser() {
  const email = (process.env.ADMIN_EMAIL ?? "admin@dedypry.site").toLowerCase();
  const password = process.env.ADMIN_PASSWORD ?? "changeme123";
  const name = process.env.ADMIN_NAME ?? "Dedy Priyatna";

  const hash = await bcrypt.hash(password, 12);

  const user = await prisma.user.upsert({
    where: { email },
    create: { email, name, passwordHash: hash, role: "ADMIN" },
    update: { name },
  });

  console.log(`✓ Admin user ready: ${user.email}`);
  return user;
}

async function seedProfile() {
  const existing = await prisma.profile.findFirst();
  const data = {
    name: profileData.name,
    initials: profileData.initials,
    email: profileData.email,
    phone: profileData.phone,
    location: profileData.location,
    linkedin: profileData.linkedin,
    github: profileData.github,
    available: profileData.available,
    translations: {
      en: {
        role: en.about.role,
        tagline: en.about.tagline,
        description: en.about.description,
        headlineLine1: en.hero.headlineLine1,
        headlineHighlight: en.hero.headlineHighlight,
      },
      id: {
        role: id.about.role,
        tagline: id.about.tagline,
        description: id.about.description,
        headlineLine1: id.hero.headlineLine1,
        headlineHighlight: id.hero.headlineHighlight,
      },
    },
  };

  if (existing) {
    await prisma.profile.update({ where: { id: existing.id }, data });
    console.log("✓ Profile updated.");
  } else {
    await prisma.profile.create({ data });
    console.log("✓ Profile created.");
  }
}

async function seedExperiences() {
  for (const [idx, key] of experienceIds.entries()) {
    const meta = experiencesMeta[key as ExperienceId];
    const enCopy = en.experience.items[key as ExperienceId];
    const idCopy = id.experience.items[key as ExperienceId];

    const baseLookup = await prisma.experience.findFirst({
      where: { company: enCopy.company, period: enCopy.period },
    });

    const data = {
      company: enCopy.company,
      location: enCopy.location,
      period: enCopy.period,
      type: TYPE_MAP[meta.type] ?? "FULL_TIME",
      stack: meta.stack ?? [],
      order: idx,
      translations: {
        en: { role: enCopy.role, highlights: enCopy.highlights },
        id: { role: idCopy.role, highlights: idCopy.highlights },
      },
    };

    if (baseLookup) {
      await prisma.experience.update({ where: { id: baseLookup.id }, data });
    } else {
      await prisma.experience.create({ data });
    }
  }
  console.log(`✓ Seeded ${experienceIds.length} experiences.`);
}

async function seedProjects() {
  for (const [idx, key] of projectIds.entries()) {
    const meta = projectsMeta[key as ProjectId];
    const enCopy = en.projects.items[key as ProjectId];
    const idCopy = id.projects.items[key as ProjectId];

    const baseLookup = await prisma.project.findFirst({
      where: {
        AND: [
          {
            translations: {
              path: ["en", "name"],
              equals: enCopy.name,
            },
          },
        ],
      },
    });

    const data = {
      category: meta.category,
      accent: meta.accent,
      link: meta.link ?? null,
      stack: meta.stack,
      coverImage: null,
      order: idx,
      featured: idx < 3,
      translations: {
        en: enCopy,
        id: idCopy,
      },
    };

    if (baseLookup) {
      await prisma.project.update({ where: { id: baseLookup.id }, data });
    } else {
      await prisma.project.create({ data });
    }
  }
  console.log(`✓ Seeded ${projectIds.length} projects.`);
}

async function seedEducation() {
  const enEdu = en.skills.education;
  const idEdu = id.skills.education;

  const existing = await prisma.education.findFirst({
    where: { school: enEdu.school, period: enEdu.period },
  });

  const data = {
    school: enEdu.school,
    location: enEdu.location,
    period: enEdu.period,
    order: 0,
    translations: {
      en: { degree: enEdu.degree, description: "" },
      id: { degree: idEdu.degree, description: "" },
    },
  };

  if (existing) {
    await prisma.education.update({ where: { id: existing.id }, data });
  } else {
    await prisma.education.create({ data });
  }
  console.log("✓ Seeded education.");
}

async function seedSkills() {
  for (const [idx, groupKey] of skillGroupIds.entries()) {
    const items = skillGroupItems[groupKey as SkillGroupId];
    // Practices come from the i18n files instead of `data/portfolio.ts`.
    const skills =
      groupKey === "practices" ? en.skills.practices : items;

    const titleEn = en.skills.groupTitles[groupKey as SkillGroupId];
    const titleId = id.skills.groupTitles[groupKey as SkillGroupId];

    const group = await prisma.skillGroup.upsert({
      where: { key: groupKey },
      create: {
        key: groupKey,
        order: idx,
        translations: { en: { title: titleEn }, id: { title: titleId } },
      },
      update: {
        order: idx,
        translations: { en: { title: titleEn }, id: { title: titleId } },
      },
    });

    // Wipe & re-create skills to mirror current data exactly.
    await prisma.skill.deleteMany({ where: { groupId: group.id } });
    await prisma.skill.createMany({
      data: skills.map((name, i) => ({
        name,
        order: i,
        groupId: group.id,
      })),
    });
  }
  console.log(`✓ Seeded ${skillGroupIds.length} skill groups.`);
}

async function seedSampleBlog(authorId: string) {
  const slug = "welcome-to-the-blog";
  const existing = await prisma.blog.findUnique({ where: { slug } });
  if (existing) return;

  await prisma.blog.create({
    data: {
      slug,
      status: "PUBLISHED",
      publishedAt: new Date(),
      tags: ["meta", "intro"],
      readingTime: 1,
      authorId,
      translations: {
        en: {
          title: "Welcome to the blog",
          excerpt:
            "Notes, lessons, and tactics from years of shipping software in production.",
          content:
            "<p>Hello! I'll be sharing practical engineering write-ups here — backend architecture, frontend craft, team leadership, and the occasional war story. Subscribe (or just check back) for more soon.</p>",
        },
        id: {
          title: "Selamat datang di blog",
          excerpt:
            "Catatan, pelajaran, dan taktik dari tahun-tahun mengirim perangkat lunak ke production.",
          content:
            "<p>Halo! Saya akan berbagi tulisan engineering praktis di sini — arsitektur backend, kerajinan frontend, kepemimpinan tim, dan sesekali cerita perang. Mampir lagi untuk artikel baru.</p>",
        },
      },
    },
  });
  console.log(`✓ Seeded sample blog post: /${slug}`);
}

async function main() {
  console.log("\n🌱 Seeding database…\n");
  const admin = await seedAdminUser();
  await seedProfile();
  await seedExperiences();
  await seedProjects();
  await seedEducation();
  await seedSkills();
  await seedSampleBlog(admin.id);
  console.log("\n✅ Done.\n");
}

main()
  .catch((err) => {
    console.error("❌ Seed failed:", err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
