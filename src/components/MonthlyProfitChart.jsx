import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";

export default function MonthlyProfitChart({ data }) {
  return (
    <div style={{padding:12,border:"1px solid #eee",borderRadius:10}}>
      <div style={{marginBottom:6,fontWeight:600}}>Profit par mois</div>
      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3"/>
          <XAxis dataKey="label"/>
          <YAxis/>
          <Tooltip/>
          <Legend/>
          <Bar dataKey="profit"/>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
