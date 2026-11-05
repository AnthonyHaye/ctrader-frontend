// src/services/tradesService.js
import { api } from './apiClient';

// Clés/chemins
const TRADES = '/trades';
const LS_KEY = 'tradeEdits';

function normalizeToArray(payload) {
  if (Array.isArray(payload)) return payload;
  if (payload && Array.isArray(payload.data))  return payload.data;
  if (payload && Array.isArray(payload.items)) return payload.items;
  if (typeof payload === 'string') {
    try { const j = JSON.parse(payload); return normalizeToArray(j); } catch {}
  }
  return []; // fallback sûr
}

export async function fetchTrades() {
  const raw = await api.get('/trades');
  const trades = normalizeToArray(raw);
  return trades;
}

/** Lit les éditions locales persistées */
function readLocalEdits() {
  try {
    return JSON.parse(localStorage.getItem(LS_KEY) || '{}');
  } catch {
    return {};
  }
}

/** Merge helper */
function mergeWithEdits(listOrItem) {
  const edits = readLocalEdits();
  if (Array.isArray(listOrItem)) {
    return listOrItem.map(t => ({ ...t, ...(edits[t.id] || {}) }));
  }
  return { ...listOrItem, ...(edits[listOrItem?.id] || {}) };
}

/** Fallback local : /mocks + localStorage */
async function fetchTradesLocal() {
  const res = await fetch('/mocks/trades.json');
  const base = await res.json();
  return mergeWithEdits(base);
}

async function fetchTradeByIdLocal(id) {
  const all = await fetchTradesLocal();
  return all.find(t => String(t.id) === String(id)) || null;
}

/** --- API publique --- */
// export async function fetchTrades() {
//   // Si pas d'URL API => fallback local
//   if (!import.meta.env.VITE_API_URL) {
//     return fetchTradesLocal();
//   }

//   // API réelle
//   const { data } = await api.get(TRADES);
//   return mergeWithEdits(data || []);
// }

export async function fetchTradeById(id) {
  if (!import.meta.env.VITE_API_URL) {
    return fetchTradeByIdLocal(id);
  }

 const { data } = await api.get(`${TRADES}/${id}`);
 const normalized = data ? { ...data, addins: data.addins ?? data.addIns ?? {} } : null;
 return normalized ? mergeWithEdits(normalized) : null;
}

export async function saveTradeEdits(id, patch) {
  // On n’envoie pas les champs purement techniques (API-only)
  const { technical, sltpEvents, addIns, ...safe } = patch || {};
  const cloned = JSON.parse(JSON.stringify(safe));

  if (!import.meta.env.VITE_API_URL) {
    // Mode local : on persiste juste dans localStorage
    const edits = readLocalEdits();
    edits[id] = { ...(edits[id] || {}), ...cloned };
    localStorage.setItem(LS_KEY, JSON.stringify(edits));
    // retourne une fusion approximative pour rafraîchir l'écran
   const base = await fetchTradeByIdLocal(id);
   return base ? { ...base, ...edits[id] } : null;
  }

  // API réelle : met à jour le trade
  // Si ton backend attend un PATCH partiel, remplace par: await api.patch(`${TRADES}/${id}`, { body: cloned });
  const { data: updated } = await api.put(`${TRADES}/${id}`, { body: cloned });

  // Optionnel : on met aussi à jour le cache local pour un rendu instantané
  const edits = readLocalEdits();
  edits[id] = { ...(edits[id] || {}), ...cloned };
  localStorage.setItem(LS_KEY, JSON.stringify(edits));
  return updated ?? { id, ...cloned }; // renvoie quelque chose d’exploitable
}


