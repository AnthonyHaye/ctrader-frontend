import Field from "../../ui/Field";
import styles from "../SLPlacement/SLPlacement.module.scss"; // on réutilise le même style
import { tpOptionsFor } from "../../constants";

export default function TPPlacement({ v, set, isShort, direction = "LONG" }) {
  const preBody = isShort ? "Au-dessus du corps" : "Sous le corps";
  const preWick = isShort ? "Au-dessus de la mèche" : "Sous la mèche";
  const options = tpOptionsFor(direction);

  return (
    <Field label="Placement du TP">
      <select
        className="input"
        value={v.tpPlacementType}
        onChange={(e)=>set({ tpPlacementType: e.target.value, tpPlacementWick: null })}
      >
        <option value="">— choisir —</option>
        {options.map(o => <option key={o.key} value={o.key}>{o.label}</option>)}
      </select>

      {v.tpPlacementType === "other" && (
        <div className={styles.otherWrap}>
          <input
            className="input"
            placeholder={isShort ? "Au-dessus de … (précisez)" : "Sous … (précisez)"}
            value={v.tpPlacementNote || ""}
            onChange={(e)=>set({ tpPlacementNote: e.target.value })}
          />
        </div>
      )}

      {!!v.tpPlacementType && (
        <div className={styles.radioGroup} role="radiogroup" aria-label="Précision TP">
          <label className={styles.radio}>
            <input
              type="radio"
              checked={v.tpPlacementWick === "body"}
              onChange={()=>set({ tpPlacementWick:"body" })}
            />
            <span>{preBody}</span>
          </label>
          <label className={styles.radio}>
            <input
              type="radio"
              checked={v.tpPlacementWick === "wick"}
              onChange={()=>set({ tpPlacementWick:"wick" })}
            />
            <span>{preWick}</span>
          </label>
        </div>
      )}
    </Field>
  );
}
