// TF supérieure + cases A+

import Field from "../../ui/Field";
import IndicatorsSelect from "../Indicators/IndicatorsSelect";
import { higherTfOptions } from "../../helpers";

export default function APlusSection({ v, set, toggleAplus }) {
  const choices = higherTfOptions(v.timeframe);
  const disabled = !v.timeframe;

  return (
    <>
      <div className="grid">
        <Field label="TF supérieure (A+)">
          <select
            className="input"
            value={choices.includes(v.aplusTf) ? v.aplusTf : ""}
            onChange={(e)=>set({ aplusTf: e.target.value })}
            disabled={disabled}
          >
            <option value="">— choisir —</option>
            {choices.map(tf => <option key={tf} value={tf}>{tf}</option>)}
          </select>
        </Field>
      </div>

      <IndicatorsSelect
        selected={v.aplusIndicators}
        onAdd={(key) => !v.aplusIndicators.includes(key) &&
          set({ aplusIndicators: [...v.aplusIndicators, key] })}
        onRemove={(key) => set({
          aplusIndicators: v.aplusIndicators.filter(k => k !== key)
        })}
      />
    </>
  );
}
