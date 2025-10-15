import z from "@/lib/zod";

export const envSchema = z.object({
  DATABASE_URL: z.string(),
  NEXT_ENV: z.enum(["development", "production"]),
});
