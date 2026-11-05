// // src/lib/api.js
const BASE = import.meta.env.VITE_API_URL || "http://localhost:8080";

// petit helper
async function getJSON(url) {
  const r = await fetch(url);
  if (!r.ok) throw new Error(`HTTP ${r.status} for ${url}`);
  return r.json();
}

export const StatsAPI = {
  global(params = {}) {
    const q = new URLSearchParams({ dateField: "closeTime", ...params });
    return getJSON(`${BASE}/stats/global?${q.toString()}`);
  },
  monthly(params = {}) {
    const q = new URLSearchParams({ dateField: "closeTime", ...params });
    return getJSON(`${BASE}/stats/monthly?${q.toString()}`);
  },
  equityCurve(params = {}) {
    const q = new URLSearchParams({ dateField: "closeTime", equityStart: 10000, ...params });
    return getJSON(`${BASE}/stats/equity-curve?${q.toString()}`);
  },
  symbols(params = {}) {
    const q = new URLSearchParams({ dateField: "closeTime", ...params });
    return getJSON(`${BASE}/stats/symbols?${q.toString()}`);
  },
};
