import { WebSocketServer } from "ws";
import { redis } from "../cache/redis.js";
import { generateDiff } from "./utils/diff.js";

let clients = new Set();
let lastSnapshot = [];

export function startWebSocketServer(server) {
  const wss = new WebSocketServer({ noServer: true });
  
  server.on("upgrade", (req, socket, head) => {
    if (req.url === "/ws") {
      wss.handleUpgrade(req, socket, head, ws => {
        wss.emit("connection", ws, req);
      });
    } else {
      socket.destroy();
    }
  });

  console.log("[ws] WebSocket server started at /ws");

  wss.on("connection", async ws => {
    console.log("[ws] client connected");
    clients.add(ws);

    ws.on("close", () => {
      clients.delete(ws);
    });

    // Send snapshot on connect
    sendSnapshot(ws);
  });

  return wss;
}

// Send full snapshot
async function sendSnapshot(ws) {
  const cached = await redis.get("tokens");
  const tokens = cached ? JSON.parse(cached) : [];

  ws.send(
    JSON.stringify({
      type: "snapshot",
      tokens,
      lastUpdatedAt: Date.now()
    })
  );

  lastSnapshot = tokens;
}

// Broadcast update to all clients
export async function broadcastUpdate(newTokens) {
  const diff = generateDiff(lastSnapshot, newTokens);
  lastSnapshot = newTokens;

  if (
    diff.added.length === 0 &&
    diff.changed.length === 0 &&
    diff.removed.length === 0
  ) {
    return; // No changes → do not spam clients
  }

  for (const ws of clients) {
    ws.send(
      JSON.stringify({
        type: "update",
        ...diff,
        lastUpdatedAt: Date.now()
      })
    );
  }
}
