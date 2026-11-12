import { existsSync } from "node:fs";
import path from "node:path";

const nodeEnv = process.env.NODE_ENV;
const files = [
  nodeEnv ? `.env.${nodeEnv}.local` : null,
  ".env.local",
  nodeEnv ? `.env.${nodeEnv}` : null,
  ".env",
].filter(Boolean);

for (const file of files) {
  const fullPath = path.join(process.cwd(), file);
  if (existsSync(fullPath)) process.loadEnvFile(fullPath);
}
