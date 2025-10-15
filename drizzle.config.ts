import { env } from "@/config/envConfig";
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./src/db/schemas/drizzle.ts",
  out: "./migrations",
  dialect: "postgresql",
  dbCredentials: {
    url: env.DATABASE_URL!,
  },
});
