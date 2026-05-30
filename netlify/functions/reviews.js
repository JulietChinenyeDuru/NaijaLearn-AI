import { getStore } from "@netlify/blobs";

const headers = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
  "Content-Type": "application/json",
};

// Public review wall storage — reviews live in a Netlify Blobs store.
export default async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("", { status: 204, headers });
  }

  const store = getStore("reviews");

  // GET — return all reviews, newest first
  if (req.method === "GET") {
    try {
      const { blobs } = await store.list();
      const items = await Promise.all(
        blobs.map((b) => store.get(b.key, { type: "json" }).catch(() => null))
      );
      const reviews = items
        .filter(Boolean)
        .sort((a, b) => b.ts - a.ts)
        .slice(0, 100);
      return new Response(JSON.stringify({ reviews }), { headers });
    } catch (err) {
      console.error("reviews GET error:", err);
      return new Response(JSON.stringify({ reviews: [] }), { headers });
    }
  }

  // POST — save a new review
  if (req.method === "POST") {
    try {
      const body = await req.json();

      // Honeypot — silently accept bots without storing anything
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
      const review = { id, rating, comment, university, ts };
      await store.setJSON(id, review);

      return new Response(JSON.stringify({ ok: true, review }), { headers });
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
