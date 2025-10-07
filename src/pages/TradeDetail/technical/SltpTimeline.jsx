// src/pages/TradeDetail/technical/SltpTimeline.jsx
import styles from "./SltpTimeline.module.scss";

export default function SltpTimeline({ events, className = "" }) {
  return (
    <div className={`${styles.card} ${className}`}>
      <div className={styles.title}>Évolution SL/TP</div>
      {events.length === 0 ? <div className={styles.empty}>Aucune donnée.</div> : (
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead><tr><th>Heure</th><th>SL</th><th>TP</th><th>Source</th></tr></thead>
            <tbody>
              {events.slice().sort((a,b)=> new Date(a.time)-new Date(b.time)).map((e, i)=>(
                <tr key={i}>
                  <td>{new Date(e.time).toLocaleString()}</td>
                  <td>{e.sl ?? "-"}</td>
                  <td>{e.tp ?? "-"}</td>
                  <td>{e.source || "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
