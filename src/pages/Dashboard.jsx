import { useEffect, useState, useMemo } from "react";
import { fetchTrades } from "../services/tradesService";
import { winrate, totalPnL } from "../utils/stats";
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from "recharts";

function pnlCurve(trades) {
  let acc = 0;
  return trades
    .slice()
    .sort((a,b)=> new Date(a.closeTime)-new Date(b.closeTime))
    .map(t => ({ date: t.closeTime, pnl: (acc += Number(t.netEur || 0)) }));
}

export default function Dashboard() {
  const [trades, setTrades] = useState([]);
  useEffect(() => { fetchTrades().then(setTrades); }, []);

  const wr = useMemo(()=>winrate(trades), [trades]);
  const pnl = useMemo(()=>totalPnL(trades), [trades]);
  const curve = useMemo(()=>pnlCurve(trades), [trades]);

  return (
    <section style={{ display: "grid", gap: 16 }}>
      <div style={{ display: "flex", gap: 16 }}>
        <div><strong>Winrate</strong><div>{wr}%</div></div>
        <div><strong>PnL total</strong><div>{pnl.toFixed(2)} €</div></div>
      </div>

      <div style={{ height: 300 }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={curve}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" tickFormatter={(d)=>new Date(d).toLocaleDateString()} />
            <YAxis />
            <Tooltip labelFormatter={(d)=>new Date(d).toLocaleString()} />
            <Line type="monotone" dataKey="pnl" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}
