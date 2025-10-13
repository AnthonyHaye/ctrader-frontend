// état contrôlé, merges, toggles

import { useMemo } from "react";
const DEFAULT_VALUE = Object.freeze({
  timeframe:"", indicators:[],
  aplusEnabled:false, aplusTf:"", aplusIndicators:[],
  slPlacementType:"", slPlacementWick:null, slPlacementNote:"",
  tpPlacementType:"", tpPlacementWick:null, tpPlacementNote:""
});

export function useTechForm(value, onChange) {
  const v = useMemo(()=>({ ...DEFAULT_VALUE, ...(value||{}) }), [value]);
  const set = (patch) => onChange?.({ ...v, ...patch });

  const toggle = (listKey) => (key) => {
    const s = new Set(v[listKey]); s.has(key)?s.delete(key):s.add(key);
    set({ [listKey]: Array.from(s) });
  };

  return { v, set, toggle };
}
