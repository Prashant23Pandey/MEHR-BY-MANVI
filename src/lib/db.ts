import { createHash } from "node:crypto";
import { mkdirSync } from "node:fs";
import path from "node:path";
import { DatabaseSync } from "node:sqlite";
import { createClient, type Client } from "@libsql/client";

export type ApplicationRecord = {
  id: number;
  name: string;
  email: string;
  grow: string;
  ip_hash: string | null;
  user_agent: string | null;
  referer: string | null;
  source: string;
  status: string;
  created_at: string;
};

export type NewApplication = {
  name: string;
  email: string;
  grow: string;
  ipHash: string | null;
  userAgent: string | null;
  referer: string | null;
  source?: string;
};

const tursoUrl = process.env.TURSO_DATABASE_URL?.trim();
const tursoAuthToken = process.env.TURSO_AUTH_TOKEN?.trim();
const databasePath =
  process.env.DATABASE_PATH?.trim() || path.join(process.cwd(), "data", "pear.db");

const SCHEMA_SQL = `
  CREATE TABLE IF NOT EXISTS applications (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    grow TEXT NOT NULL,
    ip_hash TEXT,
    user_agent TEXT,
    referer TEXT,
    source TEXT NOT NULL DEFAULT 'web',
    status TEXT NOT NULL DEFAULT 'new',
    created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
  );

  CREATE INDEX IF NOT EXISTS idx_applications_created_at
    ON applications (created_at);
  CREATE INDEX IF NOT EXISTS idx_applications_ip_created
    ON applications (ip_hash, created_at);
  CREATE INDEX IF NOT EXISTS idx_applications_email
    ON applications (email);
`;

let localDb: DatabaseSync | null = null;
let remoteDb: Promise<Client> | null = null;

function migrateLocal(db: DatabaseSync) {
  db.exec("PRAGMA journal_mode = WAL;");
  db.exec("PRAGMA foreign_keys = ON;");
  db.exec(SCHEMA_SQL);
}

function getLocalDb() {
  if (!localDb) {
    mkdirSync(path.dirname(databasePath), { recursive: true });
    localDb = new DatabaseSync(databasePath);
    migrateLocal(localDb);
  }
  return localDb;
}

function getRemoteDb() {
  if (!remoteDb) {
    remoteDb = (async () => {
      if (!tursoUrl) throw new Error("TURSO_DATABASE_URL is not configured");
      const client = createClient({
        url: tursoUrl,
        authToken: tursoAuthToken || undefined,
      });
      await client.executeMultiple(SCHEMA_SQL);
      return client;
    })().catch((error) => {
      remoteDb = null;
      throw error;
    });
  }
  return remoteDb;
}

function toRecord(row: Record<string, unknown>): ApplicationRecord {
  return {
    id: Number(row.id),
    name: String(row.name),
    email: String(row.email),
    grow: String(row.grow),
    ip_hash: row.ip_hash == null ? null : String(row.ip_hash),
    user_agent: row.user_agent == null ? null : String(row.user_agent),
    referer: row.referer == null ? null : String(row.referer),
    source: String(row.source),
    status: String(row.status),
    created_at: String(row.created_at),
  };
}

export function hashIp(ip: string | null) {
  if (!ip) return null;
  const salt = process.env.IP_HASH_SALT || "pear-local";
  return createHash("sha256").update(`${salt}:${ip}`).digest("hex");
}

export async function insertApplication(
  input: NewApplication,
): Promise<ApplicationRecord> {
  const values = [
    input.name,
    input.email,
    input.grow,
    input.ipHash,
    input.userAgent,
    input.referer,
    input.source ?? "web",
  ];

  if (tursoUrl) {
    const db = await getRemoteDb();
    const result = await db.execute({
      sql: `
        INSERT INTO applications (name, email, grow, ip_hash, user_agent, referer, source)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `,
      args: values,
    });
    const id = Number(result.lastInsertRowid);
    const selected = await db.execute({
      sql: "SELECT * FROM applications WHERE id = ?",
      args: [id],
    });
    const row = selected.rows[0];
    if (!row) throw new Error("Application could not be read back");
    return toRecord(row);
  }

  const db = getLocalDb();
  const result = db
    .prepare(
      `
        INSERT INTO applications (name, email, grow, ip_hash, user_agent, referer, source)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `,
    )
    .run(...values);
  const id = Number(result.lastInsertRowid);
  const record = db
    .prepare("SELECT * FROM applications WHERE id = ?")
    .get(id) as Record<string, unknown> | undefined;
  if (!record) throw new Error("Application could not be read back");
  return toRecord(record);
}

export async function countRecentApplications(
  ipHash: string | null,
  windowMs: number,
) {
  if (!ipHash) return 0;
  const since = new Date(Date.now() - windowMs).toISOString();

  if (tursoUrl) {
    const db = await getRemoteDb();
    const result = await db.execute({
      sql: "SELECT COUNT(*) AS count FROM applications WHERE ip_hash = ? AND created_at > ?",
      args: [ipHash, since],
    });
    return Number(result.rows[0]?.count ?? 0);
  }

  const db = getLocalDb();
  const row = db
    .prepare(
      "SELECT COUNT(*) AS count FROM applications WHERE ip_hash = ? AND created_at > ?",
    )
    .get(ipHash, since) as { count: number } | undefined;
  return row?.count ?? 0;
}

export async function listApplications(limit = 50): Promise<ApplicationRecord[]> {
  if (tursoUrl) {
    const db = await getRemoteDb();
    const result = await db.execute({
      sql: "SELECT * FROM applications ORDER BY id DESC LIMIT ?",
      args: [limit],
    });
    return result.rows.map((row) => toRecord(row));
  }

  const db = getLocalDb();
  const rows = db
    .prepare("SELECT * FROM applications ORDER BY id DESC LIMIT ?")
    .all(limit) as Record<string, unknown>[];
  return rows.map(toRecord);
}
