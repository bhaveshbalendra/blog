import { config } from "dotenv";

config({ path: ".env" });

const isEmpty = (value: string) => {
  return (
    !value ||
    value.trim() === "" ||
    value === "undefined" ||
    value === "null" ||
    value === "false" ||
    value === "0" ||
    value === "NaN"
  );
};

export const getEnv = (key: string, defaultValue: string) => {
  const value = process.env[key];
  if (isEmpty(value ?? "")) {
    if (isEmpty(defaultValue)) {
      throw new Error(`Environment variable ${key} is not set`);
    }
    return defaultValue;
  }
  return value;
};
