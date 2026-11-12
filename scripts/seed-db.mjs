import "./env.mjs";
import { readFileSync } from "node:fs";
import path from "node:path";
import { DatabaseSync } from "node:sqlite";
import {
  createTurso,
  localDatabasePath,
  schemaForRemote,
} from "./db.mjs";

const schemaPath = path.join(process.cwd(), "db", "schema.sql");
const seedPath = path.join(process.cwd(), "db", "seed.sql");
const turso = createTurso();

if (turso) {
  await turso.executeMultiple(schemaForRemote(schemaPath));
  await turso.executeMultiple(readFileSync(seedPath, "utf8"));
  turso.close();
  console.log("Seeded demo applications into Turso.");
  process.exit(0);
}

const databasePath = localDatabasePath();

const db = new DatabaseSync(databasePath);
db.exec(readFileSync(schemaPath, "utf8"));
db.exec(readFileSync(seedPath, "utf8"));
db.close();

console.log(`Seeded demo applications into ${databasePath}`);
