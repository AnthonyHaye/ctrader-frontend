import { useEffect, useMemo, useState } from "react";
import { StatsAPI } from "../lib/api";
import KpiGrid from "../components/KpiGrid";
import EquityChart from "../components/EquityChart";
import MonthlyProfitChart from "../components/MonthlyProfitChart";
import SymbolsTable from "../components/SymbolsTable";
import TradesTable from "../components/TradesTable";

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);
  const [kpis, setKpis] = useState(null);
  const [risk, setRisk] = useState(null);
  const [monthly, setMonthly] = useState([]);
  const [symbols, setSymbols] = useState([]);
  const [equity, setEquity] = useState([]);
  const [trades, setTrades] = useState([]);

  const filters = { dateField: "closeTime" };
  const equityStart = 10000;

  useEffect(() => {
    let alive = true;
    setLoading(true); setErr(null);
    (async ()=>{
      try {
        const [g,m,s,e,t] = await Promise.all([
          StatsAPI.global(filters),
          StatsAPI.monthly(filters),
          StatsAPI.symbols(filters),
          StatsAPI.equityCurve({ ...filters, equityStart }),
          StatsAPI.trades(filters),
        ]);
        if (!alive) return;
        setKpis(g?.kpis || null);
        setRisk(g?.risk || null);
        setMonthly(Array.isArray(m?.data)? m.data:[]);
        setSymbols(Array.isArray(s?.data)? s.data:[]);
        setEquity(Array.isArray(e?.data)? e.data:[]);
        setTrades(Array.isArray(t?.items)? t.items:[]);
      } catch(e){ if(alive) setErr(e.message||String(e)); }
      finally { if(alive) setLoading(false); }
    })();
    return ()=>{alive=false};
  }, []);

  const monthlyForChart = useMemo(
    ()=> monthly.map(d=>({ label: `${String(d.month).padStart(2,"0")}/${d.year}`, profit: d.profit??0 })),
    [monthly]
  );

  if (loading) return <div>Chargement…</div>;
  if (err) return <pre style={{color:"crimson"}}>{err}</pre>;

  return (
    <section style={{display:"grid",gap:16}}>
      <KpiGrid kpis={kpis} risk={risk} equityStart={equityStart}/>
      <EquityChart data={equity}/>
      <MonthlyProfitChart data={monthlyForChart}/>
      <SymbolsTable rows={symbols}/>
      <TradesTable rows={trades}/>
    </section>
  );
}
