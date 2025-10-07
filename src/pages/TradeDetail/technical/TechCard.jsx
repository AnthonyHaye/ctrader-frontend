import styles from "./TechCard.module.scss";
import { plannedRR, riskPercent } from "../../../utils/derive";

// Options UI
const TF_OPTIONS = ["1mn","5mn","15mn","30mn","1h","4h","daily"];
const INDICATORS = [
  { key:"order_block",    label:"Order Block" },
  { key:"breaker_block",  label:"Breaker Block" },
  { key:"fvg",            label:"FVG" },
  { key:"ifvg",           label:"IFVG" },
  { key:"imbalance",      label:"Imbalance" },
  { key:"gap",            label:"Gap" },
  { key:"liquidity_grab", label:"Prise de liquidité" },
  { key:"rsi",            label:"RSI" }, 
];

function originalSLTP(trade) {
  const first = (trade.sltpEvents || [])
    .slice()
    .sort((a,b)=> new Date(a.time) - new Date(b.time))[0];
  return {
    sl: first?.sl ?? trade.stopLoss ?? null,
    tp: first?.tp ?? trade.takeProfit ?? null,
  };
}

// Renvoie la liste des TF supérieures à la TF principale
function higherTfOptions(tf) {
  const idx = TF_OPTIONS.indexOf(tf);
  if (idx === -1) return TF_OPTIONS; // si vide, proposer tout
  return TF_OPTIONS.slice(idx + 1);
}

export default function TechCard({ trade, value, onChange}) {
  // API (read-only)
  const orderType   = trade.technical?.orderType ?? "-";
  const entryPrice  = trade.technical?.entryPrice ?? "-";
  const positionSz  = trade.technical?.positionSize ?? "-";

  const { sl: sl0, tp: tp0 } = originalSLTP(trade);

  // Calculs auto
  const rrPlanned = plannedRR({
    entryPrice: trade.technical?.entryPrice,
    stopLoss: sl0,
    takeProfit: tp0,
    direction: trade.direction
  });

  const volPct = riskPercent({
    capitalAtTrade: trade.capitalAtTrade,
    riskAmountEur:  trade.riskAmountEur
  }); // % auto, affiché en RO

  // Éditables (user)
  const timeframe  = value?.timeframe ?? "";
  const indicators = value?.indicators || [];  
  const aplusEnabled    = !!value?.aplusEnabled;
  const aplusTf         = value?.aplusTf ?? "";
  const aplusIndicators = value?.aplusIndicators || [];

  const set = (patch) => onChange?.({ ...value, ...patch });

  const toggleInd = (k) => {
    const s = new Set(indicators);
    s.has(k) ? s.delete(k) : s.add(k);
    set({ indicators: Array.from(s) });
  };
  const toggleIndA = (k) => {
    const s = new Set(aplusIndicators);
    s.has(k) ? s.delete(k) : s.add(k);
    set({ aplusIndicators: Array.from(s) });
  };


    return (
    <div className={styles.card}>
      <div className={styles.title}>Paramètres techniques</div>

      <div className={styles.grid}>
        <Field label="Type d’ordre"><Read>{orderType}</Read></Field>
        <Field label="Point d’entrée"><Read>{entryPrice}</Read></Field>
        <Field label="SL d’origine"><Read>{sl0 ?? "-"}</Read></Field>
        <Field label="TP d’origine"><Read>{tp0 ?? "-"}</Read></Field>
        <Field label="R/R prévu (auto)"><Read>{rrPlanned ?? "-"}</Read></Field>
        <Field label="Volume engagé (% capital) (auto)"><Read>{volPct != null ? `${volPct}%` : "-"}</Read></Field>
        <Field label="Taille (unités)"><Read>{positionSz}</Read></Field>

        <Field label="Timeframe">
          <select className={styles.input} value={timeframe} onChange={(e)=> set({ timeframe: e.target.value })}>
            <option value="">— choisir —</option>
            {TF_OPTIONS.map(tf => <option key={tf} value={tf}>{tf}</option>)}
          </select>
        </Field>
      </div>

      {/* Indicateurs principaux */}
      <div className={styles.block}>
        <div className={styles.blockTitle}>Indicateurs / Smart Money</div>
        <div className={styles.checkboxGrid}>
          {INDICATORS.map(ind => (
            <label key={ind.key} className={styles.check}>
              <input type="checkbox" checked={indicators.includes(ind.key)} onChange={()=> toggleInd(ind.key)} />
              <span>{ind.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* A+ setup */}
      <div className={styles.block}>
        <label className={styles.aplusToggle}>
          <input
            type="checkbox"
            checked={aplusEnabled}
            onChange={(e)=> set({ aplusEnabled: e.target.checked })}
          />
          <span>A+ setup (confluence TF supérieure)</span>
        </label>

        {aplusEnabled && (
          <>
            <div className={styles.grid}>
              <Field label="TF supérieure (A+)">
                <select
                  className={styles.input}
                  value={aplusTf}
                  onChange={(e)=> set({ aplusTf: e.target.value })}
                >
                  <option value="">— choisir —</option>
                  {higherTfOptions(timeframe).map(tf => (
                    <option key={tf} value={tf}>{tf}</option>
                  ))}
                </select>
              </Field>
            </div>

            <div className={styles.blockTitle}>Indicateurs A+ (multi)</div>
            <div className={styles.checkboxGrid}>
              {INDICATORS.map(ind => (
                <label key={ind.key} className={styles.check}>
                  <input
                    type="checkbox"
                    checked={aplusIndicators.includes(ind.key)}
                    onChange={()=> toggleIndA(ind.key)}
                  />
                  <span>{ind.label}</span>
                </label>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <label className={styles.field}>
      <span className={styles.label}>{label}</span>
      <div className={styles.control}>{children}</div>
    </label>
  );
}
function Read({ children }) {
  return <span className={styles.readonly}>{children}</span>;
}