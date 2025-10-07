import styles from "./TechUserCard.module.scss";
import { plannedRR } from "../../../utils/derive";

const TF_OPTIONS = ["1mn","5mn","15mn","30mn","1h","4h","daily"];
const INDICATORS = [
  // SMC
  { key:"order_block", label:"Order Block" },
  { key:"breaker_block", label:"Breaker Block" },
  { key:"fvg", label:"FVG" },
  { key:"ifvg", label:"IFVG" },
  { key:"imbalance", label:"Imbalance" },
  { key:"gap", label:"Gap" },
  { key:"liquidity_grab", label:"Prise de liquidité" },
  // Classiques (optionnel)
  { key:"rsi", label:"RSI" },
  { key:"macd", label:"MACD" },
  { key:"obv", label:"OBV" },
];

export default function TechUserCard({
  techApi,            // { entryPrice, stopLoss, takeProfit } (lecture seule)
  value,              // { timeframesUser:[], volumePct:number|string, indicators:[] }
  onChange,
  onSave
}) {
  const rr = plannedRR({
    entryPrice: techApi?.entryPrice,
    stopLoss: techApi?.stopLoss ?? techApi?.sl,       // au cas où tu passes sl/tp courants
    takeProfit: techApi?.takeProfit ?? techApi?.tp,
    direction: techApi?.direction
  });

  const timeframes = value?.timeframesUser || [];
  const volumePct = value?.volumePct ?? "";
  const indicators = value?.indicators || [];

  const toggleTF = (tf) => {
    const set = new Set(timeframes);
    set.has(tf) ? set.delete(tf) : set.add(tf);
    onChange?.({ ...value, timeframesUser: Array.from(set) });
  };

  const toggleInd = (key) => {
    const set = new Set(indicators);
    set.has(key) ? set.delete(key) : set.add(key);
    onChange?.({ ...value, indicators: Array.from(set) });
  };

  return (
    <div className={styles.card}>
      <div className={styles.title}>Paramètres techniques (utilisateur)</div>

      {/* Timeframes */}
      <div className={styles.block}>
        <div className={styles.blockTitle}>Timeframes (sélection multiple)</div>
        <div className={styles.checkboxGrid}>
          {TF_OPTIONS.map(tf => (
            <label key={tf} className={styles.check}>
              <input
                type="checkbox"
                checked={timeframes.includes(tf)}
                onChange={() => toggleTF(tf)}
              />
              <span>{tf}</span>
            </label>
          ))}
        </div>
      </div>

      {/* R/R prévu (calcul auto) + Volume % */}
      <div className={styles.block}>
        <div className={styles.blockTitle}>Gestion du risque</div>
        <div className={styles.grid2}>
          <label className={styles.field}>
            <span className={styles.label}>R/R prévu (auto)</span>
            <span className={styles.readonly}>{rr ?? "-"}</span>
          </label>

            <label className={styles.field}>
              <span className={styles.label}>Volume engagé (% du capital)</span>
              <input
                className={styles.input}
                type="number"
                step="0.01"
                min="0"
                value={volumePct}
                onChange={(e)=> onChange?.({ ...value, volumePct: e.target.value })}
                placeholder="ex: 1.00"
              />
            </label>
        </div>
      </div>

      {/* Indicateurs (SMC + classiques) */}
      <div className={styles.block}>
        <div className={styles.blockTitle}>Indicateurs / Smart Money (multi)</div>
        <div className={styles.checkboxGrid}>
          {INDICATORS.map(ind => (
            <label key={ind.key} className={styles.check}>
              <input
                type="checkbox"
                checked={indicators.includes(ind.key)}
                onChange={() => toggleInd(ind.key)}
              />
              <span>{ind.label}</span>
            </label>
          ))}
        </div>
      </div>

      <div className={styles.actions}>
        <button className={styles.save} onClick={onSave}>Enregistrer</button>
      </div>
    </div>
  );
}
