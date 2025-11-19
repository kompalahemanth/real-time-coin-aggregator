import { redis } from "../cache/redis.js";
import { aggregateTokens } from "../services/aggregate.js";

let MEMORY_TOKENS = [];

// Refresh tokens into Redis + memory
export async function refreshTokens() {
  const tokens = await aggregateTokens();
  MEMORY_TOKENS = tokens;

  try {
    await redis.set("tokens_all", JSON.stringify(tokens));
  } catch (err) {
    console.error("[redis] write error:", err);
  }

  console.log(`✅ Tokens updated: ${tokens.length}`);
  return tokens;
}

/**
 * Pagination helper
 * limit = how many to return
 * cursor = index (string, convert to number)
 */
export async function getTokensPaginated(limit = 20, cursor = null) {
  let startIndex = cursor ? Number(cursor) : 0;
  let endIndex = startIndex + limit;

  const total = MEMORY_TOKENS.length;

  const slice = MEMORY_TOKENS.slice(startIndex, endIndex);

  const nextCursor = endIndex < total ? String(endIndex) : null;

  return {
    data: slice,
    nextCursor,
    total
  };
}
