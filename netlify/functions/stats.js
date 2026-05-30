import crypto from "node:crypto";

const headers = {
  "Access-Control-Allow-Origin": "*",
  "Content-Type": "application/json",
  // Cache at the CDN/browser for 5 min to stay well under GA API quotas
  "Cache-Control": "public, max-age=300",
};

function b64url(input) {
  return Buffer.from(input)
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

// Sign a service-account JWT and exchange it for a Google access token.
async function getAccessToken(creds) {
  const now = Math.floor(Date.now() / 1000);
  const header = { alg: "RS256", typ: "JWT" };
  const claim = {
    iss: creds.client_email,
    scope: "https://www.googleapis.com/auth/analytics.readonly",
    aud: "https://oauth2.googleapis.com/token",
    iat: now,
    exp: now + 3600,
  };
  const unsigned = b64url(JSON.stringify(header)) + "." + b64url(JSON.stringify(claim));
  const signature = crypto
    .createSign("RSA-SHA256")
    .update(unsigned)
    .sign(creds.private_key)
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
  const jwt = unsigned + "." + signature;

  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body:
      "grant_type=urn:ietf:params:oauth:grant-type:jwt-bearer&assertion=" + jwt,
  });
  const data = await res.json();
  if (!data.access_token) {
    throw new Error("token exchange failed: " + JSON.stringify(data));
  }
  return data.access_token;
}

export default async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("", { status: 204, headers });
  }

  const raw = process.env.GA_CREDENTIALS;
  const propertyId = process.env.GA_PROPERTY_ID || "396299407";

  // Not configured yet — return gracefully so the UI just hides the stats
  if (!raw) {
    return new Response(JSON.stringify({ configured: false }), { headers });
  }

  try {
    const creds = JSON.parse(raw);
    if (creds.private_key && creds.private_key.includes("\\n")) {
      creds.private_key = creds.private_key.replace(/\\n/g, "\n");
    }
    const token = await getAccessToken(creds);
    const auth = { Authorization: "Bearer " + token, "Content-Type": "application/json" };

    // Totals since launch
    const repRes = await fetch(
      `https://analyticsdata.googleapis.com/v1beta/properties/${propertyId}:runReport`,
      {
        method: "POST",
        headers: auth,
        body: JSON.stringify({
          dateRanges: [{ startDate: "2020-01-01", endDate: "today" }],
          metrics: [{ name: "totalUsers" }, { name: "screenPageViews" }, { name: "sessions" }],
        }),
      }
    );
    const rep = await repRes.json();
    const mv = rep.rows && rep.rows[0] ? rep.rows[0].metricValues : [];
    const stats = {
      users: parseInt((mv[0] && mv[0].value) || "0", 10),
      views: parseInt((mv[1] && mv[1].value) || "0", 10),
      sessions: parseInt((mv[2] && mv[2].value) || "0", 10),
    };

    // Realtime active users (best-effort)
    let active = 0;
    try {
      const rtRes = await fetch(
        `https://analyticsdata.googleapis.com/v1beta/properties/${propertyId}:runRealtimeReport`,
        { method: "POST", headers: auth, body: JSON.stringify({ metrics: [{ name: "activeUsers" }] }) }
      );
      const rt = await rtRes.json();
      active = parseInt(
        (rt.rows && rt.rows[0] && rt.rows[0].metricValues && rt.rows[0].metricValues[0].value) || "0",
        10
      );
    } catch (e) {
      /* realtime optional */
    }

    return new Response(JSON.stringify({ configured: true, stats: { ...stats, active } }), { headers });
  } catch (err) {
    console.error("stats error:", err);
    return new Response(JSON.stringify({ configured: false, error: "Could not load analytics." }), { headers });
  }
};
