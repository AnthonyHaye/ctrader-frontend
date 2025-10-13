// src/pages/TradeDetail/header/TradeDetailHeader.jsx
import styles from "./TradeDetailHeader.module.scss";
import { killzoneFor } from "../../../utils/killzones";
import { durationInfo } from "../../../utils/derive";
import { outcomeForTrade } from "../../../utils/tradeTech";

// petite helper pour tooltip de durée exacte
function formatMinutes(m) {
  if (m == null) return "";
  const h = Math.floor(m / 60);
  const mm = m % 60;
  if (h <= 0) return `${mm} min`;
  return `${h}h ${mm}m`;
}

function kzClass(label) {
  if (!label) return "";
  const map = {
    "Asie": styles.kzAsie,
    "Londres": styles.kzLondres,
    "New York AM": styles.kzNyAm,
    "Londres Close": styles.kzLondresClose,
    "New York PM": styles.kzNyPm,
  };
  return map[label] || "";
}

export default function TradeDetailHeader({ trade, onSave, dirty, saving }) {
  const symbol    = trade.symbol;
  const direction = trade.direction;
  const kzOpen    = killzoneFor(trade.openTime, trade.symbol);
  const netEur    = trade.netEur;

  const dur       = durationInfo(trade.openTime, trade.closeTime); // {key,label,minutes} | null
  const outcome   = outcomeForTrade(trade, 1);                     // tolérance ±1 €

  const pnlClass =
    netEur == null ? "" :
    Number(netEur) > 0 ? styles.pnlPos :
    Number(netEur) < 0 ? styles.pnlNeg : styles.pnlFlat;

  return (
    <div className={styles.header}>
      <div className={styles.centered}>
        <h1 className={styles.title}>{trade.symbol}</h1>

        <div className={styles.badgesRow}>
          {/* direction */}
          <span className={`${styles.badge} ${styles[direction?.toLowerCase() || "long"]}`}>
            {direction}
          </span>

          {/* killzone ouverture (couleur selon session) */}
          {kzOpen && (
            <span className={`${styles.badge} ${styles.kz} ${kzClass(kzOpen)}`} title={`Killzone: ${kzOpen}`}>
              {kzOpen}
            </span>
          )}

          {/* durée (couleur selon key) */}
          {dur && (
            <span
              className={`${styles.badge} ${styles.dur} ${styles[`dur_${dur.key}`]}`}
              title={formatMinutes(dur.minutes)}
            >
              {dur.label}
            </span>
          )}

          {/* issue du trade */}
          {outcome && (
            <span className={`${styles.badge} ${styles.outcome} ${styles[outcome.replaceAll(" ", "")]}`}>
              {outcome}
            </span>
          )}

          {/* € nets coloré */}
          <span className={`${styles.badge} ${styles.pnl} ${pnlClass}`}>
            € {netEur ?? "-"}
          </span>
        </div>
        <div className={styles.actions}>
          <button
            className={styles.save}
            onClick={onSave}
            disabled={!dirty || saving}
            title={dirty ? "Enregistrer toutes les modifications" : "Aucune modification"}
          >
            {saving ? "Enregistrement…" : "Enregistrer"}
          </button>
        </div>
      </div>
    </div>
  );
}
