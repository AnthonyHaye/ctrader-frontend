// Timeframe principal

import Field from "../ui/Field";
import { TF_OPTIONS } from "../constants";
import { higherTfOptions } from "../helpers";

export default function TimeframeSelect({ v, set }) {
  return (
    <Field label="Timeframe">
      <select
        className="input"
        value={v.timeframe}
        onChange={(e) => {
          const tf = e.target.value;
          const next = higherTfOptions(tf);
          const keep = v.aplusTf && next.includes(v.aplusTf);
          set({ timeframe: tf, aplusTf: keep ? v.aplusTf : "" });
        }}
      >
        <option value="">— choisir —</option>
        {TF_OPTIONS.map(tf => <option key={tf} value={tf}>{tf}</option>)}
      </select>
    </Field>
  );
}
