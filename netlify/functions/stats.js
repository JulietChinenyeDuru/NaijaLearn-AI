import { getStore } from "@netlify/blobs";

const headers = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
  "Content-Type": "application/json",
};

const KEY = "metrics";
const WINDOW = 300000; // 5 minutes — how long a visitor counts as "online"

function blank() {
  return { views: 0, visitors: 0, presence: {} };
}
function countOnline(presence, now) {
  let n = 0;
  for (const k in presence) {
    if (now - presence[k] <= WINDOW) n++;
  }
  return n;
}

// Self-hosted live visitor counter (Netlify Blobs) — no Google Cloud needed.
export default async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("", { status: 204, headers });
  }

  const store = getStore("analytics");
  const now = Date.now();

  try {
    if (req.method === "POST") {
      const body = await req.json().catch(() => ({}));
      const m = (await store.get(KEY, { type: "json", consistency: "strong" }).catch(() => null)) || blank();
      if (!m.presence) m.presence = {};

      // Count a page view only on a real load — not on heartbeats
      if (!body.heartbeat) {
        m.views = (m.views || 0) + 1;
        if (body.newVisitor) m.visitors = (m.visitors || 0) + 1;
      }

      const sid = String(body.sid || "").slice(0, 40);
      if (sid) m.presence[sid] = now;
      for (const k in m.presence) {
        if (now - m.presence[k] > WINDOW) delete m.presence[k];
      }

      await store.setJSON(KEY, m);
      return new Response(
        JSON.stringify({ views: m.views, visitors: m.visitors, online: countOnline(m.presence, now) }),
        { headers }
      );
    }

    // GET — read only, no increment
    const m = (await store.get(KEY, { type: "json" }).catch(() => null)) || blank();
    return new Response(
      JSON.stringify({ views: m.views || 0, visitors: m.visitors || 0, online: countOnline(m.presence || {}, now) }),
      { headers }
    );
  } catch (err) {
    console.error("stats error:", err);
    return new Response(JSON.stringify({ views: 0, visitors: 0, online: 0 }), { headers });
  }
};
