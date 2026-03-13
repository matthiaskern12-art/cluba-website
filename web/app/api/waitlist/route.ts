export const runtime = "edge";

import type { NextRequest } from "next/server";

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Content-Type": "application/json",
};

export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}

export async function POST(req: NextRequest) {
  try {
    // @ts-ignore
    const kv = process.env.CLUBA_WAITLIST as any;

    if (!kv) {
      return new Response(
        JSON.stringify({ error: "KV_NOT_BOUND" }),
        { status: 500, headers: CORS }
      );
    }

    const { email } = await req.json();
    if (!email?.includes("@")) {
      return new Response(
        JSON.stringify({ error: "INVALID_EMAIL" }),
        { status: 400, headers: CORS }
      );
    }

    const key = `email:${Date.now()}`;
    await kv.put(key, JSON.stringify({
      email: email.trim().toLowerCase(),
      ts: new Date().toISOString(),
    }));

    return new Response(
      JSON.stringify({ ok: true }),
      { status: 200, headers: CORS }
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ error: String(err) }),
      { status: 500, headers: CORS }
    );
  }
}
