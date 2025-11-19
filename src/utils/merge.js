export function mergeTokenLists(...lists) {
  const map = new Map();

  for (const list of lists) {
    for (const t of list) {
      if (!t || !t.token_address) continue;

      const key = t.token_address;
      const existing = map.get(key);

      if (!existing) {
        map.set(key, t);
      } else {
        map.set(key, {
          ...existing,
          price_sol: t.price_sol || existing.price_sol,
          market_cap_sol: Math.max(existing.market_cap_sol, t.market_cap_sol),
          volume_sol: Math.max(existing.volume_sol, t.volume_sol),
          liquidity_sol: Math.max(existing.liquidity_sol, t.liquidity_sol),
          transaction_count: Math.max(existing.transaction_count, t.transaction_count),
          price_1hr_change:
            t.price_1hr_change !== 0 ? t.price_1hr_change : existing.price_1hr_change,
          protocol: Array.from(
            new Set(
              (existing.protocol + "," + t.protocol)
                .split(",")
                .map((x) => x.trim())
                .filter(Boolean)
            )
          ).join(", ")
        });
      }
    }
  }

  return Array.from(map.values());
}
