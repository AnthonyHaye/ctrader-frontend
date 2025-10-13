// type + body/wick + note

import { SL_TYPES } from "../../constants";
import Field from "../../ui/Field";
import styles from "./SLPlacement.module.scss";

export default function SLPlacement({ v, set, isShort }) {
  const preBody = isShort ? "Au-dessus du corps" : "Sous le corps";
  const preWick = isShort ? "Au-dessus de la mèche" : "Sous la mèche";

  return (
    <Field label="Placement du SL">
      <select
        className="input"
        value={v.slPlacementType}
        onChange={(e)=>set({ slPlacementType: e.target.value, slPlacementWick: null })}
      >
        <option value="">— choisir —</option>
        {SL_TYPES.map(o => <option key={o.key} value={o.key}>{o.label}</option>)}
      </select>

      {v.slPlacementType === "other" && (
        <div className={styles.otherWrap}>
          <input
            className="input"
            placeholder={isShort ? "Au-dessus de … (précisez)" : "Sous … (précisez)"}
            value={v.slPlacementNote}
            onChange={(e)=>set({ slPlacementNote: e.target.value })}
          />
        </div>
      )}

      {!!v.slPlacementType && (
        <div className={styles.radioGroup} role="radiogroup" aria-label="Précision SL">
          <label className={styles.radio}>
            <input type="radio"
              checked={v.slPlacementWick === "body"}
              onChange={()=>set({ slPlacementWick:"body" })}
            />
            <span>{preBody}</span>
          </label>
          <label className={styles.radio}>
            <input type="radio"
              checked={v.slPlacementWick === "wick"}
              onChange={()=>set({ slPlacementWick:"wick" })}
            />
            <span>{preWick}</span>
          </label>
        </div>
      )}
    </Field>
  );
}
