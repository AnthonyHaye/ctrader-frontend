// src/pages/TradeDetail/psych/PsychForm.jsx
import styles from "./PsychForm.module.scss";

export default function PsychForm({ form, onChange, className = "" }) {
  const set = (k) => (e) => {
    const v = e.target.type === "checkbox" ? e.target.checked : e.target.value;
    onChange({ ...form, [k]: v });
  };

  return (
    <div className={`${styles.card} ${className}`}>
      <div className={styles.title}>Contexte & psychologie</div>
      <div className={styles.grid}>
        <Field label="Émotions"><input value={form.emotions} onChange={set("emotions")} /></Field>
        <Field label="Respect du plan"><input type="checkbox" checked={!!form.respectedPlan} onChange={set("respectedPlan")} /></Field>
        <Field label="Erreur identifiée"><input value={form.error} onChange={set("error")} /></Field>
        <Field label="Notes"><textarea rows={3} value={form.notes} onChange={set("notes")} /></Field>
        <Field label="Capital au trade (€)"><input type="number" value={form.capitalAtTrade} onChange={set("capitalAtTrade")} /></Field>
        <Field label="Risque (€)"><input type="number" value={form.riskAmountEur} onChange={set("riskAmountEur")} /></Field>
      </div>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <label className={styles.field}>
      <span className={styles.label}>{label}</span>
      <div className={styles.control}>{children}</div>
    </label>
  );
}
