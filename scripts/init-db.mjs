import "./env.mjs";
import { mkdirSync, readFileSync } from "node:fs";
import path from "node:path";
import { DatabaseSync } from "node:sqlite";
import {
  createTurso,
  localDatabasePath,
  schemaForRemote,
} from "./db.mjs";

const schemaPath = path.join(process.cwd(), "db", "schema.sql");
const turso = createTurso();

if (turso) {
  await turso.executeMultiple(schemaForRemote(schemaPath));
  turso.close();
  console.log("Turso database ready.");
  process.exit(0);
}

const databasePath = localDatabasePath();

mkdirSync(path.dirname(databasePath), { recursive: true });
const db = new DatabaseSync(databasePath);
db.exec(readFileSync(schemaPath, "utf8"));
db.close();

console.log(`Database ready: ${databasePath}`);
