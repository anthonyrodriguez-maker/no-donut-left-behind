import { useState, useMemo } from "react";

const STORES = [{"store_num":"301255","short":"7000 W Military Dr, SA","network":"OMALA"},{"store_num":"346510","short":"9629 White Settlement, Ft Worth","network":"GRG"},{"store_num":"350093","short":"650 Uptown Blvd, Cedar Hill","network":"GRG"},{"store_num":"350918","short":"11026 Culebra Rd, SA","network":"OMALA"},{"store_num":"350940","short":"4935 S Cooper St, Arlington","network":"GRG"},{"store_num":"351985","short":"9230 Potranco Rd, SA","network":"OMALA"},{"store_num":"352495","short":"735 Wilshire Blvd, Burleson","network":"GRG"},{"store_num":"353103","short":"2950 Matlock Rd, Mansfield","network":"GRG"},{"store_num":"353792","short":"7551 Bandera Rd, SA","network":"OMALA"},{"store_num":"355059","short":"1200 N Valley Mills, Waco","network":"VRG"},{"store_num":"355680","short":"7272 Culebra Rd, SA","network":"OMALA"},{"store_num":"355681","short":"214 W Bandera Rd, Boerne","network":"OMALA"},{"store_num":"356104","short":"14510 NW Military Hwy, SA","network":"OMALA"},{"store_num":"356733","short":"423 E Pioneer Pkwy, Grand Prairie","network":"GRG"},{"store_num":"357201","short":"21715 W I-10, SA","network":"OMALA"},{"store_num":"357430","short":"2026 Babcock Rd, SA","network":"OMALA"},{"store_num":"357649","short":"2250 Clear Creek Rd, Killeen","network":"VRG"},{"store_num":"357958","short":"1701 Hewitt Dr, Waco","network":"VRG"},{"store_num":"358035","short":"529 E Knights Way, Harker Hts","network":"VRG"},{"store_num":"358705","short":"11330 Potranco Rd, SA","network":"OMALA"},{"store_num":"358790","short":"8306 Marbach Rd, SA","network":"OMALA"},{"store_num":"358894","short":"8027 W Loop 1604, SA","network":"OMALA"},{"store_num":"358909","short":"12423 Bandera Rd, Helotes","network":"OMALA"},{"store_num":"359470","short":"10222 Huebner Rd, SA","network":"OMALA"},{"store_num":"359496","short":"1516 S Fort Hood, Killeen","network":"VRG"},{"store_num":"359644","short":"12061 FM 2154, College Sta","network":"VRG"},{"store_num":"359888","short":"801 Sidney Baker, Kerrville","network":"VRG"},{"store_num":"362644","short":"5170 Lake Ridge Pkwy, Grand Prairie","network":"GRG"},{"store_num":"362967","short":"7451 W Adams Ave, Temple","network":"VRG"},{"store_num":"363024","short":"2406 E Business 190, Copperas Cove","network":"VRG"},{"store_num":"363236","short":"4501 S Collins St, Arlington","network":"GRG"},{"store_num":"363238","short":"310 S Clark Rd, Duncanville","network":"GRG"},{"store_num":"363902","short":"14048 Culebra Rd, SA","network":"OMALA"}];

const WEEKLY_RESULTS = [
  { label:"Week ending 5/23", data:{"301255":1357,"346510":1531,"350093":934,"350918":1159,"350940":945,"351985":1234,"352495":767,"353103":1042,"353792":902,"355059":639,"355680":1113,"355681":672,"356104":718,"356733":978,"357201":1574,"357430":1117,"357649":983,"357958":765,"358035":919,"358705":1670,"358790":1535,"358894":1451,"358909":1034,"359470":1146,"359496":949,"359644":1005,"359888":615,"362644":964,"362967":998,"363024":785,"363236":865,"363238":927,"363902":1225} },
  { label:"Week ending 5/30", data:{"301255":1271,"346510":1539,"350093":744,"350918":1028,"350940":801,"351985":1216,"352495":775,"353103":997,"353792":811,"355059":566,"355680":991,"355681":604,"356104":703,"356733":949,"357201":1485,"357430":975,"357649":897,"357958":649,"358035":897,"358705":1581,"358790":1413,"358894":1317,"358909":807,"359470":1220,"359496":901,"359644":871,"359888":604,"362644":859,"362967":871,"363024":870,"363236":818,"363238":766,"363902":1078} },
  { label:"Week ending 6/6",  data:{"301255":1663,"346510":1794,"350093":853,"350918":1433,"350940":1133,"351985":1481,"352495":917,"353103":1195,"353792":912,"355059":729,"355680":1404,"355681":730,"356104":828,"356733":1101,"357201":1650,"357430":1266,"357649":1136,"357958":802,"358035":1045,"358705":1800,"358790":1775,"358894":1604,"358909":1024,"359470":1462,"359496":1001,"359644":1169,"359888":658,"362644":1021,"362967":1226,"363024":989,"363236":1013,"363238":911,"363902":1328} },
  { label:"Week ending 6/13", data:{"301255":1266,"346510":1496,"350093":794,"350918":944,"350940":815,"351985":1087,"352495":716,"353103":993,"353792":763,"355059":574,"355680":1184,"355681":625,"356104":694,"356733":977,"357201":1341,"357430":1012,"357649":933,"357958":628,"358035":889,"358705":1567,"358790":1274,"358894":1404,"358909":783,"359470":1115,"359496":898,"359644":970,"359888":656,"362644":868,"362967":1054,"363024":718,"363236":762,"363238":827,"363902":1047} },
  { label:"Week ending 6/20", data:{"301255":1201,"346510":1408,"350093":747,"350918":1131,"350940":910,"351985":1109,"352495":838,"353103":989,"353792":767,"355059":659,"355680":1008,"355681":696,"356104":682,"356733":919,"357201":1367,"357430":1025,"357649":1011,"357958":728,"358035":745,"358705":1511,"358790":1324,"358894":1426,"358909":894,"359470":1110,"359496":873,"359644":965,"359888":790,"362644":872,"362967":998,"363024":805,"363236":800,"363238":798,"363902":1122} },
];

const MORNING_HRS_DAY = 5;
const ROD_HRS_DAY = 13.5;
const TOTAL_HRS_DAY = 18.5;
const DAYS = 7;
const MORNING_PCT = 0.589; // Based on actual TX transaction split (58.9% morning)
const ROD_PCT = 0.411; // Based on actual TX transaction split (41.1% ROD)

const NET_COLORS = { GRG:"#EC762F", VRG:"#2C6FAC", OMALA:"#1D9E75" };

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

function MissPanel({ store, onClose }) {
  const miss = store.g5 - Number(store.val);
  const perDay = (miss / DAYS).toFixed(1);
  const perHr  = (miss / (TOTAL_HRS_DAY * DAYS)).toFixed(2);
  const mornMiss = Math.round(miss * MORNING_PCT);
  const rodMiss  = Math.round(miss * ROD_PCT);
  const mornPerDay = (mornMiss / DAYS).toFixed(1);
  const rodPerDay  = (rodMiss / DAYS).toFixed(1);
  const mornPerHr  = (mornMiss / (MORNING_HRS_DAY * DAYS)).toFixed(2);
  const rodPerHr   = (rodMiss / (ROD_HRS_DAY * DAYS)).toFixed(2);
  const extraPerHr = Number((miss / (TOTAL_HRS_DAY * DAYS)).toFixed(2));
  const oneEvery   = extraPerHr > 0 ? (1 / extraPerHr).toFixed(1) : "—";
  const nc = NET_COLORS[store.network];

  return (
    <div style={{border:`2px solid ${nc}`,borderRadius:14,marginBottom:8,overflow:"hidden",background:"#fff"}}>

      {/* Panel header */}
      <div style={{background:`linear-gradient(135deg,${nc} 0%,#1a1a1a 100%)`,padding:"16px 18px"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
          <div>
            <div style={{fontSize:10,fontWeight:700,letterSpacing:2,color:"rgba(255,255,255,0.6)",textTransform:"uppercase",marginBottom:2}}>{store.network} · Miss Breakdown</div>
            <div style={{fontSize:16,fontWeight:900,color:"#fff"}}>{store.short}</div>
          </div>
          <button onClick={onClose} style={{background:"rgba(255,255,255,0.2)",border:"none",color:"#fff",borderRadius:6,padding:"5px 10px",cursor:"pointer",fontWeight:700,fontSize:12}}>✕ Close</button>
        </div>
        <div style={{display:"flex",gap:10,marginTop:12,flexWrap:"wrap"}}>
          <div style={{background:"rgba(0,0,0,0.25)",borderRadius:7,padding:"6px 12px"}}>
            <div style={{fontSize:10,color:"rgba(255,255,255,0.6)"}}>Actual</div>
            <div style={{fontSize:18,fontWeight:900,color:"#fff"}}>{Number(store.val).toLocaleString()}</div>
          </div>
          <div style={{background:"rgba(0,0,0,0.25)",borderRadius:7,padding:"6px 12px"}}>
            <div style={{fontSize:10,color:"rgba(255,255,255,0.6)"}}>Goal (+5%)</div>
            <div style={{fontSize:18,fontWeight:900,color:"#fff"}}>{store.g5.toLocaleString()}</div>
          </div>
          <div style={{background:"rgba(226,75,74,0.45)",border:"1px solid #E24B4A",borderRadius:7,padding:"6px 12px"}}>
            <div style={{fontSize:10,color:"rgba(255,255,255,0.7)"}}>Total Miss</div>
            <div style={{fontSize:18,fontWeight:900,color:"#ffaaaa"}}>−{miss.toLocaleString()} units</div>
          </div>
        </div>
      </div>

      <div style={{padding:"16px 18px"}}>

        {/* Coaching line */}
        <div style={{background:"#FFF0F0",border:"1.5px solid #E24B4A",borderRadius:9,padding:"12px 14px",marginBottom:16}}>
          <div style={{fontSize:12,fontWeight:700,color:"#7A1F1F",marginBottom:4}}>What closing the gap looks like</div>
          <div style={{fontSize:15,color:"#333",lineHeight:1.7}}>
            This store needed <strong>{Math.ceil(Number(perDay))} more donuts per day</strong> to hit goal — that's <strong>{Math.ceil(Number(mornPerDay))} in Morning</strong> and <strong>{Math.ceil(Number(rodPerDay))} in ROD</strong>. One more suggestive sell per hour gets this done.
          </div>
        </div>

        {/* Total row */}
        <div style={{fontSize:11,fontWeight:700,color:"#555",textTransform:"uppercase",letterSpacing:1,marginBottom:8}}>Total Miss</div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:16}}>
          {[{label:"Per Day",val:`−${perDay}`,sub:"units/day · 7 days"},{label:"Per Hour (all hrs)",val:`−${perHr}`,sub:"units/hr · 129.5 hrs/wk"}].map(c=>(
            <div key={c.label} style={{background:"#FFF0F0",border:"1px solid #fcc",borderRadius:8,padding:"10px 12px"}}>
              <div style={{fontSize:10,color:"#bbb",marginBottom:2}}>{c.label}</div>
              <div style={{fontSize:20,fontWeight:900,color:"#E24B4A"}}>{c.val}</div>
              <div style={{fontSize:10,color:"#ccc",marginTop:1}}>{c.sub}</div>
            </div>
          ))}
        </div>

        {/* Daypart row */}
        <div style={{fontSize:11,fontWeight:700,color:"#555",textTransform:"uppercase",letterSpacing:1,marginBottom:8}}>Miss by Daypart</div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:14}}>

          <div style={{background:"#FFF9E6",border:"1.5px solid #F4C430",borderRadius:9,padding:"12px"}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:6}}>
              <span style={{fontSize:12,fontWeight:700,color:"#7A5800"}}>☀️ Morning</span>
              <span style={{fontSize:10,color:"#aaa"}}>5am–10am</span>
            </div>
            <div style={{fontSize:20,fontWeight:900,color:"#7A5800"}}>−{mornMiss} units</div>
            <div style={{borderTop:"1px solid #F4C43044",marginTop:8,paddingTop:8}}>
              <div style={{display:"flex",justifyContent:"space-between",marginBottom:3}}>
                <span style={{fontSize:11,color:"#999"}}>Per day</span>
                <span style={{fontSize:11,fontWeight:700,color:"#7A5800"}}>−{mornPerDay}</span>
              </div>
              <div style={{display:"flex",justifyContent:"space-between",marginBottom:3}}>
                <span style={{fontSize:11,color:"#999"}}>Per hour</span>
                <span style={{fontSize:11,fontWeight:700,color:"#7A5800"}}>−{mornPerHr}</span>
              </div>
              <div style={{display:"flex",justifyContent:"space-between"}}>
                <span style={{fontSize:11,color:"#999"}}>Hrs/week</span>
                <span style={{fontSize:11,fontWeight:700,color:"#7A5800"}}>35 hrs</span>
              </div>
            </div>
            <div style={{background:"#EC762F18",borderRadius:6,padding:"7px 9px",marginTop:9,fontSize:11,color:"#7A5800",lineHeight:1.5}}>
              <strong>Focus:</strong> Full case at open. Offer to every guest 5–10am.
            </div>
          </div>

          <div style={{background:"#EEF4FF",border:"1.5px solid #2C6FAC",borderRadius:9,padding:"12px"}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:6}}>
              <span style={{fontSize:12,fontWeight:700,color:"#185FA5"}}>🌙 ROD</span>
              <span style={{fontSize:10,color:"#aaa"}}>3:30am–5am · 10am–10pm</span>
            </div>
            <div style={{fontSize:20,fontWeight:900,color:"#185FA5"}}>−{rodMiss} units</div>
            <div style={{borderTop:"1px solid #2C6FAC44",marginTop:8,paddingTop:8}}>
              <div style={{display:"flex",justifyContent:"space-between",marginBottom:3}}>
                <span style={{fontSize:11,color:"#999"}}>Per day</span>
                <span style={{fontSize:11,fontWeight:700,color:"#185FA5"}}>−{rodPerDay}</span>
              </div>
              <div style={{display:"flex",justifyContent:"space-between",marginBottom:3}}>
                <span style={{fontSize:11,color:"#999"}}>Per hour</span>
                <span style={{fontSize:11,fontWeight:700,color:"#185FA5"}}>−{rodPerHr}</span>
              </div>
              <div style={{display:"flex",justifyContent:"space-between"}}>
                <span style={{fontSize:11,color:"#999"}}>Hrs/week</span>
                <span style={{fontSize:11,fontWeight:700,color:"#185FA5"}}>94.5 hrs</span>
              </div>
            </div>
            <div style={{background:"#2C6FAC18",borderRadius:6,padding:"7px 9px",marginTop:9,fontSize:11,color:"#185FA5",lineHeight:1.5}}>
              <strong>Focus:</strong> BOGO last 6 hrs. Suggestive sell every transaction.
            </div>
          </div>
        </div>

        <div style={{background:"#f7f7f7",borderRadius:8,padding:"10px 12px",fontSize:11,color:"#888",lineHeight:1.6}}>
          Daypart estimates based on actual Texas transaction split (Morning 58.9%, ROD 41.1% — 5-wk avg across all TX stores). Use BI Daypart Snapshot for store-specific actuals.
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const last = WEEKLY_RESULTS.length - 1;
  const [weekIdx, setWeekIdx]     = useState(last);
  const [posterIdx, setPosterIdx] = useState(last);
  const [view, setView]           = useState("leaderboard");
  const [network, setNetwork]     = useState("ALL");
  const [selectedNum, setSelectedNum] = useState(null);

  const goals  = useMemo(() => computeGoals(weekIdx),   [weekIdx]);
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

  const posterStores = useMemo(() => STORES.map(s => {
    const val = WEEKLY_RESULTS[posterIdx].data[s.store_num];
    const g   = pGoals[s.store_num] || {avg:0,g5:0,g10:0};
    return {...s, val, status: getStatus(val, g.g5, g.g10), ...g};
  }).filter(s=>s.status==="gold"||s.status==="green")
    .sort((a,b)=>a.status===b.status?(Number(b.val)-Number(a.val)):(a.status==="gold"?-1:1)),
  [posterIdx, pGoals]);

  return (
    <div style={{fontFamily:"Arial,sans-serif",maxWidth:900,margin:"0 auto",paddingBottom:48}}>

      {/* Header */}
      <div style={{background:"linear-gradient(135deg,#EC762F 0%,#C8550A 100%)",padding:"24px 28px 22px",borderRadius:"0 0 16px 16px",marginBottom:24}}>
        <div style={{fontSize:11,fontWeight:700,letterSpacing:3,color:"rgba(255,255,255,0.7)",textTransform:"uppercase",marginBottom:4}}>Gratitude Restaurant Group — Texas</div>
        <div style={{fontSize:26,fontWeight:900,color:"#fff",lineHeight:1.1}}>🍩 No Donut Left Behind</div>
        <div style={{fontSize:13,color:"rgba(255,255,255,0.8)",marginTop:4}}>Weekly donut unit leaderboard · 33 Texas stores · Goals = rolling 5-wk avg +5% / +10%</div>
        <div style={{display:"flex",gap:10,marginTop:18,flexWrap:"wrap"}}>
          {[{label:"Hitting Goal",val:`${hitting.length}/33`,accent:"#fff"},{label:"Gold (+10%)",val:gold.length,accent:"#F4C430"},{label:"On Goal (+5%)",val:hitting.length-gold.length,accent:"#7AE6B0"}].map(p=>(
            <div key={p.label} style={{background:"rgba(0,0,0,0.2)",borderRadius:8,padding:"8px 16px"}}>
              <div style={{fontSize:22,fontWeight:900,color:p.accent}}>{p.val}</div>
              <div style={{fontSize:11,color:"rgba(255,255,255,0.75)"}}>{p.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Nav */}
      <div style={{display:"flex",gap:8,padding:"0 16px",marginBottom:22}}>
        {[["leaderboard","📊 Leaderboard"],["poster","🎉 Winner Poster"]].map(([v,label])=>(
          <button key={v} onClick={()=>{setView(v);setSelectedNum(null);}} style={{padding:"9px 20px",borderRadius:8,border:"none",cursor:"pointer",fontWeight:700,fontSize:13,background:view===v?"#EC762F":"#f0f0f0",color:view===v?"#fff":"#444"}}>{label}</button>
        ))}
      </div>

      {/* LEADERBOARD */}
      {view==="leaderboard" && (
        <div style={{padding:"0 16px"}}>
          <div style={{display:"flex",gap:12,marginBottom:18,flexWrap:"wrap",alignItems:"center"}}>
            <select value={weekIdx} onChange={e=>{setWeekIdx(Number(e.target.value));setSelectedNum(null);}} style={sel}>
              {WEEKLY_RESULTS.map((w,i)=><option key={i} value={i}>{w.label}</option>)}
            </select>
            <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
              {["ALL","GRG","VRG","OMALA"].map(n=>(
                <button key={n} onClick={()=>{setNetwork(n);setSelectedNum(null);}} style={{padding:"7px 14px",borderRadius:6,fontWeight:700,fontSize:12,cursor:"pointer",border:`2px solid ${network===n?(NET_COLORS[n]||"#555"):"#ddd"}`,background:network===n?(NET_COLORS[n]||"#555"):"#fff",color:network===n?"#fff":"#555"}}>{n==="ALL"?"All":n}</button>
              ))}
            </div>
          </div>

          <div style={{fontSize:12,color:"#aaa",marginBottom:12}}>Click any ❌ Miss or 🔶 Close store to see the gap breakdown.</div>

          <div style={{display:"flex",flexDirection:"column",gap:6}}>
            {sorted.map((s,idx)=>{
              const m = STATUS_META[s.status];
              const clickable = s.status==="miss" || s.status==="close";
              const isOpen = selectedNum === s.store_num;
              return (
                <div key={s.store_num}>
                  <div
                    onClick={()=>{ if(clickable) setSelectedNum(isOpen ? null : s.store_num); }}
                    style={{display:"flex",alignItems:"center",gap:10,background:m.bg,border:`1.5px solid ${isOpen ? NET_COLORS[s.network] : m.border}`,borderRadius:isOpen?"10px 10px 0 0":10,padding:"10px 14px",cursor:clickable?"pointer":"default",transition:"border-color 0.15s"}}
                  >
                    <div style={{width:28,textAlign:"center",fontSize:13,fontWeight:900,color:"#bbb",flexShrink:0}}>{s.status!=="pending"?`#${idx+1}`:"—"}</div>
                    <div style={{width:10,height:10,borderRadius:"50%",background:NET_COLORS[s.network],flexShrink:0}}/>
                    <div style={{flex:1,minWidth:0}}>
                      <div style={{fontWeight:700,fontSize:13,color:"#222",whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{s.short}</div>
                      <div style={{fontSize:11,color:"#888",marginTop:1}}>{s.network} · 5wk avg: {s.avg.toLocaleString()} · Goal: {s.g5.toLocaleString()}–{s.g10.toLocaleString()}{clickable ? (isOpen?" · click to collapse":" · click for breakdown") : ""}</div>
                    </div>
                    <div style={{textAlign:"right",flexShrink:0,minWidth:60}}>
                      <div style={{fontSize:18,fontWeight:900,color:m.text}}>{s.val?Number(s.val).toLocaleString():"—"}</div>
                      {s.pct!==null&&<div style={{fontSize:11,fontWeight:700,color:s.pct>=0?"#1D9E75":"#E24B4A"}}>{s.pct>=0?"+":""}{s.pct}% vs avg</div>}
                    </div>
                    <div style={{fontSize:11,fontWeight:700,padding:"3px 8px",borderRadius:5,flexShrink:0,background:m.border+"22",color:m.text}}>{m.label}</div>
                    {clickable && <div style={{fontSize:14,color:m.text,flexShrink:0}}>{isOpen?"▲":"▼"}</div>}
                  </div>
                  {isOpen && (
                    <div style={{border:`1.5px solid ${NET_COLORS[s.network]}`,borderTop:"none",borderRadius:"0 0 10px 10px",overflow:"hidden"}}>
                      <MissPanel store={s} onClose={()=>setSelectedNum(null)} />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* POSTER */}
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
            {posterStores.length===0?(
              <div style={{textAlign:"center",color:"rgba(255,255,255,0.4)",padding:"32px 0",fontSize:14}}>No results available for this week yet.</div>
            ):(
              <>
                {posterStores.filter(s=>s.status==="gold").length>0&&(
                  <div style={{marginBottom:24}}>
                    <div style={{fontSize:11,fontWeight:700,letterSpacing:3,color:"#F4C430",textTransform:"uppercase",marginBottom:12}}>🏆 Gold Tier — +10% or better</div>
                    <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(190px,1fr))",gap:8}}>
                      {posterStores.filter(s=>s.status==="gold").map(s=>(
                        <div key={s.store_num} style={{background:"rgba(244,196,48,0.15)",border:"1.5px solid #F4C430",borderRadius:10,padding:"14px"}}>
                          <div style={{fontSize:13,fontWeight:800,color:"#F4C430",lineHeight:1.3}}>{s.short}</div>
                          <div style={{fontSize:11,color:"rgba(255,255,255,0.5)",marginTop:2}}>{s.network}</div>
                          <div style={{fontSize:24,fontWeight:900,color:"#fff",marginTop:8,lineHeight:1}}>{Number(s.val).toLocaleString()}<span style={{fontSize:11,color:"#F4C430",marginLeft:4}}>units</span></div>
                          <div style={{marginTop:8,paddingTop:8,borderTop:"1px solid rgba(244,196,48,0.3)"}}>
                            <div style={{fontSize:11,color:"rgba(255,255,255,0.5)"}}>Goal (+5%): <span style={{color:"#F4C430",fontWeight:700}}>{s.g5.toLocaleString()}</span></div>
                            <div style={{fontSize:11,color:"rgba(255,255,255,0.5)"}}>Gold (+10%): <span style={{color:"#F4C430",fontWeight:700}}>{s.g10.toLocaleString()}</span></div>
                            <div style={{fontSize:11,color:"#F4C430",fontWeight:700,marginTop:4}}>Beat goal by {(Number(s.val)-s.g10).toLocaleString()} units ✓</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {posterStores.filter(s=>s.status==="green").length>0&&(
                  <div>
                    <div style={{fontSize:11,fontWeight:700,letterSpacing:3,color:"#7AE6B0",textTransform:"uppercase",marginBottom:12}}>✅ Goal Tier — +5% or better</div>
                    <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(175px,1fr))",gap:8}}>
                      {posterStores.filter(s=>s.status==="green").map(s=>(
                        <div key={s.store_num} style={{background:"rgba(29,158,117,0.15)",border:"1.5px solid #1D9E75",borderRadius:10,padding:"14px"}}>
                          <div style={{fontSize:13,fontWeight:800,color:"#7AE6B0",lineHeight:1.3}}>{s.short}</div>
                          <div style={{fontSize:11,color:"rgba(255,255,255,0.5)",marginTop:2}}>{s.network}</div>
                          <div style={{fontSize:22,fontWeight:900,color:"#fff",marginTop:8,lineHeight:1}}>{Number(s.val).toLocaleString()}<span style={{fontSize:11,color:"#7AE6B0",marginLeft:4}}>units</span></div>
                          <div style={{marginTop:8,paddingTop:8,borderTop:"1px solid rgba(29,158,117,0.3)"}}>
                            <div style={{fontSize:11,color:"rgba(255,255,255,0.5)"}}>Goal (+5%): <span style={{color:"#7AE6B0",fontWeight:700}}>{s.g5.toLocaleString()}</span></div>
                            <div style={{fontSize:11,color:"rgba(255,255,255,0.5)"}}>Gold (+10%): <span style={{color:"rgba(255,255,255,0.4)",fontWeight:700}}>{s.g10.toLocaleString()}</span></div>
                            <div style={{fontSize:11,color:"#7AE6B0",fontWeight:700,marginTop:4}}>Beat goal by {(Number(s.val)-s.g5).toLocaleString()} units ✓</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
            <div style={{textAlign:"center",marginTop:28,fontSize:11,color:"rgba(255,255,255,0.3)"}}>Gratitude Restaurant Group · Texas Operations · Anthony Rodriguez, VP Operations</div>
          </div>
        </div>
      )}
    </div>
  );
}
