import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from "recharts";

export default function EquityChart({ data }) {
  return (
    <div style={{padding:12,border:"1px solid #eee",borderRadius:10}}>
      <div style={{marginBottom:6,fontWeight:600}}>Évolution de l'équity</div>
      <ResponsiveContainer width="100%" height={280}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" tickFormatter={(d)=>new Date(d).toLocaleDateString()}/>
          <YAxis />
          <Tooltip labelFormatter={(d)=>new Date(d).toLocaleString()} />
          <Legend />
          <Line type="monotone" dataKey="equity" dot={false}/>
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
