// src/pages/TradeDetail/TradeDetail.jsx
import { useEffect, useState, useMemo } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import styles from "./TradeDetail.module.scss";
import { fetchTradeById, saveTradeEdits } from "../../services/tradesService";
import { killzoneFor } from "../../utils/killzones";
import { currentSLTP, sltpModCount, currentSLTPAddIn, sltpModCountAddIn } from "../../utils/tradeTech";
import { plannedRR } from "../../utils/derive";

// Composants
import TradeDetailHeader from "./header/TradeDetailHeader";
import InfoCard from "./info/InfoCard";
import InfoField from "./info/InfoField";
import TechApiCard from "./technical/TechApiCard";
import SltpTimeline from "./technical/SltpTimeline";
import AddInsTable from "./technical/AddInsTable";
import PsychForm from "./psych/PsychForm";
import TechUserCard from "./technical/TechUserCard";
import TechCard from "./technical/TechCard/TechCard";
import { AddinsCard } from "./addins";


export default function TradeDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [trade, setTrade] = useState(null);
  const [form, setForm] = useState(null);   
  const [dirty, setDirty] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchTradeById(id).then(t => {
      if (!t) return navigate("/trades");
      setTrade(t);
      setForm({
        emotions: t.emotions || "",
        respectedPlan: !!t.respectedPlan,
        error: t.error || "",
        notes: t.notes || "",
        screenshotsBefore: t.screenshotsBefore || "",
        screenshotsAfter: t.screenshotsAfter || "",
        capitalAtTrade: t.capitalAtTrade ?? "",
        riskAmountEur: t.riskAmountEur ?? "",
        timeframe: t.timeframe || "",                  
        indicators: Array.isArray(t.indicators) ? t.indicators : [],        
        aplusEnabled: !!t.aplusEnabled,
        aplusTf: t.aplusTf || "",
        aplusIndicators: Array.isArray(t.aplusIndicators) ? t.aplusIndicators : [],
        slPlacement: Array.isArray(t.slPlacement) ? t.slPlacement : [],
        slPlacementOther: t.slPlacementOther || "",
        slPlacementType: t.slPlacementType || "",      // "order_block" | "breaker_block" | "fvg" | "ifvg" | "imbalance" | "gap" | "liquidity_grab" | "other" | ""
        slPlacementWick: t.slPlacementWick || null,    // "wick" | "body" | null
        slPlacementNote: t.slPlacementNote || "",      // si "other"        
        tpPlacementType: t.tpPlacementType || "",
        tpPlacementWick: t.tpPlacementWick || null,
        tpPlacementNote: t.tpPlacementNote || "",
        priceZone: t.priceZone || "",
        midnightRel: t.midnightRel || "na",
        addins: t.addins || {
         catalysts: [],
         sessions: [],
         tvLink: "",
         screenshotBefore: "",
         screenshotAfter: "",
         checklist: { respectedPlan:false, respectedRisk:false, emotionOK:false },
         notes: ""
       },
        
      });      
      setDirty(false);
    });
    

  }, [id, navigate]);

  const mergeForm = (patch) => {
    setForm(prev => {
      const next = { ...prev, ...patch };
      setDirty(true);
      return next;
    });
  };

  // bouton “Enregistrer” (header)
  const saveAll = async () => {
    if (!trade || !form) return;
    try {
      setSaving(true);
      // On persiste seulement les champs éditables côté front
      await saveTradeEdits(trade.id, {
        emotions: form.emotions,
        respectedPlan: form.respectedPlan,
        error: form.error,
        notes: form.notes,
        capitalAtTrade: form.capitalAtTrade === "" ? null : Number(form.capitalAtTrade),
        riskAmountEur: form.riskAmountEur === "" ? null : Number(form.riskAmountEur),

        timeframe: form.timeframe,
        indicators: form.indicators,

        aplusEnabled: form.aplusEnabled,
        aplusTf: form.aplusTf,
        aplusIndicators: form.aplusIndicators,        
        slPlacement: form.slPlacement,
        slPlacementOther: form.slPlacementOther,
        slPlacementType: form.slPlacementType || "",
        slPlacementWick: form.slPlacementWick || null,
        slPlacementNote: form.slPlacementNote || "",        
        tpPlacementType: form.tpPlacementType || "",
        tpPlacementWick: form.tpPlacementWick || null,
        tpPlacementNote: form.tpPlacementNote || "",
        priceZone: form.priceZone || "",
        midnightRel: form.midnightRel || "na",
        addins: form.addins,
      });
      setTrade({ ...trade, ...form, addIns: form.addins });
      setDirty(false);
    } finally {
      setSaving(false);
    }
  };

  const kzOpen = useMemo(() => killzoneFor(trade?.openTime, trade?.symbol), [trade]);
  const kzClose = useMemo(() => killzoneFor(trade?.closeTime, trade?.symbol), [trade]);
  const curRoot = useMemo(() => (trade ? currentSLTP(trade) : {}), [trade]);
  const modsRoot = useMemo(() => (trade ? sltpModCount(trade) : 0), [trade]);

  if (!trade || !form) return null;

  const onPsychSave = (patch) => {
    // uniquement champs éditables
    saveTradeEdits(trade.id, patch);
    setTrade({ ...trade, ...patch });
  };

return (
  <div className={styles.page}>
    
    <TradeDetailHeader
        trade={trade}
        onSave={saveAll}
        dirty={dirty}
        saving={saving}
      />

    <div className={styles.grid}>
      {/* Colonne 1 : Infos générales */}
      <InfoCard title="Informations générales" className={`${styles.span1}`}>
        <InfoField label="ID" value={trade.id} />
        <InfoField label="Ouverture" value={fmtDate(trade.openTime)} />
        <InfoField label="Clôture" value={fmtDate(trade.closeTime)} />
        <InfoField label="Entrée" value={trade.technical?.entryPrice ?? "-"} />
        <InfoField label="Sortie" value={trade.closePrice ?? "-"} />
        <InfoField label="€ nets" value={trade.netEur ?? "-"} />
      </InfoCard>

      {/* Colonne 2 : Technique API */}

      <TechCard
          trade={trade}
          value={{
            timeframe: form.timeframe,
            indicators: form.indicators,
            aplusEnabled: form.aplusEnabled,
            aplusTf: form.aplusTf,
            aplusIndicators: form.aplusIndicators,            
            slPlacement: form.slPlacement,
            slPlacementOther: form.slPlacementOther,
            slPlacementType: form.slPlacementType,
            slPlacementWick: form.slPlacementWick,
            slPlacementNote: form.slPlacementNote,
            tpPlacementType: form.tpPlacementType,
            tpPlacementWick: form.tpPlacementWick,
            tpPlacementNote: form.tpPlacementNote,
            priceZone: form.priceZone,
            midnightRel: form.midnightRel,
          }}
          onChange={mergeForm}   
        /> 

        <AddinsCard
          value={form.addins}
          onChange={(next) => mergeForm({ addins: next })}
        />

      {/* Colonne 3 : Add-ins */}
      <AddInsTable
        className={`${styles.span1} ${styles.scroll}`}
        addIns={trade.addIns || []}
        currentSLTPAddIn={currentSLTPAddIn}
        modCountAddIn={sltpModCountAddIn}
      />

      {/* Ligne suivante, pleine largeur : Timeline SL/TP */}
      <SltpTimeline
        className={`${styles.full} ${styles.scroll}`}
        events={trade.sltpEvents || []}
      />

      {/* Psychologie : 2 colonnes de large (sur desktop), sinon full sur petits écrans */}
      <PsychForm
          form={form}
          onChange={mergeForm}   // <— remplace setForm
          // plus de bouton “save” interne
        />
    </div>
  </div>
);

}

function fmtDate(d) { return d ? new Date(d).toLocaleString() : "-"; }
