const ALLOWED_ORIGINS = [
  "https://deggie.tech",
  "https://deggieq2.github.io",
  "https://vibesnake-leaderboard.deggieq2.workers.dev",
  "http://localhost:8000",
];

const MAX_SCORES = 10;
const MAX_NAME_LENGTH = 12;
const MAX_SCORE = 9999;
const RATE_LIMIT_MAX = 6;
const RATE_LIMIT_WINDOW = 60;
const STORAGE_KEY = "vibesnake:scores";

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.pathname !== "/api/leaderboard") {
      return jsonResponse({ error: "Not found" }, 404, request);
    }

    if (request.method === "OPTIONS") {
      return handleOptions(request);
    }

    if (request.method === "GET") {
      const scores = await loadScores(env);
      return jsonResponse({ scores }, 200, request, { cache: "no-store" });
    }

    if (request.method === "POST") {
      const rate = await checkRateLimit(request, env);
      if (!rate.ok) {
        return jsonResponse({ error: "Too many submissions" }, 429, request);
      }

      let payload;
      try {
        payload = await request.json();
      } catch (error) {
        return jsonResponse({ error: "Invalid JSON" }, 400, request);
      }

      const name = sanitizeName(payload?.name);
      const score = Number(payload?.score);

      if (!name) {
        return jsonResponse({ error: "Name required" }, 400, request);
      }

      if (!Number.isInteger(score) || score < 0 || score > MAX_SCORE) {
        return jsonResponse({ error: "Invalid score" }, 400, request);
      }

      const scores = await loadScores(env);
      const next = insertScore(scores, { name, score });
      await env.LEADERBOARD.put(STORAGE_KEY, JSON.stringify(next));

      return jsonResponse({ scores: next }, 200, request, { cache: "no-store" });
    }

    return jsonResponse({ error: "Method not allowed" }, 405, request);
  },
};

async function loadScores(env) {
  const stored = await env.LEADERBOARD.get(STORAGE_KEY);
  if (!stored) return [];
  try {
    const parsed = JSON.parse(stored);
    if (!Array.isArray(parsed)) return [];
    return parsed
      .filter((entry) => entry && typeof entry.score === "number")
      .map((entry) => ({
        name: sanitizeName(entry.name) || "Player",
        score: entry.score,
      }))
      .sort((a, b) => b.score - a.score)
      .slice(0, MAX_SCORES);
  } catch (error) {
    return [];
  }
}

function insertScore(scores, record) {
  const next = [...scores, record]
    .filter((entry) => entry && typeof entry.score === "number")
    .sort((a, b) => b.score - a.score)
    .slice(0, MAX_SCORES);
  return next;
}

function sanitizeName(value) {
  if (!value || typeof value !== "string") return "";
  const cleaned = value
    .trim()
    .replace(/[^a-zA-Z0-9 ._\-]/g, "")
    .slice(0, MAX_NAME_LENGTH);
  return cleaned;
}

async function checkRateLimit(request, env) {
  const ip = request.headers.get("CF-Connecting-IP") || request.headers.get("X-Forwarded-For") || "unknown";
  const key = `ratelimit:${ip}`;
  const stored = await env.LEADERBOARD.get(key);
  const count = stored ? Number(stored) : 0;
  if (count >= RATE_LIMIT_MAX) {
    return { ok: false };
  }
  await env.LEADERBOARD.put(key, String(count + 1), { expirationTtl: RATE_LIMIT_WINDOW });
  return { ok: true };
}

function handleOptions(request) {
  return new Response(null, {
    status: 204,
    headers: buildCorsHeaders(request, { allowMethods: "GET,POST,OPTIONS" }),
  });
}

function jsonResponse(data, status, request, options = {}) {
  const headers = buildCorsHeaders(request, { cache: options.cache });
  headers.set("Content-Type", "application/json");
  if (options.cache) {
    headers.set("Cache-Control", options.cache);
  }
  return new Response(JSON.stringify(data), { status, headers });
}

function buildCorsHeaders(request, { allowMethods = "GET,POST,OPTIONS", cache } = {}) {
  const origin = request.headers.get("Origin") || "";
  const headers = new Headers();
  if (ALLOWED_ORIGINS.includes(origin)) {
    headers.set("Access-Control-Allow-Origin", origin);
  }
  headers.set("Access-Control-Allow-Methods", allowMethods);
  headers.set("Access-Control-Allow-Headers", "Content-Type");
  headers.set("Vary", "Origin");
  if (cache) headers.set("Cache-Control", cache);
  return headers;
}
