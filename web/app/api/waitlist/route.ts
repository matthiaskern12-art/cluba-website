import { NextRequest, NextResponse } from "next/server";

interface CLUBA_WAITLISTNamespace {
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

    const kv = (globalThis as unknown as { CLUBA_WAITLIST: CLUBA_WAITLISTNamespace }).CLUBA_WAITLIST;

    if (!kv) {
      console.error("CLUBA_WAITLIST not available — check wrangler.toml binding name");
      return NextResponse.json({ ok: false, error: "Storage unavailable" }, { status: 500 });
    }

    const key = `waitlist:${email}`;
    const existing = await kv.get(key);

    if (!existing) {
      await kv.put(
        key,
        JSON.stringify({
          email,
          source: (body.source || "homepage").slice(0, 80),
          locale: body.locale === "de" ? "de" : "en",
          createdAt: new Date().toISOString(),
        })
      );
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Waitlist error:", err);
    return NextResponse.json({ ok: false, error: "Server error" }, { status: 500 });
  }
}

export const runtime = "edge";
