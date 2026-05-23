/**
 * Prisma 6+ config file.
 *
 * Replaces the deprecated `prisma` block in `package.json`. Required because
 * Prisma 6 stops auto-loading `.env` for the CLI — we explicitly import
 * `dotenv/config` so `DATABASE_URL` (and any other env-driven fields in
 * `schema.prisma`) resolve when running `prisma generate / migrate / db push /
 * seed`.
 *
 * Docs: https://pris.ly/prisma-config
 */
import "dotenv/config";
import path from "node:path";
import type { PrismaConfig } from "prisma";

export default {
  schema: path.join("prisma", "schema.prisma"),
  migrations: {
    seed: "tsx prisma/seed.ts",
  },
} satisfies PrismaConfig;
