import { fetchDexTokens } from "./dexscreener.js";
import { fetchJupiterTokens } from "./jupiter.js";
import { mergeTokenLists } from "../utils/merge.js";

export async function aggregateTokens() {
  const [dex, jup] = await Promise.all([
    fetchDexTokens(),
    fetchJupiterTokens()
  ]);

  const merged = mergeTokenLists(dex, jup);

  // Default sort: highest 24h volume first
  merged.sort((a, b) => b.volume_sol - a.volume_sol);

  return merged;
}
