import { Link } from "react-router-dom";
import styles from "./TradesTable.module.scss";

import { killzoneFor } from "../../utils/killzones";
import { durationInfo } from "../../utils/derive";
import { plannedRR, realizedRR, riskPercent } from "../../utils/derive";
import { currentSLTP, totalSltpModCount } from "../../utils/tradeTech";
import { outcomeForTrade } from "../../utils/tradeTech";

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

export default function TradesTable({ trades, sort, onSortChange }) {
  const columns = [
    { key: "symbol",   label: "Symbole" },
    { key: "summary",  label: "Résumé" },           // badges
    { key: "rr",       label: "R/R" },              // nouveau
    { key: "riskPct",  label: "Risque %" },         // nouveau
    { key: "addins",   label: "Add-ins" },
    { key: "id",       label: "ID" },
    { key: "direction",label: "Sens" },
    { key: "netEur",   label: "€ nets" },
  ];

  const noSortKeys = ["summary", "addins"];

  const handleSort = (key) => {
    if (noSortKeys.includes(key)) return;
    if (sort.key === key) onSortChange({ key, dir: sort.dir === "asc" ? "desc" : "asc" });
    else onSortChange({ key, dir: "asc" });
  };

  const arrow = (key) => (sort.key === key ? (sort.dir === "asc" ? " ▲" : " ▼") : "");

  return (
    <table className={styles.table}>
      <thead>
        <tr>
          {columns.map((c) => (
            <th key={c.key} onClick={() => handleSort(c.key)}>
              {c.label}{!noSortKeys.includes(c.key) ? arrow(c.key) : ""}
            </th>
          ))}
        </tr>
      </thead>

      <tbody>
        {trades.map((t) => {
          // Badges
          const kz = killzoneFor(t.openTime, t.symbol);
          const dur = durationInfo(t.openTime, t.closeTime); // {key,label,minutes} | null
          const outcome = outcomeForTrade(t, 1);

          const pnl = Number(t.netEur ?? 0);
          const pnlClass = isNaN(pnl) ? styles.pnlFlat : pnl > 0 ? styles.pnlPos : pnl < 0 ? styles.pnlNeg : styles.pnlFlat;

          // R/R
          const rr = t.closePrice != null
            ? realizedRR({ entryPrice: t.technical?.entryPrice, stopLoss: t.stopLoss ?? t?.sltpEvents?.at?.(-1)?.sl, closePrice: t.closePrice })
            : plannedRR({ entryPrice: t.technical?.entryPrice, stopLoss: t.stopLoss ?? t?.sltpEvents?.at?.(-1)?.sl, takeProfit: t.takeProfit ?? t?.sltpEvents?.at?.(-1)?.tp, direction: t.direction });

          // Risque %
          const rPct = riskPercent({ capitalAtTrade: t.capitalAtTrade, riskAmountEur: t.riskAmountEur });

          const addinsCount = t.addIns?.length || 0;
          const modsTotal = totalSltpModCount(t);

          return (
            <tr key={t.id}>
              <td><Link to={`/trades/${t.id}`}>{t.symbol}</Link></td>

              {/* Résumé (badges) */}
              <td>
                <div className={styles.summary}>
                  <div className={styles.slot}>
                    <span className={`${styles.chip} ${styles[t.direction?.toLowerCase() || "long"]}`}>
                      {t.direction}
                    </span>
                  </div>

                  <div className={styles.slot}>
                    {kz && (
                      <span className={`${styles.chip} ${kzClass(kz)}`}>
                        {kz}
                      </span>
                    )}
                  </div>

                  <div className={styles.slot}>
                    {dur && (
                      <span
                        className={`${styles.chip} ${styles[`dur_${dur.key}`]}`}
                        title={`${dur.minutes} min`}
                      >
                        {dur.label}
                      </span>
                    )}
                  </div>

                  <div className={styles.slot}>
                    {outcome && (
                      <span className={`${styles.chip} ${styles[outcome.replaceAll(" ", "")]}`}>
                        {outcome}
                      </span>
                    )}
                  </div>

                  <div className={styles.slot}>
                    <span className={`${styles.chip} ${pnlClass}`}>
                      € {t.netEur ?? "-"}
                    </span>
                  </div>
                </div>
              </td>


              {/* R/R */}
              <td>{rr != null ? rr : "-"}</td>

              {/* Risque % */}
              <td>{rPct != null ? `${rPct}%` : "-"}</td>

              {/* Add-ins */}
              <td>{addinsCount > 0 ? `${addinsCount}` : "-"}</td>

              <td>{t.id}</td>
              <td>{t.direction}</td>
              <td>{t.netEur ?? "-"}</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
