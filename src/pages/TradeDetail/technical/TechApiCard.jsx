// src/pages/TradeDetail/technical/TechApiCard.jsx
import styles from "./TechApiCard.module.scss";

export default function TechApiCard(props) {
  const { orderType, entryPrice, positionSize, currentSL, currentTP, modsCount, timeframes, className = "" } = props;
  return (
    <div className={`${styles.card} ${className}`}>
      <div className={styles.title}>Paramètres techniques (API cTrader)</div>
      <div className={styles.grid}>
        <Read label="Type d’ordre" value={orderType ?? "-"} />
        <Read label="Point d’entrée" value={entryPrice ?? "-"} />
        <Read label="Taille (unités)" value={positionSize ?? "-"} />
        <Read label="SL courant" value={currentSL ?? "-"} />
        <Read label="TP courant" value={currentTP ?? "-"} />
        <Read label="Modifs SL/TP" value={modsCount} />
        <Read label="Timeframes" value={timeframes || "-"} />
      </div>
    </div>
  );
}

function Read({ label, value }) {
  return (
    <label className={styles.field}>
      <span className={styles.label}>{label}</span>
      <span className={styles.ro}>{value}</span>
    </label>
  );
}
