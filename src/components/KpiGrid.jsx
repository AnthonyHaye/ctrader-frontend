export function Kpi({ label, value, sub }) {
  return (
    <div style={{padding:12,border:"1px solid #eee",borderRadius:10}}>
      <div style={{fontSize:12,color:"#666"}}>{label}</div>
      <div style={{fontSize:20,fontWeight:700}}>{value}</div>
      {sub ? <div style={{color:"#999"}}>{sub}</div> : null}
    </div>
  );
}

export default function KpiGrid({ kpis, risk, equityStart=10000 }) {
  const fmtEur = (n)=> (n??0).toLocaleString("fr-FR",{style:"currency",currency:"EUR"});
  const fmtPct = (n)=> `${(n??0).toLocaleString("fr-FR",{maximumFractionDigits:2})} %`;
  return (
    <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(160px,1fr))",gap:12}}>
      <Kpi label="Trades" value={kpis?.tradeCount??0}/>
      <Kpi label="Winrate" value={fmtPct(kpis?.winrate)}/>
      <Kpi label="Profit total" value={fmtEur(kpis?.profitTotal)}/>
      <Kpi label="Meilleur trade" value={fmtEur(kpis?.bestTrade)}/>
      <Kpi label="Pire trade" value={fmtEur(kpis?.worstTrade)}/>
      <Kpi label="Équity fin" value={fmtEur(risk?.equityEnd ?? equityStart)} sub={`${fmtEur(equityStart)} →`}/>
    </div>
  );
}
