// re-export des composants publics

// src/pages/TradeDetail/technical/index.js
export { default as TechCard } from "./TechCard/TechCard";

// Facultatif : seulement si utilisé ailleurs
export { TF_OPTIONS, INDICATORS, SL_TYPES } from "./constants";
export { originalSLTP, higherTfOptions } from "./helpers";
