const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

export default {
  async fetch(request, env) {
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: CORS });
    }

    const url = new URL(request.url);
    const key = 'shift-board-v2';

    if (request.method === 'GET' && url.pathname === '/data') {
      const raw = await env.SHIFT_DATA.get(key);
      const result = raw || JSON.stringify({ data: [], version: 0 });
      return new Response(result, {
        headers: { ...CORS, 'Content-Type': 'application/json' },
      });
    }

    if (request.method === 'POST' && url.pathname === '/data') {
      const body = await request.text();
      const parsed = JSON.parse(body);
      if (typeof parsed.version !== 'number' || !Array.isArray(parsed.data)) {
        return new Response(JSON.stringify({ error: 'Invalid format' }), {
          status: 400,
          headers: { ...CORS, 'Content-Type': 'application/json' },
        });
      }
      await env.SHIFT_DATA.put(key, body);
      return new Response(JSON.stringify({ ok: true }), {
        headers: { ...CORS, 'Content-Type': 'application/json' },
      });
    }

    return new Response('Not Found', { status: 404, headers: CORS });
  },
};
