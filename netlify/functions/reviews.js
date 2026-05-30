import { getStore } from "@netlify/blobs";

const headers = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, x-admin-token",
  "Content-Type": "application/json",
};

// Public review wall storage with moderation.
// New reviews are stored as pending (approved:false) and only show
// publicly once an admin approves them. Admin actions require the
// REVIEW_ADMIN_TOKEN environment variable via the x-admin-token header.
export default async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("", { status: 204, headers });
  }

  const store = getStore("reviews");
  const adminToken = process.env.REVIEW_ADMIN_TOKEN || "";
  const isAdmin = !!adminToken && req.headers.get("x-admin-token") === adminToken;

  async function getAll() {
    const { blobs } = await store.list();
    const items = await Promise.all(
      blobs.map((b) => store.get(b.key, { type: "json" }).catch(() => null))
    );
    return items.filter(Boolean).sort((a, b) => b.ts - a.ts);
  }

  // GET — public: approved only. Admin (?all=1 + valid token): everything.
  if (req.method === "GET") {
    try {
      const url = new URL(req.url);
      if (url.searchParams.get("all") === "1") {
        if (!isAdmin) {
          return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers });
        }
        return new Response(JSON.stringify({ reviews: await getAll() }), { headers });
      }
      const approved = (await getAll()).filter((r) => r.approved).slice(0, 100);
      return new Response(JSON.stringify({ reviews: approved }), { headers });
    } catch (err) {
      console.error("reviews GET error:", err);
      return new Response(JSON.stringify({ reviews: [] }), { headers });
    }
  }

  if (req.method === "POST") {
    try {
      const body = await req.json();

      // Admin actions: approve / delete (token required)
      if (body.action) {
        if (!isAdmin) {
          return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers });
        }
        const id = String(body.id || "");
        if (!id) {
          return new Response(JSON.stringify({ error: "Missing id" }), { status: 400, headers });
        }
        if (body.action === "approve") {
          const r = await store.get(id, { type: "json" }).catch(() => null);
          if (!r) {
            return new Response(JSON.stringify({ error: "Not found" }), { status: 404, headers });
          }
          r.approved = true;
          await store.setJSON(id, r);
          return new Response(JSON.stringify({ ok: true }), { headers });
        }
        if (body.action === "delete") {
          await store.delete(id);
          return new Response(JSON.stringify({ ok: true }), { headers });
        }
        return new Response(JSON.stringify({ error: "Unknown action" }), { status: 400, headers });
      }

      // Public submit — stored as pending (approved:false)
      if (body.botField) {
        return new Response(JSON.stringify({ ok: true }), { headers });
      }
      const rating = parseInt(body.rating, 10);
      const comment = String(body.comment || "").trim().slice(0, 1000);
      const university = String(body.university || "").trim().slice(0, 120);

      if (!(rating >= 1 && rating <= 5) || !comment) {
        return new Response(
          JSON.stringify({ error: "A star rating and a comment are required." }),
          { status: 400, headers }
        );
      }

      const ts = Date.now();
      const id = `${ts}-${Math.random().toString(36).slice(2, 8)}`;
      const review = { id, rating, comment, university, ts, approved: false };
      await store.setJSON(id, review);

      return new Response(JSON.stringify({ ok: true, pending: true }), { headers });
    } catch (err) {
      console.error("reviews POST error:", err);
      return new Response(
        JSON.stringify({ error: "Could not save your review. Please try again." }),
        { status: 500, headers }
      );
    }
  }

  return new Response("Method not allowed", { status: 405, headers });
};
