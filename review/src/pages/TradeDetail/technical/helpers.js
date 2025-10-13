// originalSLTP, higherTfOptionsimport { TF_OPTIONS } from "./constants";

import { TF_OPTIONS } from "./constants";

export function originalSLTP(trade) {
  const first = (trade.sltpEvents||[]).slice()
    .sort((a,b)=>new Date(a.time)-new Date(b.time))[0];
  return { sl: first?.sl ?? trade.stopLoss ?? null,
           tp: first?.tp ?? trade.takeProfit ?? null };
}
export function higherTfOptions(tf) {
  const idx = TF_OPTIONS.indexOf(tf);
  return idx === -1 ? TF_OPTIONS : TF_OPTIONS.slice(idx+1);
}
