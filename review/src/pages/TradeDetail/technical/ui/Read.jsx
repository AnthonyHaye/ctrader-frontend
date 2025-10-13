import styles from "./Controls.module.scss";
export default function Read({ children }) {
  return <span className={styles.readonly}>{children}</span>;
}
