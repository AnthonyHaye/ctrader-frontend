export function winrate(trades) {
  if (!trades.length) return 0;
  const wins = trades.filter(t => Number(t.netEur) > 0).length;
  return Math.round((wins / trades.length) * 100);
}
export function totalPnL(trades) {
  return trades.reduce((acc, t) => acc + Number(t.netEur || 0), 0);
}
