import { Router } from "express";
import { redis } from "../cache/redis.js";

const r = Router();

r.get("/tokens", async (req, res) => {
  const limit = Number(req.query.limit) || 20;
  const cursor = req.query.cursor || null;

  // 🔹 Load tokens from Redis (always cached array)
  const cached = await redis.get("tokens");
  const tokens = cached ? JSON.parse(cached) : [];

  if (!tokens.length) {
    return res.json({
      data: [],
      nextCursor: null,
      total: 0
    });
  }

  // 🔹 STEP 1: Find start index using cursor
  let startIndex = 0;

  if (cursor) {
    const index = tokens.findIndex(t => t.token_address === cursor);
    if (index !== -1) {
      startIndex = index + 1;  
    }
  }

  // 🔹 STEP 2: Slice based on limit
  const paginated = tokens.slice(startIndex, startIndex + limit);

  // 🔹 STEP 3: Determine nextCursor
  let nextCursor = null;
  if (startIndex + limit < tokens.length) {
    const lastItem = paginated[paginated.length - 1];
    nextCursor = lastItem.token_address;
  }

  // 🔹 Response
  res.json({
    data: paginated,
    nextCursor,
    total: tokens.length
  });
});

export default r;
