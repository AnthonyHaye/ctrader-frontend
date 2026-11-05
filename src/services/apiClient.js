// src/services/apiClient.js
const BASE = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '');

function fullPath(path) {
  if (path.startsWith('http')) return path;
  const normalized = path.startsWith('/') ? path : `/${path}`;
  return BASE ? `${BASE}${normalized}` : normalized;
}

async function req(method, path, { params, body, token, headers } = {}) {
  const url = new URL(fullPath(path), window.location.origin);
  if (params) Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));

  const res = await fetch(url.toString(), {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(headers || {}),
    },
    body: body ? JSON.stringify(body) : undefined,
    credentials: 'same-origin',
  });

  const text = await res.text();
  let data;
  try { data = text ? JSON.parse(text) : null; }
  catch { data = text; } // parfois l’API renvoie du HTML d’erreur

  if (!res.ok) {
    console.error('[api] Error', res.status, data);
    throw new Error(`API ${res.status}: ${typeof data === 'string' ? data.slice(0,120) : JSON.stringify(data)}`);
  }
  return data; // peut être un objet ou un tableau, on normalise après
}

export const api = {
  get: (p, opts)    => req('GET', p, opts),
  post: (p, opts)   => req('POST', p, opts),
  put: (p, opts)    => req('PUT', p, opts),
  patch: (p, opts)  => req('PATCH', p, opts),
  delete: (p, opts) => req('DELETE', p, opts),
};

export const BUILD_TAG = 'BUILD_TAG:' + new Date().toISOString();
if (typeof window !== 'undefined') window.__CTRADER_BUILD__ = BUILD_TAG;
