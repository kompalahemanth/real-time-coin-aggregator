import "dotenv/config";
import express from "express";
import cors from "cors";
import { createServer } from "http";

import tokensRoute from "./api/tokens.js";
import { startWebSocketServer } from "./ws/server.js";

import { refreshTokens } from "./state/tokens.js";
import { startRefresher } from "./jobs/refresher.js";
startRefresher();

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Meme coin aggregator backend is running");
});

app.use(tokensRoute);

const port = Number(process.env.PORT || 3000);
const server = createServer(app);



// Initial warm-up + refresh loop
const refreshInterval = Number(process.env.REFRESH_INTERVAL_MS || 10000);

(async () => {
  try {
    console.log("[init] refreshing tokens for the first time...");
    await refreshTokens();
  } catch (err) {
    console.error("[init] initial refresh error:", err.message);
  }

  setInterval(() => {
    refreshTokens().catch((err) =>
      console.error("[refresh] error:", err.message)
    );
  }, refreshInterval);

  server.listen(port, () => {
    console.log(`🚀 Server running on ${port}`);
  });
  startWebSocketServer(server);
})();
