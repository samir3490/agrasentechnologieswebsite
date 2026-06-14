import fs from "fs";
import path from "path";
import { spawnSync } from "child_process";

const ripEnvPath = path.resolve(process.cwd(), "..", "rip", ".env.local");
const envText = fs.readFileSync(ripEnvPath, "utf8");
const env = {};

for (const line of envText.split(/\r?\n/)) {
  const trimmed = line.trim();
  if (!trimmed || trimmed.startsWith("#")) continue;
  const eq = trimmed.indexOf("=");
  if (eq === -1) continue;
  const key = trimmed.slice(0, eq);
  let value = trimmed.slice(eq + 1);
  if (
    (value.startsWith('"') && value.endsWith('"')) ||
    (value.startsWith("'") && value.endsWith("'"))
  ) {
    value = value.slice(1, -1);
  }
  env[key] = value;
}

env.NEXT_PUBLIC_APP_URL = "https://agrasentechnologies.com";

const keys = [
  ...Object.keys(env).filter((k) => k.startsWith("NEXT_PUBLIC_FIREBASE_")),
  "FIREBASE_ADMIN_PROJECT_ID",
  "FIREBASE_ADMIN_CLIENT_EMAIL",
  "FIREBASE_ADMIN_PRIVATE_KEY",
  "NEXT_PUBLIC_APP_URL",
];

for (const key of keys) {
  const value = env[key];
  if (!value) continue;
  spawnSync("npx", ["vercel", "env", "rm", key, "production", "-y"], {
    cwd: process.cwd(),
    stdio: "inherit",
    shell: true,
  });
  const result = spawnSync("npx", ["vercel", "env", "add", key, "production"], {
    cwd: process.cwd(),
    input: value,
    stdio: ["pipe", "inherit", "inherit"],
    shell: true,
  });
  if (result.status !== 0) {
    console.error(`Failed to set ${key}`);
    process.exit(result.status ?? 1);
  }
  console.log(`Set ${key}`);
}

console.log("ARM env vars synced to agrasen-technologies production.");
