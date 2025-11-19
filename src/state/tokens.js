import { redis } from "../cache/redis.js";
import { aggregateTokens } from "../services/aggregate.js";

let currentTokens = [];
let lastUpdatedAt = null;
let onUpdate = null; // callback for WS broadcasts

export function setOnUpdate(handler) {
  onUpdate = handler;
}

export function getTokens() {
  return currentTokens;
}

export function getLastUpdatedAt() {
  return lastUpdatedAt;
}

// simple diff: compute added / changed / removed
function diffTokens(oldList, newList) {
  const oldMap = new Map(oldList.map((t) => [t.token_address, t]));
  const newMap = new Map(newList.map((t) => [t.token_address, t]));

  const added = [];
  const changed = [];
  const removed = [];

  for (const [addr, newT] of newMap.entries()) {
    const oldT = oldMap.get(addr);
    if (!oldT) {
      added.push(newT);
    } else {
      // naive change detection (you can improve)
      if (
        newT.price_sol !== oldT.price_sol ||
        newT.volume_sol !== oldT.volume_sol ||
        newT.liquidity_sol !== oldT.liquidity_sol ||
        newT.price_1hr_change !== oldT.price_1hr_change
      ) {
        changed.push(newT);
      }
      oldMap.delete(addr);
    }
  }

  for (const [, oldT] of oldMap.entries()) {
    removed.push(oldT);
  }

  return { added, changed, removed };
}

export async function refreshTokens() {
  const ttl = Number(process.env.CACHE_TTL_SECONDS || 30);

  const newTokens = await aggregateTokens();
  const now = Date.now();
  const oldTokens = currentTokens;

  currentTokens = newTokens;
  lastUpdatedAt = now;

  try {
    await redis.setex("tokens:all", ttl, JSON.stringify(newTokens));
  } catch (err) {
    console.error("[redis] setex error:", err.message);
  }

  const { added, changed, removed } = diffTokens(oldTokens, newTokens);

  if (onUpdate && (added.length || changed.length || removed.length)) {
    onUpdate({
      type: "update",
      added,
      changed,
      removed,
      lastUpdatedAt: now
    });
  }

  return newTokens;
}
