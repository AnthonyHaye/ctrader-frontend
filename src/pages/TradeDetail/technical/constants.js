// TF_OPTIONS, INDICATORS, SL_TYPES

export const TF_OPTIONS = ["1mn","5mn","15mn","30mn","1h","4h","daily"];
export const INDICATORS = [
  { key:"order_block",label:"Order Block" },
  { key:"breaker_block",label:"Breaker Block" },
  { key:"fvg",label:"FVG" },
  { key:"ifvg",label:"IFVG" },
  { key:"bpr",label:"BPR" },
  { key:"imbalance",label:"Imbalance" },
  { key:"gap",label:"Gap" },
  { key:"liquidity_grab",label:"Prise de liquidité" },
  { key:"rsi",label:"RSI" },
];
export const SL_TYPES = [
  ...INDICATORS.filter(i => i.key!=="rsi"), // mêmes clés, sauf RSI
  { key:"other", label:"Autre…" },
];

// Killzones connues (noms d'affichage)
export const KILLZONES = ["Asia", "London", "New York"];

// Options de placement TP selon le sens du trade
export function tpOptionsFor(direction = "LONG") {
  const isLong = direction === "LONG";
  const side = isLong ? "bsl" : "ssl"; // buy/sell side liquidity
  const sideLabel = isLong ? "Buy Side Liquidity (BSL)" : "Sell Side Liquidity (SSL)";

  const frame = isLong
    ? [
        { key: "pdh", label: "Previous Daily High (PDH)" },
        { key: "pwh", label: "Previous Weekly High (PWH)" },
        { key: "pmh", label: "Previous Monthly High (PMH)" },
      ]
    : [
        { key: "pdl", label: "Previous Daily Low (PDL)" },
        { key: "pwl", label: "Previous Weekly Low (PWL)" },
        { key: "pml", label: "Previous Monthly Low (PML)" },
      ];

  const kz = KILLZONES.map((name) => ({
    key: `kz_${name.toLowerCase()}_${isLong ? "high" : "low"}`,
    label: `${isLong ? "High" : "Low"} ${name} Killzone`,
  }));

  return [
    { key: side, label: sideLabel },
    ...frame,
    ...kz,
    { key: "other", label: "Autre…" },
  ];
}

export const PRICE_ZONES = [
  { key: "discount", label: "Discount (<50%)" },
  { key: "ote",      label: "OTE (62–79%)" },
  { key: "premium",  label: "Premium (>50%)" },
];

export const MIDNIGHT_REL = [
  { key: "above", label: "Au-dessus de Midnight (6h FR)" },
  { key: "below", label: "En-dessous de Midnight (6h FR)" },
  { key: "na",    label: "Non évalué" },
];
