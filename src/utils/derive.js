// % de risque vs capital au moment du trade
export function riskPercent({ capitalAtTrade, riskAmountEur }) {
  if (capitalAtTrade == null || riskAmountEur == null) return null;
  const cap = Number(capitalAtTrade);
  const risk = Number(riskAmountEur);
  if (!isFinite(cap) || cap <= 0) return null;
  return +((risk / cap) * 100).toFixed(2);
}


// Sessions (UTC simplifié) : Asie 00:00–07:59, Londres 08:00–12:59, NY 13:00–21:00
export function sessionFromDate(isoDate) {
  if (!isoDate) return null;
  const h = new Date(isoDate).getUTCHours();
  if (h < 8) return "Asie";
  if (h < 13) return "Londres";
  if (h <= 21) return "New York";
  return "Asie"; // wrap tardif
}

export function pipFactor(symbol) {
  if (!symbol) return 0.0001;
  // paires JPY : 0.01
  return /JPY$/.test(symbol) ? 0.01 : 0.0001;
}

export function signedPips({ entryPrice, closePrice, direction, symbol }) {
  if (entryPrice == null || closePrice == null) return null;
  const pf = pipFactor(symbol);
  const diff = (closePrice - entryPrice) / pf;
  const sign = direction === "LONG" ? 1 : -1;
  return +(diff * sign).toFixed(1);
}



export function durationInfo(openTime, closeTime) {
  if (!openTime || !closeTime) return null;
  const ms = new Date(closeTime) - new Date(openTime);
  if (ms < 0) return null;

  const minutes = Math.round(ms / 60000);
  let key = "intraday";
  let label = "intraday";

  if (minutes <= 30)       { key = "scalping"; label = "scalping"; }
  else if (minutes <= 240) { key = "intraday"; label = "intraday"; }
  else if (minutes <= 1440){ key = "daytrade"; label = "day trade"; }
  else                     { key = "swing";    label = "swing"; }

  return { key, label, minutes };
}

// fonction simple pour rétro-compat
export function durationLabel(openTime, closeTime) {
  const info = durationInfo(openTime, closeTime);
  return info ? info.label : null;
}


export function plannedRR({ entryPrice, stopLoss, takeProfit, direction }) {
  if (entryPrice == null || stopLoss == null || takeProfit == null) return null;
  const risk = Math.abs(entryPrice - stopLoss);
  const reward = Math.abs(takeProfit - entryPrice);
  if (risk === 0) return null;
  return +(reward / risk).toFixed(2);
}

export function realizedRR({ entryPrice, stopLoss, closePrice }) {
  if (entryPrice == null || stopLoss == null || closePrice == null) return null;
  const risk = Math.abs(entryPrice - stopLoss);
  const reward = Math.abs(closePrice - entryPrice);
  if (risk === 0) return null;
  return +(reward / risk).toFixed(2);
}
