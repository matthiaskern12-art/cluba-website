export const runtime = "edge";

import { NextRequest, NextResponse } from "next/server";
import { getCloudflareContext } from "@opennextjs/cloudflare";

interface KVNamespace {
  get(key: string): Promise<string | null>;
  put(key: string, value: string): Promise<void>;
}

function isValidEmail(email: string) {
  if (email.length < 3 || email.length > 320) return false;
  const at = email.indexOf("@");
  const dot = email.lastIndexOf(".");
  return at > 0 && dot > at + 1 && dot < email.length - 1;
}

export async function GET() {
  return NextResponse.json({ ok: true, route: "/api/waitlist" });
}

export async function POST(request: NextRequest) {
  try {
    const contentType = request.headers.get("content-type") || "";
    if (!contentType.includes("application/json")) {
      return NextResponse.json({ ok: false, error: "Expected JSON" }, { status: 415 });
    }

    const body = (await request.json()) as { email?: string; source?: string; locale?: string };
    const email = (body.email || "").trim().toLowerCase();

    if (!isValidEmail(email)) {
      return NextResponse.json({ ok: false, error: "Invalid email" }, { status: 400 });
    }

    const { env } = getCloudflareContext();
    const kv = (env as unknown as { CLUBA_WAITLIST: KVNamespace }).CLUBA_WAITLIST;

    if (!kv) {
      console.error("CLUBA_WAITLIST not found in env — check wrangler.toml binding name");
      return NextResponse.json({ ok: false, error: "Storage unavailable: CLUBA_WAITLIST binding missing" }, { status: 500 });
    }

    const key = `waitlist:${email}`;

    let existing: string | null = null;
    try {
      existing = await kv.get(key);
    } catch (err) {
      console.error("KV get error:", err);
      return NextResponse.json({ ok: false, error: `KV read failed: ${String(err)}` }, { status: 500 });
    }

    if (!existing) {
      try {
        await kv.put(
          key,
          JSON.stringify({
            email,
            source: (body.source || "homepage").slice(0, 80),
            locale: body.locale === "de" ? "de" : "en",
            createdAt: new Date().toISOString(),
          })
        );
      } catch (err) {
        console.error("KV put error:", err);
        return NextResponse.json({ ok: false, error: `KV write failed: ${String(err)}` }, { status: 500 });
      }
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Waitlist error:", err);
    return NextResponse.json({ ok: false, error: `Server error: ${String(err)}` }, { status: 500 });
  }
}
