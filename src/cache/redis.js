import Redis from "ioredis";

const RedisCtor = Redis.default ?? Redis;

export const redis = new RedisCtor(process.env.REDIS_URL, {
  maxRetriesPerRequest: 3,
  enableOfflineQueue: false
});

redis.on("error", (err) => {
  console.error("[redis] error:", err.message);
});

redis.on("connect", () => {
  console.log("[redis] connected");
});
