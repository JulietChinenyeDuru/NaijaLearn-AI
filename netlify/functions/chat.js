import { getStore } from "@netlify/blobs";
import crypto from "node:crypto";

const headers = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
  "Content-Type": "application/json",
};

const MAX_TOKENS = 600;                 // shorter answers => lower output-token cost
const HISTORY_MAX = 8;                  // only send the last 8 messages => lower input cost
const CACHE_TTL = 7 * 24 * 3600 * 1000; // reuse a cached answer for up to 7 days
const PER_DEVICE_DAILY = 25;            // max NEW (uncached) questions per student device per day
const GLOBAL_DAILY = 1000;              // hard daily ceiling on total paid API calls (cost cap)

function reply(text, cache) {
  return new Response(JSON.stringify({ content: [{ text }] }), {
    headers: { ...headers, "X-Cache": cache || "BYPASS" },
  });
}

function cacheKey(system, messages) {
  return crypto.createHash("sha256").update(JSON.stringify({ system, messages })).digest("hex");
}

export default async (req) => {
  if (req.method === "OPTIONS") return new Response("", { status: 204, headers });
  if (req.method !== "POST") return new Response("Method not allowed", { status: 405, headers });

  const API_KEY = process.env.ANTHROPIC_API_KEY;
  if (!API_KEY) return reply("Service configuration error. Please contact support.");

  let body;
  try {
    body = await req.json();
  } catch {
    return reply("Invalid request.");
  }

  const system = body.system;
  let messages = Array.isArray(body.messages) ? body.messages : [];
  // Trim to the most recent turns so input tokens don't grow unbounded
  if (messages.length > HISTORY_MAX) messages = messages.slice(-HISTORY_MAX);

  const cache = getStore("aicache");
  const key = cacheKey(system, messages);

  // 1) Try the cache first — identical question + settings => no API call, no cost, no quota used
  try {
    const hit = await cache.get(key, { type: "json", consistency: "strong" }).catch(() => null);
    if (hit && hit.data && Date.now() - (hit.ts || 0) < CACHE_TTL) {
      return new Response(JSON.stringify(hit.data), { headers: { ...headers, "X-Cache": "HIT" } });
    }
  } catch (e) {
    /* cache read is best-effort */
  }

  // 2) Rate limiting — only paid (uncached) questions count toward the limits
  const usage = getStore("usage");
  const day = new Date().toISOString().slice(0, 10);
  const gKey = "global-" + day;
  const cid = String(body.cid || "anon").slice(0, 60);
  const dKey = "cid-" + cid + "-" + day;
  let g = { count: 0 };
  let d = { count: 0 };
  try {
    g = (await usage.get(gKey, { type: "json", consistency: "strong" }).catch(() => null)) || { count: 0 };
    d = (await usage.get(dKey, { type: "json", consistency: "strong" }).catch(() => null)) || { count: 0 };
  } catch (e) {
    /* if usage store is unavailable, fail open and still answer */
  }
  if (g.count >= GLOBAL_DAILY) {
    return reply("NaijaLearn-AI has reached today's free-usage limit and is resting to stay free for everyone. Please try again tomorrow! 🙏", "LIMIT");
  }
  if (d.count >= PER_DEVICE_DAILY) {
    return reply("You've used your " + PER_DEVICE_DAILY + " free questions for today. Please come back tomorrow to keep learning — thank you for using NaijaLearn-AI! 🎓", "LIMIT");
  }

  // 3) Cache miss & within limits — call the paid API
  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": API_KEY,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-haiku-4-5-20251001",
        max_tokens: MAX_TOKENS,
        system: system,
        messages: messages,
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      console.error("Anthropic API error:", err);
      return reply("Sorry, I could not get a response right now. Please try again in a moment.");
    }

    const data = await response.json();

    // 4) Cache the answer (next identical question is free) and count this paid call
    try {
      await cache.setJSON(key, { ts: Date.now(), data });
    } catch (e) {
      /* cache write is best-effort */
    }
    try {
      g.count += 1;
      await usage.setJSON(gKey, g);
      d.count += 1;
      await usage.setJSON(dKey, d);
    } catch (e) {
      /* usage write is best-effort */
    }

    return new Response(JSON.stringify(data), { headers: { ...headers, "X-Cache": "MISS" } });
  } catch (error) {
    console.error("Function error:", error);
    return reply("Something went wrong. Please check your connection and try again.");
  }
};
