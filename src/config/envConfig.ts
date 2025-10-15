import { getEnv } from "@/lib/env/getEnv";

export const env = {
  DATABASE_URL: getEnv("DATABASE_URL", ""),
  NEXT_ENV: getEnv("NEXT_ENV", "production"),
};
