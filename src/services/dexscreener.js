import axios from "axios";
import axiosRetry from "axios-retry";
import { normalizeDexToken } from "../utils/normalize.js";

axiosRetry(axios, {
  retries: 3,
  retryDelay: axiosRetry.exponentialDelay,
  retryCondition: (err) =>
    axiosRetry.isNetworkOrIdempotentRequestError(err) ||
    (err.response && [429, 500, 502, 503, 504].includes(err.response.status))
});

export async function fetchDexTokens() {
  const url = "https://api.dexscreener.com/latest/dex/search?q=sol"; // generic Solana search
  try {
    const { data } = await axios.get(url, { timeout: 5000 });
    const pairs = data.pairs || [];
    return pairs.map(normalizeDexToken);
  } catch (err) {
    console.error("[dexscreener] fetch error:", err.message);
    return [];
  }
}
