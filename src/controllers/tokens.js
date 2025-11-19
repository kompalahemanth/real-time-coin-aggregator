import { getTokensPaginated } from "../state/tokens.js";

export async function handleGetTokens(req, res) {
  try {
    const limit = Number(req.query.limit) || 20;
    const cursor = req.query.cursor || null;

    const result = await getTokensPaginated(limit, cursor);
    res.json(result);
  } catch (err) {
    console.error("Controller error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
}
