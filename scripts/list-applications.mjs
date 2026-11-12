import "./env.mjs";
import { DatabaseSync } from "node:sqlite";
import { createTurso, localDatabasePath } from "./db.mjs";

const limit = Number(process.argv[2] ?? 50);
const turso = createTurso();

if (turso) {
  const result = await turso.execute({
    sql: "SELECT * FROM applications ORDER BY id DESC LIMIT ?",
    args: [limit],
  });
  const rows = result.rows.map((row) =>
    Object.fromEntries(result.columns.map((column, index) => [column, row[index]])),
  );
  turso.close();
  printRows(rows);
  process.exit(0);
}

const databasePath = localDatabasePath();
const db = new DatabaseSync(databasePath, { readOnly: true });
const rows = db
  .prepare("SELECT * FROM applications ORDER BY id DESC LIMIT ?")
  .all(limit);
db.close();

printRows(rows);

function printRows(rows) {
  if (rows.length === 0) {
    console.log("No applications yet.");
  } else {
    console.table(rows);
  }
}
