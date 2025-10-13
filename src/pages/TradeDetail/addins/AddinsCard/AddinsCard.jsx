import styles from "./AddinsCard.module.scss";
import CatalystSelect from "../sections/CatalystSelect";
import SessionSelect from "../sections/SessionSelect";

export default function AddinsCard({ value, onChange }) {
  const v = {
    catalysts: [],
    sessions: [],
    tvLink: "",
    screenshotBefore: "",
    screenshotAfter: "",
    checklist: { respectedPlan: false, respectedRisk: false, emotionOK: false },
    notes: "",
    ...(value || {}),
  };
  const set = (patch) => onChange?.({ ...v, ...patch });

  const add = (key, list) => set({ [list]: [...new Set([...(v[list] || []), key])] });
  const remove = (key, list) => set({ [list]: (v[list] || []).filter((k) => k !== key) });

  // auto-normalise l’URL TradingView
  const setTv = (raw) => {
    const url = raw?.trim();
    if (!url) return set({ tvLink: "" });
    set({ tvLink: /^https?:\/\//i.test(url) ? url : `https://${url}` });
  };

  return (
    <div className={styles.card}>
      <div className={styles.title}>Add-ins</div>

      <div className={styles.grid}>
        <div className={styles.block}>
          <CatalystSelect
            selected={v.catalysts}
            onAdd={(k) => add(k, "catalysts")}
            onRemove={(k) => remove(k, "catalysts")}
          />
        </div>

        <div className={styles.block}>
          <SessionSelect
            selected={v.sessions}
            onAdd={(k) => add(k, "sessions")}
            onRemove={(k) => remove(k, "sessions")}
          />
        </div>

        <label className={styles.field}>
          <span className={styles.label}>Lien TradingView</span>
          <input
            className={styles.input}
            type="url"
            placeholder="https://www.tradingview.com/…"
            value={v.tvLink}
            onChange={(e) => setTv(e.target.value)}
          />
        </label>

        <label className={styles.field}>
          <span className={styles.label}>Screenshot — Avant</span>
          <input
            className={styles.input}
            type="url"
            placeholder="URL de la capture avant"
            value={v.screenshotBefore}
            onChange={(e) => set({ screenshotBefore: e.target.value })}
          />
        </label>

        <label className={styles.field}>
          <span className={styles.label}>Screenshot — Après</span>
          <input
            className={styles.input}
            type="url"
            placeholder="URL de la capture après"
            value={v.screenshotAfter}
            onChange={(e) => set({ screenshotAfter: e.target.value })}
          />
        </label>

        <fieldset className={styles.checks} aria-label="Checklist trade">
          <legend className={styles.label}>Checklist</legend>
          <label className={styles.check}>
            <input
              type="checkbox"
              checked={v.checklist.respectedPlan}
              onChange={(e) => set({ checklist: { ...v.checklist, respectedPlan: e.target.checked } })}
            />
            <span>Plan respecté</span>
          </label>
          <label className={styles.check}>
            <input
              type="checkbox"
              checked={v.checklist.respectedRisk}
              onChange={(e) => set({ checklist: { ...v.checklist, respectedRisk: e.target.checked } })}
            />
            <span>Risque respecté</span>
          </label>
          <label className={styles.check}>
            <input
              type="checkbox"
              checked={v.checklist.emotionOK}
              onChange={(e) => set({ checklist: { ...v.checklist, emotionOK: e.target.checked } })}
            />
            <span>Emotion OK</span>
          </label>
        </fieldset>

        <label className={styles.fieldWide}>
          <span className={styles.label}>Notes / Leçon clé</span>
          <textarea
            className={styles.textarea}
            rows={4}
            placeholder="Ce que j’ai appris, ce que je ferais différemment…"
            value={v.notes}
            onChange={(e) => set({ notes: e.target.value })}
          />
        </label>
      </div>
    </div>
  );
}
