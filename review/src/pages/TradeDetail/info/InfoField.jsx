// src/pages/TradeDetail/info/InfoField.jsx
import styles from "./InfoField.module.scss";
export default function InfoField({ label, value }) {
  return (
    <label className={styles.field}>
      <span className={styles.label}>{label}</span>
      <span className={styles.value}>{value}</span>
    </label>
  );
}
