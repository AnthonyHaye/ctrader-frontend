import styles from "./TechCard.module.scss";
import Field from "../ui/Field";
import Read from "../ui/Read";
import { useTechForm } from "../hooks/useTechForm";
import ReadonlyInfo from "../sections/ReadonlyInfo";
import TimeframeSelect from "../sections/TimeFrameSelect";
import SLPlacement from "../sections/SLPlacement/SLPlacement";
import TPPlacement from "../sections/TPPlacement/TPPlacement";
import { originalSLTP } from "../helpers";
import IndicatorsSelect from "../sections/Indicators/IndicatorsSelect";
import APlusToggle from "../sections/APlus/AplusToggle";
import APlusSection from "../sections/APlus/AplusSection";
import { plannedRR, riskPercent } from "../../../../utils/derive";
import { PRICE_ZONES, MIDNIGHT_REL } from "../constants";

export default function TechCard({ trade, value, onChange }) {
  const { v, set, toggle } = useTechForm(value, onChange);
  const isShort = trade.direction === "SHORT";
  const { sl: sl0, tp: tp0 } = originalSLTP(trade);
  const priceZone = value?.priceZone || "";           // "discount" | "ote" | "premium" | ""
  const midnightRel = value?.midnightRel || "na";     // "above" | "below" | "na"

  return (
    <div className={styles.card}>
      <div className={styles.title}>Paramètres techniques</div>

        {/* Bloc infos RO + TF principale */}
      <div className={styles.grid}>
        <ReadonlyInfo trade={trade} showSLTP={false} />
        <TimeframeSelect v={v} set={set} />
      </div>

      {/* Lignes jumelées : SL d’origine ↔ Placement du SL */}
      <div className={styles.gridPairs}>
        <Field label="SL d’origine (niveau)"><Read>{sl0 ?? "-"}</Read></Field>
        <SLPlacement v={v} set={set} isShort={isShort} />
      </div>

      {/* Lignes jumelées : TP d’origine ↔ Placement du TP */}
      <div className={styles.gridPairs}>
        <Field label="TP d’origine"><Read>{tp0 ?? "-"}</Read></Field>
        <TPPlacement v={v} set={set} isShort={isShort} direction={trade.direction} />
      </div>


      <IndicatorsSelect
        selected={v.indicators}
        onAdd={(key)=> !v.indicators.includes(key) && set({ indicators: [...v.indicators, key] })}
        onRemove={(key)=> set({ indicators: v.indicators.filter(k => k !== key) })}
      />

              {/* Contexte ICT */}
        <div className={styles.contextBlock}>
          <Field label="Zone de prix (ICT)">
            <div className={styles.radioGroup} role="radiogroup" aria-label="Zone de prix">
              {PRICE_ZONES.map(z => (
                <label key={z.key} className={styles.radio}>
                  <input
                    type="radio"
                    name="price-zone"
                    checked={priceZone === z.key}
                    onChange={() => set({ priceZone: z.key })}
                  />
                  <span>{z.label}</span>
                </label>
              ))}
            </div>
          </Field>

          <Field label="Par rapport à Midnight (6h FR)">
            <div className={styles.radioGroup} role="radiogroup" aria-label="Midnight relation">
              {MIDNIGHT_REL.map(o => (
                <label key={o.key} className={styles.radio}>
                  <input
                    type="radio"
                    name="midnight-rel"
                    checked={midnightRel === o.key}
                    onChange={() => set({ midnightRel: o.key })}
                  />
                  <span>{o.label}</span>
                </label>
              ))}
            </div>

            {/* Badge couleur dépendant du sens du trade */}
            {midnightRel !== "na" && (
              <div style={{ marginTop: 8 }}>
                {(() => {
                  const okForLong  = midnightRel === "above";
                  const okForShort = midnightRel === "below";
                  const cls =
                    trade.direction === "LONG"
                      ? (okForLong ? styles.badgeOk : styles.badgeWarn)
                      : (okForShort ? styles.badgeOk : styles.badgeWarn);
                  const txt =
                    midnightRel === "above" ? "Au-dessus" :
                    midnightRel === "below" ? "En-dessous" : "—";
                  return <span className={`${styles.badge} ${cls}`}>{txt} — {trade.direction}</span>;
                })()}
              </div>
            )}
          </Field>
        </div>

        <div className={styles.aplusWrap}>
              <APlusToggle checked={v.aplusEnabled} onChange={(checked)=>set({ aplusEnabled: checked })} />

              {v.aplusEnabled && (
                <APlusSection v={v} set={set} toggleAplus={toggle("aplusIndicators")} />
              )}
        </div>
    </div>
  );
}
