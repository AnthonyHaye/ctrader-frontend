import { hasAnySltpMods, hasAddIns } from "./tradeTech";



export function applyFilters(trades, { symbol, direction, hasSltpMods, hasAddIns: fAddins }) {
  return trades.filter(t => {
    const okSymbol = symbol ? t.symbol.toLowerCase().includes(symbol.toLowerCase()) : true;
    const okDir = direction ? t.direction === direction : true;
    const okMods = hasSltpMods ? hasAnySltpMods(t) : true;
    const okAddins = fAddins ? hasAddIns(t) : true;
    return okSymbol && okDir && okMods && okAddins;
  });
}
export function applySort(trades, { key, dir }) {
  if (!key) return trades;
  const sorted = [...trades].sort((a, b) => {
    const av = a[key]; const bv = b[key];
    if (av < bv) return -1;
    if (av > bv) return 1;
    return 0;
  });
  return dir === "desc" ? sorted.reverse() : sorted;
}
export function paginate(trades, page, pageSize) {
  const start = (page - 1) * pageSize;
  return trades.slice(start, start + pageSize);
}
