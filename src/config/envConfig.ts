import { getEnv } from "@/lib/getEnv";

export const env = {
  DATABASE_URL: getEnv("DATABASE_URL", ""),
};
