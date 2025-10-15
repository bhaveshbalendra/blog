// Logger utility that respects environment
import { env } from "@/config/envConfig";

export const logger = {
  log: (...args: unknown[]) => {
    if (env.NEXT_ENV === "development") {
      console.log(...args);
    }
  },
  warn: (...args: unknown[]) => {
    if (env.NEXT_ENV === "development") {
      console.warn(...args);
    }
  },
  error: (...args: unknown[]) => {
    // Always log errors, even in production
    console.error(...args);
  },
  info: (...args: unknown[]) => {
    if (env.NEXT_ENV === "development") {
      console.info(...args);
    }
  },
  debug: (...args: unknown[]) => {
    if (env.NEXT_ENV === "development") {
      console.debug(...args);
    }
  },
};

// For production builds
if (env.NEXT_ENV === "production") {
  // Uncomment the lines below to completely disable console in production
  // console.log = () => {};
  // console.warn = () => {};
  // console.info = () => {};
  // console.debug = () => {};
}
