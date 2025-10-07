// src/pages/TradeDetail/technical/AddInsTable.jsx
import styles from "./AddInsTable.module.scss";

export default function AddInsTable({ addIns, currentSLTPAddIn, modCountAddIn, className = "" }) {
  if (!addIns?.length) return null;
  return (
    <div className={`${styles.card} ${className}`}>
      <div className={styles.title}>Add-ins (même sens)</div>
      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <thead>
            <tr><th>ID</th><th>Heure</th><th>Entrée</th><th>Taille</th><th>SL (courant)</th><th>TP (courant)</th><th>Modifs</th></tr>
          </thead>
          <tbody>
            {addIns.map((a)=> {
              const cur = currentSLTPAddIn(a);
              const n = modCountAddIn(a);
              return (
                <tr key={a.id}>
                  <td>{a.id}</td>
                  <td>{new Date(a.time).toLocaleString()}</td>
                  <td>{a.entryPrice ?? "-"}</td>
                  <td>{a.positionSize ?? "-"}</td>
                  <td>{cur.sl ?? "-"}</td>
                  <td>{cur.tp ?? "-"}</td>
                  <td>{n}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
