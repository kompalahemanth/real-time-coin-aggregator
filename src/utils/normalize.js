// Common shape:
// {
//   token_address,
//   token_name,
//   token_ticker,
//   price_sol,
//   market_cap_sol,
//   volume_sol,
//   liquidity_sol,
//   transaction_count,
//   price_1hr_change,
//   protocol
// }

export function normalizeDexToken(pair) {
  const buys = Number(pair.txns?.h24?.buys ?? 0);
  const sells = Number(pair.txns?.h24?.sells ?? 0);

  return {
    token_address: pair.baseToken?.address ?? pair.pairAddress ?? "",
    token_name: pair.baseToken?.name ?? "",
    token_ticker: pair.baseToken?.symbol ?? "",
    price_sol: Number(pair.priceNative ?? 0),
    market_cap_sol: Number(pair.fdv ?? 0),
    volume_sol: Number(pair.volume?.h24 ?? 0),
    liquidity_sol: Number(pair.liquidity?.base ?? 0),
    transaction_count: buys + sells,
    price_1hr_change: Number(pair.priceChange?.h1 ?? 0),
    protocol: pair.dexId || "DexScreener"
  };
}

// Very rough example normalization for Jupiter. You can adjust as needed.
export function normalizeJupiterToken(t) {
  return {
    token_address: t.address ?? "",
    token_name: t.name ?? "",
    token_ticker: t.symbol ?? "",
    price_sol: Number(t.priceInfo?.priceInSol ?? 0),
    market_cap_sol: Number(t.priceInfo?.marketCapInSol ?? 0),
    volume_sol: Number(t.priceInfo?.dayVolumeInSol ?? 0),
    liquidity_sol: Number(t.liquidityInSol ?? 0),
    transaction_count: Number(t.tradeInfo?.dayTxs ?? 0),
    price_1hr_change: Number(t.priceInfo?.hourChangePercent ?? 0),
    protocol: "Jupiter"
  };
}
