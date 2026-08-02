import { useState, useMemo } from "react";

const STORES = [{"store_num":"301255","short":"7000 W Military Dr, SA","network":"OMALA"},{"store_num":"346510","short":"9629 White Settlement, Ft Worth","network":"GRG"},{"store_num":"350093","short":"650 Uptown Blvd, Cedar Hill","network":"GRG"},{"store_num":"350918","short":"11026 Culebra Rd, SA","network":"OMALA"},{"store_num":"350940","short":"4935 S Cooper St, Arlington","network":"GRG"},{"store_num":"351985","short":"9230 Potranco Rd, SA","network":"OMALA"},{"store_num":"352495","short":"735 Wilshire Blvd, Burleson","network":"GRG"},{"store_num":"353103","short":"2950 Matlock Rd, Mansfield","network":"GRG"},{"store_num":"353792","short":"7551 Bandera Rd, SA","network":"OMALA"},{"store_num":"355059","short":"1200 N Valley Mills, Waco","network":"VRG"},{"store_num":"355680","short":"7272 Culebra Rd, SA","network":"OMALA"},{"store_num":"355681","short":"214 W Bandera Rd, Boerne","network":"OMALA"},{"store_num":"356104","short":"14510 NW Military Hwy, SA","network":"OMALA"},{"store_num":"356733","short":"423 E Pioneer Pkwy, Grand Prairie","network":"GRG"},{"store_num":"357201","short":"21715 W I-10, SA","network":"OMALA"},{"store_num":"357430","short":"2026 Babcock Rd, SA","network":"OMALA"},{"store_num":"357649","short":"2250 Clear Creek Rd, Killeen","network":"VRG"},{"store_num":"357958","short":"1701 Hewitt Dr, Waco","network":"VRG"},{"store_num":"358035","short":"529 E Knights Way, Harker Hts","network":"VRG"},{"store_num":"358705","short":"11330 Potranco Rd, SA","network":"OMALA"},{"store_num":"358790","short":"8306 Marbach Rd, SA","network":"OMALA"},{"store_num":"358894","short":"8027 W Loop 1604, SA","network":"OMALA"},{"store_num":"358909","short":"12423 Bandera Rd, Helotes","network":"OMALA"},{"store_num":"359470","short":"10222 Huebner Rd, SA","network":"OMALA"},{"store_num":"359496","short":"1516 S Fort Hood, Killeen","network":"VRG"},{"store_num":"359644","short":"12061 FM 2154, College Sta","network":"VRG"},{"store_num":"359888","short":"801 Sidney Baker, Kerrville","network":"VRG"},{"store_num":"362644","short":"5170 Lake Ridge Pkwy, Grand Prairie","network":"GRG"},{"store_num":"362967","short":"7451 W Adams Ave, Temple","network":"VRG"},{"store_num":"363024","short":"2406 E Business 190, Copperas Cove","network":"VRG"},{"store_num":"363236","short":"4501 S Collins St, Arlington","network":"GRG"},{"store_num":"363238","short":"310 S Clark Rd, Duncanville","network":"GRG"},{"store_num":"363902","short":"14048 Culebra Rd, SA","network":"OMALA"},{"store_num":"301869","short":"22W251 North Ave, Glen Ellyn","network":"TRG"},{"store_num":"336862","short":"7450 Barrington Rd, Hanover Park","network":"TRG"},{"store_num":"340608","short":"782 W Oakton St, Des Plaines","network":"TRG"},{"store_num":"344970","short":"656 S Sutton Rd, Streamwood","network":"TRG"},{"store_num":"350476","short":"411 E North Ave, Lombard","network":"TRG"},{"store_num":"351868","short":"2089 Barrington Rd, Hoffman Estates","network":"TRG"},{"store_num":"353655","short":"121 W Ogden Ave, Westmont","network":"TRG"},{"store_num":"354103","short":"298 W North Ave, Villa Park","network":"TRG"},{"store_num":"354748","short":"2263 W Schaumburg Rd, Schaumburg","network":"TRG"},{"store_num":"355784","short":"1921 W Algonquin Rd, Rolling Meadows","network":"TRG"},{"store_num":"355830","short":"200 E Lake St, Bloomingdale","network":"TRG"},{"store_num":"363086","short":"627 Bandera Rd, SA","network":"OMALA"}];

const WEEKLY_RESULTS = [
  { label:"Week ending 5/23", data:{"301255":1357,"346510":1531,"350093":934,"350918":1159,"350940":945,"351985":1234,"352495":767,"353103":1042,"353792":902,"355059":639,"355680":1113,"355681":672,"356104":718,"356733":978,"357201":1574,"357430":1117,"357649":983,"357958":765,"358035":919,"358705":1670,"358790":1535,"358894":1451,"358909":1034,"359470":1146,"359496":949,"359644":1005,"359888":615,"362644":964,"362967":998,"363024":785,"363236":865,"363238":927,"363902":1225} },
  { label:"Week ending 5/30", data:{"301255":1271,"346510":1539,"350093":744,"350918":1028,"350940":801,"351985":1216,"352495":775,"353103":997,"353792":811,"355059":566,"355680":991,"355681":604,"356104":703,"356733":949,"357201":1485,"357430":975,"357649":897,"357958":649,"358035":897,"358705":1581,"358790":1413,"358894":1317,"358909":807,"359470":1220,"359496":901,"359644":871,"359888":604,"362644":859,"362967":871,"363024":870,"363236":818,"363238":766,"363902":1078} },
  { label:"Week ending 6/6",  data:{"301255":1663,"346510":1794,"350093":853,"350918":1433,"350940":1133,"351985":1481,"352495":917,"353103":1195,"353792":912,"355059":729,"355680":1404,"355681":730,"356104":828,"356733":1101,"357201":1650,"357430":1266,"357649":1136,"357958":802,"358035":1045,"358705":1800,"358790":1775,"358894":1604,"358909":1024,"359470":1462,"359496":1001,"359644":1169,"359888":658,"362644":1021,"362967":1226,"363024":989,"363236":1013,"363238":911,"363902":1328} },
  { label:"Week ending 6/13", data:{"301255":1266,"346510":1496,"350093":794,"350918":944,"350940":815,"351985":1087,"352495":716,"353103":993,"353792":763,"355059":574,"355680":1184,"355681":625,"356104":694,"356733":977,"357201":1341,"357430":1012,"357649":933,"357958":628,"358035":889,"358705":1567,"358790":1274,"358894":1404,"358909":783,"359470":1115,"359496":898,"359644":970,"359888":656,"362644":868,"362967":1054,"363024":718,"363236":762,"363238":827,"363902":1047} },
  { label:"Week ending 6/20", data:{"301255":1201,"346510":1408,"350093":747,"350918":1131,"350940":910,"351985":1109,"352495":838,"353103":989,"353792":767,"355059":659,"355680":1008,"355681":696,"356104":682,"356733":919,"357201":1367,"357430":1025,"357649":1011,"357958":728,"358035":745,"358705":1511,"358790":1324,"358894":1426,"358909":894,"359470":1110,"359496":873,"359644":965,"359888":790,"362644":872,"362967":998,"363024":805,"363236":800,"363238":798,"363902":1122} },
  { label:"Week ending 6/27", data:{"301255":1102,"346510":1350,"350093":767,"350918":999,"350940":786,"351985":1026,"352495":705,"353103":927,"353792":739,"355059":553,"355680":988,"355681":605,"356104":666,"356733":846,"357201":1341,"357430":959,"357649":877,"357958":682,"358035":818,"358705":1501,"358790":1328,"358894":1483,"358909":815,"359470":1142,"359496":865,"359644":896,"359888":617,"362644":769,"362967":963,"363024":773,"363236":802,"363238":742,"363902":1035,"301869":1549,"336862":1065,"340608":493,"344970":992,"350476":1482,"351868":1044,"353655":897,"354103":1121,"354748":1720,"355784":947,"355830":1701,"363086":885} },
  { label:"Week ending 7/4", data:{"301255":1152,"346510":1406,"350093":708,"350918":1063,"350940":787,"351985":1164,"352495":787,"353103":949,"353792":730,"355059":605,"355680":953,"355681":583,"356104":610,"356733":843,"357201":1232,"357430":995,"357649":887,"357958":636,"358035":807,"358705":1519,"358790":1260,"358894":1417,"358909":820,"359470":1063,"359496":884,"359644":874,"359888":583,"362644":922,"362967":1020,"363024":751,"363236":795,"363238":728,"363902":1085,"301869":1294,"336862":1024,"340608":365,"344970":984,"350476":1329,"351868":904,"353655":681,"354103":1012,"354748":1452,"355784":885,"355830":1473,"363086":806} },
  { label:"Week ending 7/11", data:{"301255":1110,"346510":1292,"350093":716,"350918":1011,"350940":808,"351985":1021,"352495":713,"353103":1029,"353792":648,"355059":570,"355680":961,"355681":573,"356104":727,"356733":822,"357201":1222,"357430":945,"357649":846,"357958":637,"358035":839,"358705":1369,"358790":1102,"358894":1251,"358909":904,"359470":1109,"359496":840,"359644":859,"359888":609,"362644":762,"362967":843,"363024":724,"363236":760,"363238":703,"363902":1039,"301869":1311,"336862":1009,"340608":388,"344970":1041,"350476":1357,"351868":909,"353655":745,"354103":1057,"354748":1461,"355784":866,"355830":1595,"363086":764} },
  { label:"Week ending 7/18", data:{"301255":1234,"346510":1458,"350093":854,"350918":1063,"350940":935,"351985":1124,"352495":783,"353103":1072,"353792":689,"355059":634,"355680":1039,"355681":522,"356104":701,"356733":1005,"357201":1316,"357430":982,"357649":929,"357958":666,"358035":842,"358705":1518,"358790":1433,"358894":1332,"358909":775,"359470":1050,"359496":1027,"359644":1058,"359888":669,"362644":830,"362967":1001,"363024":863,"363236":874,"363238":894,"363902":1007,"301869":1370,"336862":1007,"340608":384,"344970":1030,"350476":1351,"351868":1034,"353655":727,"354103":1028,"354748":1593,"355784":828,"355830":1607,"363086":876} },
  { label:"Week ending 7/25", data:{"301255":1219,"346510":1302,"350093":792,"350918":991,"350940":879,"351985":1038,"352495":704,"353103":1049,"353792":749,"355059":602,"355680":1042,"355681":593,"356104":628,"356733":906,"357201":1322,"357430":947,"357649":823,"357958":593,"358035":763,"358705":1474,"358790":1144,"358894":1369,"358909":826,"359470":1198,"359496":935,"359644":903,"359888":681,"362644":946,"362967":941,"363024":754,"363236":787,"363238":746,"363902":954,"301869":1409,"336862":946,"340608":492,"344970":1058,"350476":1402,"351868":998,"353655":891,"354103":1025,"354748":1457,"355784":818,"355830":1539,"363086":928} },
  { label:"Week ending 8/1", data:{"301255":1108,"346510":1396,"350093":859,"350918":1066,"350940":946,"351985":1066,"352495":768,"353103":1054,"353792":769,"355059":660,"355680":1000,"355681":575,"356104":670,"356733":957,"357201":1423,"357430":990,"357649":882,"357958":628,"358035":783,"358705":1422,"358790":1266,"358894":1362,"358909":844,"359470":1231,"359496":974,"359644":1006,"359888":808,"362644":862,"362967":966,"363024":744,"363236":864,"363238":739,"363902":1027,"301869":1152,"336862":996,"340608":483,"344970":1127,"350476":1513,"351868":958,"353655":707,"354103":1091,"354748":1417,"355784":886,"355830":1616,"363086":902} },
];

const NET_COLORS = { GRG:"#EC762F", VRG:"#2C6FAC", OMALA:"#1D9E75", TRG:"#8B3FA8" };

function computeGoals(weekIdx) {
  const goals = {};
  STORES.forEach(s => {
    const lookback = WEEKLY_RESULTS.slice(Math.max(0, weekIdx - 5), weekIdx);
    const vals = lookback.map(w => w.data[s.store_num]).filter(v => v !== undefined);
    if (!vals.length) { goals[s.store_num] = { avg:0, g5:0, g10:0 }; return; }
    const avg = Math.round(vals.reduce((a,b)=>a+b,0)/vals.length);
    goals[s.store_num] = { avg, g5: Math.round(avg*1.05), g10: Math.round(avg*1.10) };
  });
  return goals;
}

function getStatus(val, g5, g10) {
  if (!val) return "pending";
  const n = Number(val);
  if (!n) return "pending";
  if (n >= g10) return "gold";
  if (n >= g5)  return "green";
  if (n >= g5 * 0.97) return "close";
  return "miss";
}

const STATUS_META = {
  gold:    { label:"🏆 +10%",  bg:"#FFF9E6", border:"#F4C430", text:"#7A5800" },
  green:   { label:"✅ Goal",  bg:"#E8F8F2", border:"#1D9E75", text:"#0F6E56" },
  close:   { label:"🔶 Close", bg:"#FFF4EC", border:"#EC762F", text:"#7A3200" },
  miss:    { label:"❌ Miss",  bg:"#FFF0F0", border:"#E24B4A", text:"#7A1F1F" },
  pending: { label:"— TBD",   bg:"#F5F5F5", border:"#ddd",    text:"#999"    },
};

const sel = {
  padding:"8px 14px", borderRadius:8, border:"2px solid #EC762F",
  fontSize:13, fontWeight:700, color:"#EC762F", background:"#fff",
  cursor:"pointer", outline:"none", WebkitAppearance:"none", appearance:"none",
  backgroundImage:`url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%23EC762F' stroke-width='2' fill='none' stroke-linecap='round'/%3E%3C/svg%3E")`,
  backgroundRepeat:"no-repeat", backgroundPosition:"right 10px center", paddingRight:32
};

export default function App() {
  const last = WEEKLY_RESULTS.length - 1;
  const [weekIdx, setWeekIdx]     = useState(last);
  const [posterIdx, setPosterIdx] = useState(last);
  const [view, setView]           = useState("leaderboard");
  const [network, setNetwork]     = useState("ALL");

  const goals  = useMemo(() => computeGoals(weekIdx),  [weekIdx]);
  const pGoals = useMemo(() => computeGoals(posterIdx), [posterIdx]);

  const withStatus = useMemo(() => STORES.map(s => {
    const val    = WEEKLY_RESULTS[weekIdx].data[s.store_num];
    const g      = goals[s.store_num] || {avg:0,g5:0,g10:0};
    const status = getStatus(val, g.g5, g.g10);
    const pct    = (val && g.avg) ? Math.round(((val-g.avg)/g.avg)*100) : null;
    return {...s, val, status, pct, ...g};
  }), [weekIdx, goals]);

  const filtered = network==="ALL" ? withStatus : withStatus.filter(s=>s.network===network);
  const sorted   = [...filtered].sort((a,b)=>{
    const o={gold:0,green:1,close:2,miss:3,pending:4};
    if(o[a.status]!==o[b.status]) return o[a.status]-o[b.status];
    return (Number(b.val)||0)-(Number(a.val)||0);
  });

  const hitting = withStatus.filter(s=>s.status==="gold"||s.status==="green");
  const gold    = withStatus.filter(s=>s.status==="gold");

  const posterStores = useMemo(() => STORES.map(s=>{
    const val=WEEKLY_RESULTS[posterIdx].data[s.store_num];
    const g=pGoals[s.store_num]||{avg:0,g5:0,g10:0};
    return {...s,val,status:getStatus(val,g.g5,g.g10),...g};
  }).filter(s=>s.status==="gold"||s.status==="green")
    .sort((a,b)=>a.status===b.status?(Number(b.val)-Number(a.val)):(a.status==="gold"?-1:1)),
  [posterIdx, pGoals]);

  return (
    <div style={{fontFamily:"Arial,sans-serif",maxWidth:900,margin:"0 auto",paddingBottom:48}}>

      <div style={{background:"linear-gradient(135deg,#EC762F 0%,#C8550A 100%)",padding:"24px 28px 22px",borderRadius:"0 0 16px 16px",marginBottom:24}}>
        <div style={{fontSize:11,fontWeight:700,letterSpacing:3,color:"rgba(255,255,255,0.7)",textTransform:"uppercase",marginBottom:4}}>Gratitude Restaurant Group</div>
        <div style={{fontSize:26,fontWeight:900,color:"#fff",lineHeight:1.1}}>🍩 No Donut Left Behind</div>
        <div style={{fontSize:13,color:"rgba(255,255,255,0.8)",marginTop:4}}>Weekly donut unit leaderboard · {STORES.length} stores · Goals = rolling 5-wk avg +5% / +10%</div>
        <div style={{display:"flex",gap:10,marginTop:18,flexWrap:"wrap"}}>
          {[{label:"Hitting Goal",val:`${hitting.length}/${STORES.length}`,accent:"#fff"},{label:"Gold (+10%)",val:gold.length,accent:"#F4C430"},{label:"On Goal (+5%)",val:hitting.length-gold.length,accent:"#7AE6B0"}].map(p=>(
            <div key={p.label} style={{background:"rgba(0,0,0,0.2)",borderRadius:8,padding:"8px 16px"}}>
              <div style={{fontSize:22,fontWeight:900,color:p.accent}}>{p.val}</div>
              <div style={{fontSize:11,color:"rgba(255,255,255,0.75)"}}>{p.label}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{display:"flex",gap:8,padding:"0 16px",marginBottom:22}}>
        {[["leaderboard","📊 Leaderboard"],["poster","🎉 Winner Poster"]].map(([v,label])=>(
          <button key={v} onClick={()=>setView(v)} style={{padding:"9px 20px",borderRadius:8,border:"none",cursor:"pointer",fontWeight:700,fontSize:13,background:view===v?"#EC762F":"#f0f0f0",color:view===v?"#fff":"#444"}}>{label}</button>
        ))}
      </div>

      {view==="leaderboard" && (
        <div style={{padding:"0 16px"}}>
          <div style={{display:"flex",gap:12,marginBottom:18,flexWrap:"wrap",alignItems:"center"}}>
            <select value={weekIdx} onChange={e=>setWeekIdx(Number(e.target.value))} style={sel}>
              {WEEKLY_RESULTS.map((w,i)=><option key={i} value={i}>{w.label}</option>)}
            </select>
            <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
              {["ALL","GRG","VRG","OMALA","TRG"].map(n=>(
                <button key={n} onClick={()=>setNetwork(n)} style={{padding:"7px 14px",borderRadius:6,fontWeight:700,fontSize:12,cursor:"pointer",border:`2px solid ${network===n?(NET_COLORS[n]||"#555"):"#ddd"}`,background:network===n?(NET_COLORS[n]||"#555"):"#fff",color:network===n?"#fff":"#555"}}>{n==="ALL"?"All":n}</button>
              ))}
            </div>
          </div>
          <div style={{display:"flex",flexDirection:"column",gap:6}}>
            {sorted.map((s,idx)=>{
              const m=STATUS_META[s.status];
              return (
                <div key={s.store_num} style={{display:"flex",alignItems:"center",gap:10,background:m.bg,border:`1.5px solid ${m.border}`,borderRadius:10,padding:"10px 14px"}}>
                  <div style={{width:28,textAlign:"center",fontSize:13,fontWeight:900,color:"#bbb",flexShrink:0}}>{s.status!=="pending"?`#${idx+1}`:"—"}</div>
                  <div style={{width:10,height:10,borderRadius:"50%",background:NET_COLORS[s.network],flexShrink:0}}/>
                  <div style={{flex:1,minWidth:0}}>
                    <div style={{fontWeight:700,fontSize:13,color:"#222",whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{s.short}</div>
                    <div style={{fontSize:11,color:"#888",marginTop:1}}>{s.network} · 5wk avg: {s.avg.toLocaleString()} · Goal: {s.g5.toLocaleString()}–{s.g10.toLocaleString()}</div>
                  </div>
                  <div style={{textAlign:"right",flexShrink:0,minWidth:60}}>
                    <div style={{fontSize:18,fontWeight:900,color:m.text}}>{s.val?Number(s.val).toLocaleString():"—"}</div>
                    {s.pct!==null&&<div style={{fontSize:11,fontWeight:700,color:s.pct>=0?"#1D9E75":"#E24B4A"}}>{s.pct>=0?"+":""}{s.pct}% vs avg</div>}
                  </div>
                  <div style={{fontSize:11,fontWeight:700,padding:"3px 8px",borderRadius:5,flexShrink:0,background:m.border+"22",color:m.text}}>{m.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {view==="poster" && (
        <div style={{padding:"0 16px"}}>
          <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:20,flexWrap:"wrap"}}>
            <div style={{fontWeight:700,fontSize:13,color:"#444"}}>Generate poster for:</div>
            <select value={posterIdx} onChange={e=>setPosterIdx(Number(e.target.value))} style={sel}>
              {WEEKLY_RESULTS.map((w,i)=><option key={i} value={i}>{w.label}</option>)}
            </select>
          </div>
          <div style={{background:"linear-gradient(160deg,#1a0a00 0%,#3D1A00 55%,#EC762F 100%)",borderRadius:16,padding:"36px 28px 32px",color:"#fff",boxShadow:"0 8px 32px rgba(0,0,0,0.25)"}}>
            <div style={{textAlign:"center",marginBottom:28}}>
              <div style={{fontSize:44,marginBottom:6}}>🍩</div>
              <div style={{fontSize:11,letterSpacing:4,fontWeight:700,color:"#F4C430",textTransform:"uppercase",marginBottom:6}}>No Donut Left Behind</div>
              <div style={{fontSize:28,fontWeight:900,lineHeight:1.1}}>{WEEKLY_RESULTS[posterIdx].label} — Champions</div>
              <div style={{fontSize:13,color:"rgba(255,255,255,0.6)",marginTop:6}}>Stores hitting their rolling donut unit goals · Gratitude Restaurant Group</div>
            </div>
            {posterStores.length===0 ? (
              <div style={{textAlign:"center",color:"rgba(255,255,255,0.4)",padding:"32px 0",fontSize:14}}>No results available for this week yet.</div>
            ):(
              <>
                {posterStores.filter(s=>s.status==="gold").length>0&&(
                  <div style={{marginBottom:20}}>
                    <div style={{fontSize:11,fontWeight:700,letterSpacing:3,color:"#F4C430",textTransform:"uppercase",marginBottom:10}}>🏆 Gold Tier — +10% or better</div>
                    <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(190px,1fr))",gap:8}}>
                      {posterStores.filter(s=>s.status==="gold").map(s=>(
                        <div key={s.store_num} style={{background:"rgba(244,196,48,0.15)",border:"1.5px solid #F4C430",borderRadius:10,padding:"12px 14px"}}>
                          <div style={{fontSize:13,fontWeight:800,color:"#F4C430",lineHeight:1.3}}>{s.short}</div>
                          <div style={{fontSize:11,color:"rgba(255,255,255,0.5)",marginTop:2}}>{s.network}</div>
                          <div style={{fontSize:22,fontWeight:900,color:"#fff",marginTop:6}}>{Number(s.val).toLocaleString()} <span style={{fontSize:11,color:"#F4C430"}}>units</span></div>
                          <div style={{fontSize:11,color:"#F4C430",fontWeight:700,marginTop:2}}>Goal was {s.g10.toLocaleString()} ✓</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {posterStores.filter(s=>s.status==="green").length>0&&(
                  <div>
                    <div style={{fontSize:11,fontWeight:700,letterSpacing:3,color:"#7AE6B0",textTransform:"uppercase",marginBottom:10}}>✅ Goal Tier — +5% or better</div>
                    <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(175px,1fr))",gap:8}}>
                      {posterStores.filter(s=>s.status==="green").map(s=>(
                        <div key={s.store_num} style={{background:"rgba(29,158,117,0.15)",border:"1.5px solid #1D9E75",borderRadius:10,padding:"12px 14px"}}>
                          <div style={{fontSize:13,fontWeight:800,color:"#7AE6B0",lineHeight:1.3}}>{s.short}</div>
                          <div style={{fontSize:11,color:"rgba(255,255,255,0.5)",marginTop:2}}>{s.network}</div>
                          <div style={{fontSize:20,fontWeight:900,color:"#fff",marginTop:6}}>{Number(s.val).toLocaleString()} <span style={{fontSize:11,color:"#7AE6B0"}}>units</span></div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
            <div style={{textAlign:"center",marginTop:28,fontSize:11,color:"rgba(255,255,255,0.3)"}}>Gratitude Restaurant Group · Anthony Rodriguez, VP Operations</div>
          </div>
        </div>
      )}
    </div>
  );
}
