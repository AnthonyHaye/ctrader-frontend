// src/utils/killzones.js

// Définitions en heure FR (Europe/Paris), minutes incluses au début, exclues à la fin.
// Forex : Asie 02:00–06:00, Londres 08:00–11:00, New York AM 13:00–16:00, Londres Close 16:00–18:00
// Indices : Asie 02:00–06:00, Londres 08:00–11:00, New York AM 14:30–17:00, New York PM 19:30–22:00

const forexRanges = [
  { label: "Asie",        start: "02:00", end: "06:00" },
  { label: "Londres",     start: "08:00", end: "11:00" },
  { label: "New York AM", start: "13:00", end: "16:00" },
  { label: "Londres Close", start: "16:00", end: "18:00" },
];

const indexRanges = [
  { label: "Asie",        start: "02:00", end: "06:00" },
  { label: "Londres",     start: "08:00", end: "11:00" },
  { label: "New York AM", start: "14:30", end: "17:00" },
  { label: "New York PM", start: "19:30", end: "22:00" },
];

// Détecteur simple d’instrument (tu peux l’ajuster)
const indexLike = /(DAX|GER|FRA|CAC|FR40|FR40|EU50|STOXX|US30|DJI|US100|NAS|NDX|US500|SPX|SP500|UK100|FTSE|IT40|ES|YM|NQ|RTY|RUSSELL|HK50|JP225|DE40|FR40|US2000)/i;
function inferClass(symbol = "") {
  if (indexLike.test(symbol)) return "indices";
  // Paires Forex classiques (6 lettres, ex. EURUSD) ou avec slash
  if (/^[A-Z]{6}$/i.test(symbol) || /^[A-Z]{3}\/[A-Z]{3}$/i.test(symbol)) return "forex";
  return "forex"; // défaut
}

function hmToMin(hm) {
  const [h, m] = hm.split(":").map(Number);
  return h * 60 + m;
}

function toParisMinutes(date) {
  const parts = new Intl.DateTimeFormat("fr-FR", {
    timeZone: "Europe/Paris",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).formatToParts(new Date(date));
  const h = Number(parts.find(p => p.type === "hour")?.value);
  const m = Number(parts.find(p => p.type === "minute")?.value);
  return h * 60 + m;
}

function findRangeLabel(ranges, minuteOfDay) {
  for (const r of ranges) {
    const s = hmToMin(r.start);
    const e = hmToMin(r.end);
    if (minuteOfDay >= s && minuteOfDay < e) return r.label;
  }
  return null;
}

// API principale : donne la killzone pour une date (ouverture/fermeture) et un symbole
export function killzoneFor(dateISO, symbol) {
  if (!dateISO) return null;
  const klass = inferClass(symbol);
  const minute = toParisMinutes(dateISO);
  const ranges = klass === "indices" ? indexRanges : forexRanges;
  return findRangeLabel(ranges, minute);
}

// Optionnel : exposer les plages (utile pour une légende/UI)
export const KILLZONES = {
  forex: forexRanges,
  indices: indexRanges,
  inferClass,
};
