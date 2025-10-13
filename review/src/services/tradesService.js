const LS_KEY = "tradeEdits";

export async function fetchTrades() {
  const res = await fetch("/mocks/trades.json");
  const base = await res.json();
  const edits = JSON.parse(localStorage.getItem(LS_KEY) || "{}");
  return base.map(t => ({ ...t, ...(edits[t.id] || {}) }));
}

export async function fetchTradeById(id) {
  const all = await fetchTrades();
  return all.find(t => t.id === id) || null;
}

// export function saveTradeEdits(id, patch) {
//   const edits = JSON.parse(localStorage.getItem(LS_KEY) || "{}");
//   edits[id] = { ...(edits[id] || {}), ...patch };
//   localStorage.setItem(LS_KEY, JSON.stringify(edits));
// }

export function saveTradeEdits(id, patch) {
  // on filtre tout ce qui est technique (API-only)
  const { technical, sltpEvents, addIns, ...safe } = patch || {};
  const edits = JSON.parse(localStorage.getItem(LS_KEY) || "{}");
  edits[id] = { ...(edits[id] || {}), ...safe };
  localStorage.setItem(LS_KEY, JSON.stringify(edits));
}

