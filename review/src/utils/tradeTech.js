function lastByTime(arr = []) {
  if (!arr.length) return null;
  return arr.slice().sort((a,b)=> new Date(a.time) - new Date(b.time)).at(-1);
}

export function currentFromEvents(events = []) {
  const last = lastByTime(events);
  return { sl: last?.sl ?? null, tp: last?.tp ?? null };
}

export function modCountFromEvents(events = []) {
  const n = events.length || 0;
  return n > 0 ? n - 1 : 0; // 1er = setup initial
}

// ---- Trade niveau racine
export function currentSLTP(trade) {
  return currentFromEvents(trade?.sltpEvents || []);
}
export function sltpModCount(trade) {           // <— cette export existe bien
  return modCountFromEvents(trade?.sltpEvents || []);
}

// ---- Add-in
export function currentSLTPAddIn(addIn) {
  const cur = currentFromEvents(addIn?.sltpEvents || []);
  return { sl: cur.sl ?? addIn?.sl ?? null, tp: cur.tp ?? addIn?.tp ?? null };
}
export function sltpModCountAddIn(addIn) {
  return modCountFromEvents(addIn?.sltpEvents || []);
}

// ---- Agrégats
export function hasAddIns(trade) {
  return (trade?.addIns?.length || 0) > 0;
}
export function totalSltpModCount(trade) {
  const base = sltpModCount(trade);
  const addins = (trade?.addIns || []).reduce((acc, a) => acc + sltpModCountAddIn(a), 0);
  return base + addins;
}
export function hasAnySltpMods(trade) {
  return totalSltpModCount(trade) > 0;
}

// petite tolérance prix pour matcher SL/TP (pips basique)
function _pipFactor(symbol = "") {
  return /JPY$/i.test(symbol) ? 0.01 : /^[A-Z]{6}$/i.test(symbol) ? 0.0001 : 0.5;
}
function _near(a, b, tol) {
  if (a == null || b == null) return false;
  return Math.abs(Number(a) - Number(b)) <= tol;
}

/**
 * Détermine l’issue du trade: "TP" | "SL" | "SL en gain" | "BE"
 * - BE si |netEur| <= eurTolerance
 * - Sinon, si close ≈ TP -> TP
 * - Sinon, si close ≈ SL -> SL (ou "SL en gain" si netEur > 0)
 * - Sinon fallback sur le signe du PnL
 */
export function outcomeForTrade(trade, eurTolerance = 1) {
  if (!trade) return null;
  const pnl = Number(trade.netEur ?? 0);
  if (Math.abs(pnl) <= eurTolerance) return "BE";

  const sym = trade.symbol || "";
  const tolPrice = _pipFactor(sym) * 2;

  const close = trade.closePrice;
  // on prend la dernière valeur connue (events), sinon les champs à plat si tu les as
  const lastEvent = (trade.sltpEvents || []).slice().sort((a,b)=> new Date(a.time)-new Date(b.time)).at(-1);
  const sl = trade.stopLoss ?? lastEvent?.sl ?? null;
  const tp = trade.takeProfit ?? lastEvent?.tp ?? null;

  if (_near(close, tp, tolPrice)) return "TP";
  if (_near(close, sl, tolPrice)) return pnl > 0 ? "SL en gain" : "SL";

  return pnl > 0 ? "TP" : "SL";
}

