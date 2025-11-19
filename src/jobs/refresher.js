import { aggregateTokens } from "../services/aggregate.js";
import { redis } from "../cache/redis.js";
import { broadcastUpdate } from "../ws/server.js";
export function startRefresher() {
  console.log("🔄 Token refresher started…");

  // Run immediately at start
  refreshOnce();

  setInterval(refreshOnce, 5000);
}

async function refreshOnce() {
  try {
    const data = await aggregateTokens();

    if (data && data.length) {
      await redis.set("tokens", JSON.stringify(data));
       broadcastUpdate(data);
    console.log(" Live update sent:", data.length);

    } else {
      console.log(" No tokens fetched");
    }
  } catch (err) {
    console.error(" Refresher error:", err.message);
  }
}
