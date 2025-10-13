// src/pages/TradeDetail/info/InfoCard.jsx
import styles from "./InfoCard.module.scss";

export default function InfoCard({ title, children, className = "" }) {
  return (
    <div className={`${styles.card} ${className}`}>
      <div className={styles.title}>{title}</div>
      <div className={styles.grid}>{children}</div>
    </div>
  );
}

