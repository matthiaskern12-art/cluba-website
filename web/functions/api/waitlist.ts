type WaitlistKV = {
  get(key: string): Promise<string | null>;
  put(key: string, value: string): Promise<void>;
  delete?(key: string): Promise<void>;
};

type Env = {
  WAITLIST_KV: WaitlistKV;
};

type PagesContext<TEnv> = {
  request: Request;
  env: TEnv;
};

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'content-type': 'application/json',
    },
  });
}

function isValidEmail(email: string) {
  if (email.length < 3 || email.length > 320) return false;

  const at = email.indexOf('@');
  const dot = email.lastIndexOf('.');

  return at > 0 && dot > at + 1 && dot < email.length - 1;
}

export const onRequestGet = async () => {
  return json({ ok: true, route: '/api/waitlist' }, 200);
};

export const onRequestPost = async ({ request, env }: PagesContext<Env>) => {
  try {
    const contentType = request.headers.get('content-type') || '';

    if (!contentType.includes('application/json')) {
      return json({ ok: false, error: 'Expected JSON' }, 415);
    }

    const body = (await request.json()) as {
      email?: string;
      source?: string;
    };

    const email = (body.email || '').trim().toLowerCase();

    if (!isValidEmail(email)) {
      return json({ ok: false, error: 'Invalid email' }, 400);
    }

    const key = `waitlist:${email}`;
    const existing = await env.WAITLIST_KV.get(key);

    if (!existing) {
      await env.WAITLIST_KV.put(
        key,
        JSON.stringify({
          email,
          source: (body.source || 'homepage').slice(0, 80),
          createdAt: new Date().toISOString(),
        })
      );
    }

    return json({ ok: true }, 200);
  } catch {
    return json({ ok: false, error: 'Server error' }, 500);
  }
};