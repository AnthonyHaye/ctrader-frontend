import styles from "./MultiSelectTags.module.scss";

/**
 * props:
 * - options: [{key, label}]
 * - selected: [string]  // keys
 * - onAdd(key)
 * - onRemove(key)
 * - placeholder?: string
 * - title?: string      // libellé à gauche
 */
export default function MultiSelectTags({
  options,
  selected,
  onAdd,
  onRemove,
  placeholder = "— choisir —",
  title,
}) {
  const available = options.filter(o => !selected.includes(o.key));

  
  return (
    <div className={styles.wrap}>
      <div className={styles.headerRow}>
        {title && <div className={styles.title}>{title}</div>}
        <select
          className={styles.select}
          value=""
          onChange={(e) => {
            const key = e.target.value;
            if (key) onAdd?.(key);
          }}
          aria-label={title || "Ajouter un indicateur"}
        >
          <option value="">{placeholder}</option>
          {available.map((o) => (
            <option key={o.key} value={o.key}>{o.label}</option>
          ))}
        </select>
      </div>

      <div className={styles.tags}>
        {selected.map((k) => {
          const item = options.find(o => o.key === k);
          if (!item) return null;
          return (
            <span key={k} className={styles.tag} role="listitem">
              {item.label}
              <button
                type="button"
                className={styles.x}
                aria-label={`Retirer ${item.label}`}
                onClick={() => onRemove?.(k)}
              >×</button>
            </span>
          );
        })}
        {selected.length === 0 && (
          <span className={styles.hint}>Aucun indicateur sélectionné</span>
        )}
      </div>
    </div>
  );
}
