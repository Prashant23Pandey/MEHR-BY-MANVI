import { NextResponse } from "next/server";
import {
  countRecentApplications,
  hashIp,
  insertApplication,
} from "@/lib/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 5;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

type Payload = {
  name?: unknown;
  email?: unknown;
  grow?: unknown;
  fax?: unknown;
  token?: unknown;
};

function clean(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function getIp(request: Request) {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0]?.trim() ?? null;
  return request.headers.get("x-real-ip");
}

function sameOrigin(request: Request) {
  const origin = request.headers.get("origin");
  if (!origin) return true;
  try {
    const originUrl = new URL(origin);
    const host = request.headers.get("host");
    return originUrl.host === host;
  } catch {
    return false;
  }
}

async function verifyTurnstile(token: string, ip: string | null) {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) return true;
  if (!token) return false;

  const body = new URLSearchParams();
  body.set("secret", secret);
  body.set("response", token);
  if (ip) body.set("remoteip", ip);

  const response = await fetch(
    "https://challenges.cloudflare.com/turnstile/v0/siteverify",
    { method: "POST", body, cache: "no-store" },
  );
  if (!response.ok) return false;
  const result = (await response.json()) as { success?: boolean };
  return result.success === true;
}

async function notifyWebhook(record: {
  id: number;
  name: string;
  email: string;
  grow: string;
  created_at: string;
}) {
  const url = process.env.APPLICATION_WEBHOOK_URL;
  if (!url) return;
  try {
    await fetch(url, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ type: "pear.application", application: record }),
    });
  } catch (error) {
    console.error("Application webhook failed", error);
  }
}

export async function POST(request: Request) {
  if (!sameOrigin(request)) {
    return NextResponse.json(
      { ok: false, error: "Invalid origin." },
      { status: 403 },
    );
  }

  let payload: Payload;
  try {
    payload = (await request.json()) as Payload;
  } catch {
    return NextResponse.json(
      { ok: false, error: "Invalid request body." },
      { status: 400 },
    );
  }

  const name = clean(payload.name);
  const email = clean(payload.email).toLowerCase();
  const grow = clean(payload.grow);
  const fax = clean(payload.fax);
  const token = clean(payload.token);

  if (fax) {
    return NextResponse.json({ ok: true, id: null }, { status: 201 });
  }

  const errors: Record<string, string> = {};
  if (name.length < 2 || name.length > 120) {
    errors.name = "Tell us your name (2–120 characters).";
  }
  if (!EMAIL_RE.test(email) || email.length > 254) {
    errors.email = "Enter a valid work email.";
  }
  if (grow.length < 10 || grow.length > 5000) {
    errors.grow = "Tell us a little about what you sell and where you want to grow (10–5000 characters).";
  }

  if (Object.keys(errors).length > 0) {
    return NextResponse.json(
      { ok: false, error: "Please check the form.", fields: errors },
      { status: 400 },
    );
  }

  const ip = getIp(request);
  const ipHash = hashIp(ip);

  if ((await countRecentApplications(ipHash, WINDOW_MS)) >= MAX_PER_WINDOW) {
    return NextResponse.json(
      { ok: false, error: "Too many applications. Try again later." },
      { status: 429 },
    );
  }

  let turnstileOk = false;
  try {
    turnstileOk = await verifyTurnstile(token, ip);
  } catch (error) {
    console.error("Turnstile verification failed", error);
  }
  if (!turnstileOk) {
    return NextResponse.json(
      { ok: false, error: "Verification failed. Refresh the page and try again." },
      { status: 400 },
    );
  }

  try {
    const record = await insertApplication({
      name,
      email,
      grow,
      ipHash,
      userAgent: request.headers.get("user-agent"),
      referer: request.headers.get("referer"),
      source: "web",
    });

    await notifyWebhook({
      id: record.id,
      name: record.name,
      email: record.email,
      grow: record.grow,
      created_at: record.created_at,
    });

    return NextResponse.json(
      { ok: true, id: record.id, receivedAt: record.created_at },
      { status: 201 },
    );
  } catch (error) {
    console.error("Application could not be stored", error);
    return NextResponse.json(
      { ok: false, error: "The application could not be saved. Email info@pear.no." },
      { status: 500 },
    );
  }
}
