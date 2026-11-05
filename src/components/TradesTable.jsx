export default function TradesTable({ rows }) {
  const fmtEur = (n)=> (n??0).toLocaleString("fr-FR",{style:"currency",currency:"EUR"});
  const td = {padding:"6px 8px",borderBottom:"1px solid #f0f0f0",whiteSpace:"nowrap"};
  return (
    <div style={{padding:12,border:"1px solid #eee",borderRadius:10}}>
      <div style={{marginBottom:6,fontWeight:600}}>Derniers trades</div>
      <div style={{overflowX:"auto"}}>
        <table style={{width:"100%",borderCollapse:"collapse",fontSize:13}}>
          <thead>
            <tr>{["Date close","Symbole","Sens","Prix entrée","Prix sortie","PnL (net)"].map(h=>
              <th key={h} style={{...td,textAlign:"left"}}>{h}</th>)}
            </tr>
          </thead>
          <tbody>
            {rows.map((t)=>(
              <tr key={t._id || `${t.symbol}-${t.closeTime}`}>
                <td style={td}>{t.closeTime ? new Date(t.closeTime).toLocaleString() : "-"}</td>
                <td style={td}>{t.symbol || "-"}</td>
                <td style={td}>{t.side || "-"}</td>
                <td style={td}>{t.entryPrice ?? "-"}</td>
                <td style={td}>{t.closePrice ?? "-"}</td>
                <td style={td}>{fmtEur(t.netProfit ?? t.netPnL ?? t.netEur ?? 0)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
