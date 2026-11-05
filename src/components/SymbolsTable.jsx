export default function SymbolsTable({ rows }) {
  const fmtEur = (n)=> (n??0).toLocaleString("fr-FR",{style:"currency",currency:"EUR"});
  const fmtPct = (n)=> `${(n??0).toLocaleString("fr-FR",{maximumFractionDigits:2})} %`;
  const td = {padding:"8px 10px",borderBottom:"1px solid #f0f0f0"};
  return (
    <div style={{padding:12,border:"1px solid #eee",borderRadius:10}}>
      <div style={{marginBottom:6,fontWeight:600}}>Par symbole</div>
      <div style={{overflowX:"auto"}}>
        <table style={{width:"100%",borderCollapse:"collapse"}}>
          <thead>
            <tr>{["Symbole","Trades","Gagnés","Perdus","Winrate","Profit","Moyenne"].map(h=>
              <th key={h} style={{...td,textAlign:"left"}}>{h}</th>)}
            </tr>
          </thead>
          <tbody>
            {rows.map(r=>(
              <tr key={r.symbol}>
                <td style={td}>{r.symbol}</td>
                <td style={td}>{r.count}</td>
                <td style={td}>{r.wins}</td>
                <td style={td}>{r.losses}</td>
                <td style={td}>{fmtPct(r.winrate)}</td>
                <td style={td}>{fmtEur(r.profit)}</td>
                <td style={td}>{fmtEur(r.avgProfit)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
