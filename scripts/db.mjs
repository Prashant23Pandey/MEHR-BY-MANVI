import "./env.mjs";
import { readFileSync } from "node:fs";
import path from "node:path";
import { createClient } from "@libsql/client";

export function tursoUrl() {
  return process.env.TURSO_DATABASE_URL?.trim() || null;
}

export function tursoAuthToken() {
  return process.env.TURSO_AUTH_TOKEN?.trim() || undefined;
}

export function localDatabasePath() {
  return (
    process.env.DATABASE_PATH?.trim() ||
    path.join(process.cwd(), "data", "pear.db")
  );
}

export function createTurso() {
  const url = tursoUrl();
  if (!url) return null;
  return createClient({ url, authToken: tursoAuthToken() });
}

export function schemaForRemote(schemaPath) {
  return readFileSync(schemaPath, "utf8")
    .split(/\r?\n/)
    .filter((line) => !/^\s*PRAGMA\b/i.test(line))
    .join("\n")
    .trim();
}

export function seedSql(seedPath) {
  return readFileSync(seedPath, "utf8");
}
