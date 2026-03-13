export const runtime = "edge";

import type { NextRequest } from "next/server";

interface KVNamespace {
  get(key: string): Promise<string | null>;
  put(key: string, value: string): Promise<void>;
}

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Content-Type": "application/json",
};

export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}

export async function GET() {
  return new Response(JSON.stringify({ ok: true, route: "/api/waitlist" }), {
    status: 200,
    headers: CORS,
  });
}

export async function POST(request: NextRequest) {
  try {
    const kv = (process.env as unknown as { CLUBA_WAITLIST: KVNamespace }).CLUBA_WAITLIST;

    if (!kv) {
      return new Response(
        JSON.stringify({ error: "KV binding not found: CLUBA_WAITLIST" }),
        { status: 500, headers: CORS }
      );
    }

    const body = await request.json() as { email?: string; source?: string; locale?: string };
    const email = (body.email || "").trim().toLowerCase();

    if (!email || !email.includes("@") || email.length < 3) {
      return new Response(
        JSON.stringify({ error: "Invalid email" }),
        { status: 400, headers: CORS }
      );
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

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: CORS,
    });
  } catch (err) {
    return new Response(
      JSON.stringify({ error: String(err) }),
      { status: 500, headers: CORS }
    );
  }
}
