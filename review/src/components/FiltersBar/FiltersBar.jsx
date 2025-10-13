import styles from "./FiltersBar.module.scss";

export default function FiltersBar({ filters, onChange }) {
  return (
    <div className={styles.bar}>
      <input
        placeholder="Filtrer symbole (ex: EURUSD)"
        value={filters.symbol || ""}
        onChange={(e) => onChange({ ...filters, symbol: e.target.value })}
      />
      <select
        value={filters.direction || ""}
        onChange={(e) => onChange({ ...filters, direction: e.target.value })}
      >
        <option value="">Tous</option>
        <option value="LONG">LONG</option>
        <option value="SHORT">SHORT</option>
      </select>


      <label style={{ display:"flex", gap:8, alignItems:"center" }}>
        <input
          type="checkbox"
          checked={!!filters.hasSltpMods}
          onChange={(e)=> onChange({ ...filters, hasSltpMods: e.target.checked })}
        />
        Modifs SL/TP
      </label>

      <label style={{ display:"flex", gap:8, alignItems:"center" }}>
        <input
          type="checkbox"
          checked={!!filters.hasAddIns}
          onChange={(e)=> onChange({ ...filters, hasAddIns: e.target.checked })}
        />
        Avec add-ins
      </label>

      
    </div>
  );
}
