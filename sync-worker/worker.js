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
    const key = 'shift-board-data';

    if (request.method === 'GET' && url.pathname === '/data') {
      const data = await env.SHIFT_DATA.get(key);
      return new Response(data || '[]', {
        headers: { ...CORS, 'Content-Type': 'application/json' },
      });
    }

    if (request.method === 'POST' && url.pathname === '/data') {
      const body = await request.text();
      JSON.parse(body);
      await env.SHIFT_DATA.put(key, body);
      return new Response(JSON.stringify({ ok: true }), {
        headers: { ...CORS, 'Content-Type': 'application/json' },
      });
    }

    return new Response('Not Found', { status: 404, headers: CORS });
  },
};
