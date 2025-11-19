import axios from "axios";
import axiosRetry from "axios-retry";
import { normalizeJupiterToken } from "../utils/normalize.js";

axiosRetry(axios, {
  retries: 3,
  retryDelay: axiosRetry.exponentialDelay,
  retryCondition: (err) =>
    axiosRetry.isNetworkOrIdempotentRequestError(err) ||
    (err.response && [429, 500, 502, 503, 504].includes(err.response.status))
});

export async function fetchJupiterTokens() {
  const url = "https://lite-api.jup.ag/tokens/v2/search?query=SOL";
  try {
    const { data } = await axios.get(url, { timeout: 5000 });
    const tokens = Array.isArray(data?.tokens) ? data.tokens : Array.isArray(data) ? data : [];
    return tokens.map(normalizeJupiterToken);
  } catch (err) {
    console.error("[jupiter] fetch error:", err.message);
    return [];
  }
}
