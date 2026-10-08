// Gesundheit (Whoop-Daten + Tagebuch): Daten kommen aus Supabase (Lesen nur für Eriks Konto freigegeben), nie aus dem Repo.
// Dunkles Premium-Design; Klassen/IDs mit Präfix gs. Anmeldung, Kopfzeile und Menü stecken in app.js.
const GS=(()=>{
const CK='gs-app-cache',TK='gs-app-tagebuch',QK='gs-app-queue';
const TAGS=['erkältet','Stress','Alkohol','Magnesium','schlecht geschlafen','Sport'];
const BODY='M188.5 72.0C188.0 75.7 188.2 80.8 190.0 84.0C191.8 87.2 194.5 89.0 199.0 91.0C203.5 93.0 211.8 94.0 217.0 96.0C222.2 98.0 226.7 99.3 230.0 103.0C233.3 106.7 235.7 110.8 237.0 118.0C238.3 125.2 237.7 135.7 238.0 146.0C238.3 156.3 238.3 168.7 239.0 180.0C239.7 191.3 241.0 202.7 242.0 214.0C243.0 225.3 244.0 240.0 245.0 248.0C246.0 256.0 247.3 256.7 248.0 262.0C248.7 267.3 249.7 274.8 249.0 280.0C248.3 285.2 245.8 291.7 244.0 293.0C242.2 294.3 239.5 292.2 238.0 288.0C236.5 283.8 236.0 278.3 235.0 268.0C234.0 257.7 233.3 239.0 232.0 226.0C230.7 213.0 228.3 202.3 227.0 190.0C225.7 177.7 225.3 162.3 224.0 152.0C222.7 141.7 220.2 128.0 219.0 128.0C217.8 128.0 218.0 142.3 217.0 152.0C216.0 161.7 214.3 176.0 213.0 186.0C211.7 196.0 209.0 203.3 209.0 212.0C209.0 220.7 211.3 229.7 213.0 238.0C214.7 246.3 218.0 253.0 219.0 262.0C220.0 271.0 219.8 279.3 219.0 292.0C218.2 304.7 214.8 325.0 214.0 338.0C213.2 351.0 215.2 356.7 214.0 370.0C212.8 383.3 208.8 406.3 207.0 418.0C205.2 429.7 202.5 434.5 203.0 440.0C203.5 445.5 209.3 447.8 210.0 451.0C210.7 454.2 210.2 457.7 207.0 459.0C203.8 460.3 193.8 462.2 191.0 459.0C188.2 455.8 189.8 448.2 190.0 440.0C190.2 431.8 191.5 421.3 192.0 410.0C192.5 398.7 193.3 383.7 193.0 372.0C192.7 360.3 190.8 352.0 190.0 340.0C189.2 328.0 189.2 310.0 188.0 300.0C186.8 290.0 184.3 283.0 183.0 280.0C181.7 277.0 181.0 282.0 180.0 282.0C179.0 282.0 178.3 277.0 177.0 280.0C175.7 283.0 173.2 290.0 172.0 300.0C170.8 310.0 170.8 328.0 170.0 340.0C169.2 352.0 167.3 360.3 167.0 372.0C166.7 383.7 167.5 398.7 168.0 410.0C168.5 421.3 169.8 431.8 170.0 440.0C170.2 448.2 171.8 455.8 169.0 459.0C166.2 462.2 156.2 460.3 153.0 459.0C149.8 457.7 149.3 454.2 150.0 451.0C150.7 447.8 156.5 445.5 157.0 440.0C157.5 434.5 154.8 429.7 153.0 418.0C151.2 406.3 147.2 383.3 146.0 370.0C144.8 356.7 146.8 351.0 146.0 338.0C145.2 325.0 141.8 304.7 141.0 292.0C140.2 279.3 140.0 271.0 141.0 262.0C142.0 253.0 145.3 246.3 147.0 238.0C148.7 229.7 151.0 220.7 151.0 212.0C151.0 203.3 148.3 196.0 147.0 186.0C145.7 176.0 144.0 161.7 143.0 152.0C142.0 142.3 142.2 128.0 141.0 128.0C139.8 128.0 137.3 141.7 136.0 152.0C134.7 162.3 134.3 177.7 133.0 190.0C131.7 202.3 129.3 213.0 128.0 226.0C126.7 239.0 126.0 257.7 125.0 268.0C124.0 278.3 123.5 283.8 122.0 288.0C120.5 292.2 117.8 294.3 116.0 293.0C114.2 291.7 111.7 285.2 111.0 280.0C110.3 274.8 111.3 267.3 112.0 262.0C112.7 256.7 114.0 256.0 115.0 248.0C116.0 240.0 117.0 225.3 118.0 214.0C119.0 202.7 120.3 191.3 121.0 180.0C121.7 168.7 121.7 156.3 122.0 146.0C122.3 135.7 121.7 125.2 123.0 118.0C124.3 110.8 126.7 106.7 130.0 103.0C133.3 99.3 137.8 98.0 143.0 96.0C148.2 94.0 156.5 93.0 161.0 91.0C165.5 89.0 168.2 87.2 170.0 84.0C171.8 80.8 172.0 75.7 171.5 72.0C171.0 68.3 169.0 66.5 167.0 62.0C165.0 57.5 160.3 50.8 159.5 45.0C158.7 39.2 160.1 31.4 162.0 27.0C163.9 22.6 168.0 20.2 171.0 18.5C174.0 16.8 177.0 16.5 180.0 16.5C183.0 16.5 186.0 16.8 189.0 18.5C192.0 20.2 196.1 22.6 198.0 27.0C199.9 31.4 201.3 39.2 200.5 45.0C199.7 50.8 195.0 57.5 193.0 62.0C191.0 66.5 189.0 68.3 188.5 72.0Z';
const $g=s=>document.querySelector(s),$$g=s=>Array.from(document.querySelectorAll(s));
const esc=s=>String(s==null?'':s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const uid=()=>Auth.user&&Auth.user.id;
const jget=k=>{try{return JSON.parse(localStorage.getItem(k)||'null')}catch(e){return null}};
const jset=(k,v)=>{try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}};

// ---------- Daten ----------
function cache(){const c=jget(CK),u=uid();return c&&u&&c.uid===u&&c.row&&c.row.data&&(c.row.data.tage||[]).length?c:null}
function clear(){[CK,TK,QK].forEach(k=>localStorage.removeItem(k))}
async function load(){ // -> {row, cached, offline, err, nologin}
  const u=uid();if(!u)return{nologin:true};
  try{const rows=await Auth.api('/rest/v1/gesundheit?select=stand,data,updated_at&id=eq.1');
    const row=rows&&rows[0]||null;
    if(row&&row.data&&(row.data.tage||[]).length)jset(CK,{uid:u,at:Date.now(),row});else{clear();return{row:null}}
    return{row}}
  catch(e){const c=cache();
    if(e.status===404||e.status===401||e.status===403){if(e.status!==401)clear();return{row:null,err:e.status===401?'login':null}}
    return c?{row:c.row,cached:c.at,offline:!e.status}:{row:null,offline:!e.status,err:e.message}}
}
// Stand für das Menü: Datenstand, zuletzt geladen, Anzahl Tage
function info(){const c=cache();if(!c)return null;const D=c.row.data;return{stand:D.stand,loaded:c.at,tage:D.tage.length,from:D.tage[0].d,to:D.tage[D.tage.length-1].d}}

// ---------- Hilfen ----------
const RM=()=>window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches;
const nf=(v,d)=>v==null||isNaN(v)?'–':v.toLocaleString('de-DE',{minimumFractionDigits:d,maximumFractionDigits:d});
const hmS=h=>{if(h==null)return'–';const m=Math.round(h*60);return Math.floor(m/60)+':'+String(m%60).padStart(2,'0')};
const hm=h=>h==null?'–':hmS(h)+' h';
const dDE=(iso,o)=>new Date(iso+'T12:00:00').toLocaleDateString('de-DE',o||{weekday:'long',day:'numeric',month:'long'});
const isoLocal=d=>d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0');
const IP={
 heart:'<path d="M12 20.5s-7.5-4.6-7.5-10.4A4.3 4.3 0 0 1 12 7.4a4.3 4.3 0 0 1 7.5 2.7c0 5.8-7.5 10.4-7.5 10.4z"/>',
 lungs:'<path d="M12 3.5v8.5m0 0c-.8 0-2 .9-3 2m3-2c.8 0 2 .9 3 2"/><path d="M8.6 6.8C6 6.8 4 11 4 15.6 4 18.4 5.2 20 7.2 20 9 20 10 18.7 10 16.4V8.6c0-1-.6-1.8-1.4-1.8zM15.4 6.8C18 6.8 20 11 20 15.6c0 2.8-1.2 4.4-3.2 4.4-1.8 0-2.8-1.3-2.8-3.6V8.6c0-1 .6-1.8 1.4-1.8z"/>',
 moon:'<path d="M20 14.6A8.2 8.2 0 1 1 9.4 4a6.6 6.6 0 0 0 10.6 10.6z"/>',
 sun:'<circle cx="12" cy="12" r="4"/><path d="M12 2.5v2M12 19.5v2M4.6 4.6 6 6M18 18l1.4 1.4M2.5 12h2M19.5 12h2M4.6 19.4 6 18M18 6l1.4-1.4"/>',
 thermo:'<path d="M14 14.6V5.2a2 2 0 0 0-4 0v9.4a4 4 0 1 0 4 0z"/><path d="M12 17.5v-6"/>',
 act:'<path d="M3 12h4l2.6-7 4.8 14 2.6-7h4"/>',
 bolt:'<path d="M13.2 2.5 4.5 13.6h6.6l-1.1 7.9 8.7-11.1h-6.6z"/>',
 leaf:'<path d="M5 19.5C5 11 10.6 5 20 4.5c-.4 9.4-6.4 15-14.9 15z"/><path d="M5 19.5 13 11.5"/>',
 wind:'<path d="M3 8.5h10.5A3 3 0 1 0 10.6 5M3 12.5h15a3 3 0 1 1-2.9 3.7M3 16.5h7"/>',
 spark:'<path d="M12 3.5l1.9 5.1 5.1 1.9-5.1 1.9L12 17.5l-1.9-5.1-5.1-1.9 5.1-1.9z"/><path d="M18.5 15.5l.7 1.8 1.8.7-1.8.7-.7 1.8-.7-1.8-1.8-.7 1.8-.7z"/>',
 check:'<path d="M5 12.6l4.4 4.4L19 7.4"/>',
 x:'<path d="M6.5 6.5l11 11M17.5 6.5l-11 11"/>',
 mic:'<rect x="9" y="3" width="6" height="11.5" rx="3"/><path d="M5.5 11a6.5 6.5 0 0 0 13 0M12 17.5v3"/>',
 flask:'<path d="M9.5 3.5h5M10.5 3.5v5.2L5 18.3A1.5 1.5 0 0 0 6.3 20.5h11.4a1.5 1.5 0 0 0 1.3-2.2l-5.5-9.6V3.5"/>',
 chart:'<path d="M4 19.5h16M6.5 16l4-5 3 3 5-7"/>',
 lock:'<rect x="5" y="10.5" width="14" height="10" rx="2.5"/><path d="M8.5 10.5V7.5a3.5 3.5 0 0 1 7 0v3"/>',
 cloud:'<path d="M7 18.5h10a4 4 0 0 0 .6-8A5.5 5.5 0 0 0 7 9.6a4.5 4.5 0 0 0 0 8.9z"/><path d="M4 4l16 16"/>',
 trash:'<path d="M4.5 7h15M10 11v6M14 11v6M6.5 7l1 12.5h9l1-12.5M9.5 7V4.5h5V7"/>'
};
const ico=(n,w)=>`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${w||1.9}" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${IP[n]}</svg>`;
const M={
 erholung:{n:'Erholung',u:'%',d:0,ex:'Whoops Gesamtwert aus HRV, Ruhepuls, Atmung und Schlaf. Ab 67 % grün, unter 34 % rot.'},
 hrv:{n:'HRV',u:'ms',d:0,lang:'Herzfrequenzvariabilität',ex:'Wie stark der Abstand zwischen den Herzschlägen im Schlaf schwankt. Hoch heißt meist: Nervensystem entspannt, gut erholt. Sinkt bei Stress, Alkohol, Infekt oder hartem Training.'},
 ruhepuls:{n:'Ruhepuls',u:'bpm',d:0,ex:'Dein niedrigster Puls in der Nacht. Steigt bei Infekt, Alkohol, spätem Essen, Hitze oder zu viel Training.'},
 atem:{n:'Atemfrequenz',u:'/min',d:1,ex:'Atemzüge pro Minute im Schlaf. Sehr stabiler Wert – ein Anstieg kann ein frühes Zeichen für einen Infekt sein.'},
 spo2:{n:'Sauerstoff',u:'%',d:1,lang:'Blutsauerstoff (SpO₂)',ex:'Sauerstoffsättigung im Blut während des Schlafs. Üblich sind etwa 95–100 %.'},
 haut:{n:'Hauttemperatur',u:'°C',d:1,ex:'Gemessen am Handgelenk, bewertet gegen deinen eigenen Normalwert. Ein Anstieg kann auf Infekt, Alkohol oder eine warme Umgebung hinweisen.'},
 schlaf:{n:'Schlafdauer',u:'h',d:1,fmt:hm,ex:'Echte Schlafzeit ohne Wachphasen, bewertet gegen deine letzten 30 Nächte.'},
 belastung:{n:'Belastung',u:'',d:1,lang:'Belastung (Strain 0–21)',ex:'Whoop-Strain vom gestrigen Tag: wie stark Herz und Kreislauf gefordert waren. Nur zur Info, keine Bewertung.'},
 schritte:{n:'Schritte',u:'',d:0,ex:'Schritte vom gestrigen Tag. Nur zur Info, keine Bewertung.'}
};
const fmtV=(k,v)=>M[k].fmt?M[k].fmt(v):nf(v,M[k].d)+(M[k].u?' '+M[k].u:'');
const COL={g:'#34d399',y:'#fbbf24',r:'#fb7185',n:'#94a3b8'};
const WORD={g:'Im Normalbereich',y:'Leicht auffällig',r:'Deutlich auffällig',n:'Info'};
const worst=a=>a.includes('r')?'r':a.includes('y')?'y':a.includes('g')?'g':'n';
const valOnly=(k,v)=>k==='schlaf'?hmS(v):nf(v,M[k].d);
const unitOf=k=>k==='schlaf'?'h':M[k].u;
const ease=t=>1-Math.pow(1-t,3);
const zoneOf=v=>v==null?'n':v>=67?'g':v>=34?'y':'r';
function countUp(el,to,dur,dec){if(RM()||to==null){el.textContent=nf(to,dec||0);return}const t0=performance.now();
  const f=now=>{const p=Math.min(1,(now-t0)/dur);el.textContent=nf(to*ease(p),dec||0);if(p<1)requestAnimationFrame(f)};requestAnimationFrame(f)}
const band=(D,day,k)=>{const nb=day.nb&&day.nb[k],b=day.b&&day.b[k];if(nb)return{m:nb.m,sd:nb.sd,n:b?b.n:D.baseTage};return b?{m:b.m,sd:b.sd,n:b.n}:null};
function rateD(D,day,k){
  const v=day.v[k]==null?null:day.v[k],b=band(D,day,k),dir=D.richtung[k];
  if(v==null)return{c:'n',txt:'kein Messwert',v};
  if(!b)return{c:'n',txt:'noch zu wenig Verlauf',v};
  const z=(v-b.m)/(b.sd||1e-9);let c;
  if(dir===0)c='n';else if(day.s&&day.s[k])c=day.s[k];else{const bad=z*dir;c=bad>2?'r':bad>1?'y':'g'}
  return{c,z,v,m:b.m,sd:b.sd,lo:b.m-b.sd,hi:b.m+b.sd,n:b.n,diff:v-b.m,dir};
}

// ---------- Ansicht ----------
let cur=null; // {redraw, close}
let hooks={};
async function view(el,h){hooks=h||hooks;
  if(!uid()){hooks.relogin&&hooks.relogin();return}
  el.innerHTML=`<div id="gsRoot" class="gs">
  <svg width="0" height="0" style="position:absolute" aria-hidden="true"><defs>
   <filter id="gsGlow" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="5" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
   <filter id="gsGlow2" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="2.4" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
   <filter id="gsSoft" x="-20%" y="-50%" width="140%" height="200%"><feGaussianBlur stdDeviation="3"/></filter></defs></svg>
  <div class="gs-top"><div class="gs-hi" id="gsHi"></div><span class="gs-pv" id="gsPv">${ico('lock',2.2)}Privat</span></div><h1 class="gs-ttl" id="gsTitle">Gesundheit</h1>
  <div id="gsHealth"><div class="gs-empty">Lade Gesundheitsdaten …</div></div>
  <div id="gsDiaryWrap"></div>
  <footer class="gs-foot" id="gsFoot"></footer>
  <div id="gsVeil" class="gs-veil"></div>
  <div id="gsSheet" class="gs-sheet" role="dialog" aria-modal="true" aria-labelledby="gsShT"><div class="gs-grab"></div><div class="gs-shh"><div class="gs-ic" id="gsShI"></div><h3 id="gsShT"></h3><button id="gsShX" aria-label="Schließen">${ico('x',2.2)}</button></div><div id="gsShB"></div></div></div>`;
  const c=cache();let shown=null;
  if(c){draw(c.row);shown=c.row.updated_at}
  const root=$g('#gsRoot'),r=await load();if(!root.isConnected)return;
  if(r.nologin||r.err==='login'||!uid()){hooks.relogin&&hooks.relogin();return}
  if(!r.row){$g('#gsDiaryWrap').innerHTML='';$g('#gsFoot').innerHTML='';const u=Auth.user;
    $g('#gsTitle').textContent='Gesundheit';
    $g('#gsHealth').innerHTML=r.offline||r.err?`<section class="gs-card gs-state"><div class="gs-sico">${ico('cloud',1.8)}</div><h2>${r.offline?'Keine Verbindung':'Laden fehlgeschlagen'}</h2>
      <p class="gs-muted">${r.offline?'Die Daten wurden auf diesem Gerät noch nicht geladen. Sobald du wieder Netz hast, einfach neu laden.':'Fehler: '+esc(r.err)}</p><button class="gs-btn" id="gsRetry">Neu laden</button></section>`
     :`<section class="gs-card gs-state"><div class="gs-sico">${ico('lock',1.8)}</div><h2>Keine Daten für dieses Konto</h2>
      <p class="gs-muted">Für ${u&&u.email?'<b>'+esc(u.email)+'</b>':'dieses Konto'} sind keine Gesundheitsdaten freigegeben oder es wurden noch keine hochgeladen.</p>
      <div class="gs-srow2"><button class="gs-btn" id="gsRetry">Neu laden</button><button class="gs-btn gs-btn2" id="gsOut">Abmelden</button></div></section>`;
    $g('#gsRetry').onclick=()=>hooks.reload&&hooks.reload();const o=$g('#gsOut');if(o)o.onclick=()=>hooks.signOut&&hooks.signOut();return}
  if(r.cached){const pv=$g('#gsPv');pv.className='gs-pv gs-off';pv.innerHTML=ico('cloud',2.2)+'Offline';
    pv.title='zuletzt geladen '+new Date(r.cached).toLocaleString('de-DE',{dateStyle:'short',timeStyle:'short'})}
  if(shown!==r.row.updated_at)draw(r.row);
  if(!r.cached)diaryLoad();
}

function draw(row){
  const D=row.data,T=D.tage,L=T[T.length-1],Y=T.length>1?T[T.length-2]:null,rm=RM();
  const rate=(day,k)=>rateD(D,day,k);
  const box=$g('#gsHealth');
  box.innerHTML=`<div class="gs-grid">
  <section class="gs-card gs-span" id="gsHero"></section>
  <section class="gs-card gs-rv" id="gsBody"><div class="gs-kick"><h2>Dein Körper heute</h2><small id="gsFigsub"></small></div>
   <div class="gs-figbox" id="gsFigbox"><svg id="gsFig" viewBox="0 0 360 380" role="img" aria-label="Körperübersicht"></svg></div>
   <div class="gs-legend"><span class="gs-g"><i class="gs-dot"></i>Normal</span><span class="gs-y"><i class="gs-dot"></i>Leicht auffällig</span><span class="gs-r"><i class="gs-dot"></i>Deutlich auffällig</span><span class="gs-n"><i class="gs-dot"></i>Info</span></div>
   <div class="gs-hint">Tippe auf einen Wert für Details</div></section>
  <div class="gs-col"><section class="gs-card gs-rv" id="gsEmp"></section><section class="gs-card gs-rv" id="gsSleep"></section></div>
  <section class="gs-card gs-rv gs-span" id="gsTrends"><div class="gs-kick"><h2>Verläufe</h2><small id="gsTrsub"></small></div>
   <div class="gs-seg" id="gsRng"><i></i><button data-n="7">7 Tage</button><button data-n="30" class="gs-on">30 Tage</button><button data-n="90">90 Tage</button></div>
   <div class="gs-charts" id="gsCharts"></div>
   <div class="gs-bandlg"><i></i>Band = dein persönlicher Normalbereich (Ø ± 1 SD der 30 Tage davor)</div></section></div>`;

  /* Kopf */
  const h=new Date().getHours();
  $g('#gsHi').textContent=dDE(L.d);
  $g('#gsTitle').textContent=(h<5?'Gute Nacht':h<11?'Guten Morgen':h<18?'Hallo':'Guten Abend')+', Erik';

  /* Hero: Erholungsring */
  const GRAD={g:['#6ee7b7','#22d3ee'],y:['#fde68a','#fb923c'],r:['#fda4af','#f43f5e'],n:['#cbd5e1','#64748b']};
  (()=>{
    const v=L.v.erholung,z=zoneOf(v),zt={g:'Gut erholt',y:'Mittel erholt',r:'Wenig erholt',n:'Keine Daten'}[z];
    const R=96,C=2*Math.PI*R,f=v==null?0:Math.max(0,Math.min(100,v))/100,r=rate(L,'erholung'),gr=GRAD[z];
    const st=D.stand?new Date(D.stand):null;
    const stT=st&&!isNaN(st)?st.toLocaleDateString('de-DE',{day:'2-digit',month:'2-digit'})+', '+st.toLocaleTimeString('de-DE',{hour:'2-digit',minute:'2-digit'})+' Uhr':'–';
    let cmp='';
    if(r.m!=null&&v!=null){const d=Math.round(v-r.m);cmp=`<b class="gs-num">${d>=0?'+':'−'}${Math.abs(d)}</b> ${d>=0?'über':'unter'} deinem 30-Tage-Schnitt <span class="gs-num" style="white-space:nowrap">(${nf(r.m,0)}&nbsp;%)</span>`}
    let ticks='';for(let i=0;i<60;i++){const a=i/60*2*Math.PI-Math.PI/2,r1=114,r2=i%5?117:120;ticks+=`<line x1="${(120+r1*Math.cos(a)).toFixed(1)}" y1="${(120+r1*Math.sin(a)).toFixed(1)}" x2="${(120+r2*Math.cos(a)).toFixed(1)}" y2="${(120+r2*Math.sin(a)).toFixed(1)}" stroke="rgba(255,255,255,${i%5?.10:.22})" stroke-width="1.2"/>`}
    const tl=(k,lab,day)=>{const q=rate(day,k);let d='';if(q.m!=null){const df=q.diff;d=(df>=0?'+':'−')+(k==='schlaf'?hmS(Math.abs(df)):nf(Math.abs(df),M[k].d))+' vs. Ø'}else d=q.txt||'';
      return `<button class="gs-tile gs-${q.c}" data-g="${k==='schlaf'?'kopf':'herz'}"><div class="gs-tl"><i class="gs-dot"></i>${lab}</div><div class="gs-tv gs-num">${valOnly(k,q.v)}<small>${unitOf(k)}</small></div><div class="gs-td gs-num">${esc(d)}</div></button>`};
    const hero=$g('#gsHero');hero.classList.add('gs-'+z);
    hero.innerHTML=`<div class="gs-ringwrap"><svg viewBox="0 0 240 240"><defs><linearGradient id="gsRgG" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${gr[0]}"/><stop offset="1" stop-color="${gr[1]}"/></linearGradient></defs>
     ${ticks}<circle cx="120" cy="120" r="${R}" fill="none" stroke="rgba(255,255,255,.07)" stroke-width="16"/>
     <circle id="gsRg" cx="120" cy="120" r="${R}" fill="none" stroke="url(#gsRgG)" stroke-width="16" stroke-linecap="round" stroke-dasharray="${C.toFixed(2)}" stroke-dashoffset="${C.toFixed(2)}" transform="rotate(-90 120 120)" filter="url(#gsGlow)"/></svg>
     <div class="gs-ringc"><div class="gs-lab">Erholung</div><div class="gs-big gs-num"><span id="gsRgv">0</span><sup>%</sup></div><div class="gs-zone">${zt}</div></div></div>
     <div class="gs-cmp">${cmp}</div>
     <div class="gs-tiles">${tl('hrv','HRV',L)}${tl('ruhepuls','Ruhepuls',L)}${tl('schlaf','Schlaf',L)}</div>
     <div class="gs-stand">Whoop-Daten · Stand ${esc(stT)}</div>`;
    const rg=$g('#gsRg'),off=C*(1-f);
    if(rm){rg.style.strokeDashoffset=off;$g('#gsRgv').textContent=nf(v,0)}
    else requestAnimationFrame(()=>requestAnimationFrame(()=>{rg.style.strokeDashoffset=off;countUp($g('#gsRgv'),v,1700,0)}));
    hero.querySelectorAll('.gs-tile').forEach(b=>b.onclick=()=>openSheet(G.find(g=>g.id===b.dataset.g)));
  })();

  /* Körperfigur */
  const FS=.78,FY=12,tf=([x,y])=>[180+(x-180)*FS,FY+(y-16)*FS];
  const G=[
   {id:'kopf',t:'Schlaf',st:'Kopf · Schlaf',ic:'moon',p:[180,40],side:'R',y:32,k:['schlaf'],day:L},
   {id:'lunge',t:'Lunge',ic:'lungs',p:[163,142],side:'L',y:98,k:['atem','spo2'],day:L},
   {id:'herz',t:'Herz',ic:'heart',p:[191,150],side:'R',y:126,k:['ruhepuls','hrv'],day:L},
   {id:'haut',t:'Haut',st:'Haut · Handgelenk',ic:'thermo',p:[121,258],side:'L',y:232,k:['haut'],day:L},
   {id:'beine',t:'Beine',tag:'gestern',st:'Beine · gestern',ic:'act',p:[203,352],side:'R',y:296,k:['belastung','schritte'],day:Y||L}
  ];
  (()=>{
    const svg=$g('#gsFig'),fb=$g('#gsFigbox'),VW=360,VH=380,LX=116,RX=244;
    const hr=L.v.ruhepuls||60,beat=(60/hr).toFixed(3);
    const sc=g=>worst(g.k.map(k=>rate(g.day,k).c));
    const hc=COL[sc(G[2])],lc=COL[sc(G[1])];
    let s=`<defs>
     <linearGradient id="gsBodyStroke" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#67e8f9"/><stop offset=".55" stop-color="#818cf8"/><stop offset="1" stop-color="#a78bfa" stop-opacity=".7"/></linearGradient>
     <radialGradient id="gsBodyFill" cx="50%" cy="30%" r="70%"><stop offset="0" stop-color="#7dd3fc" stop-opacity=".30"/><stop offset=".45" stop-color="#6366f1" stop-opacity=".16"/><stop offset="1" stop-color="#312e81" stop-opacity=".06"/></radialGradient>
     <linearGradient id="gsBodyShade" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#000" stop-opacity=".35"/><stop offset=".3" stop-color="#000" stop-opacity="0"/><stop offset=".7" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".35"/></linearGradient>
     <radialGradient id="gsHeartG" cx="40%" cy="35%" r="70%"><stop offset="0" stop-color="#fff" stop-opacity=".9"/><stop offset=".25" stop-color="${hc}"/><stop offset="1" stop-color="${hc}" stop-opacity=".55"/></radialGradient>
     <linearGradient id="gsLungG" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${lc}" stop-opacity=".40"/><stop offset="1" stop-color="${lc}" stop-opacity=".10"/></linearGradient>
     <radialGradient id="gsFloor" cx="50%" cy="50%" r="50%"><stop offset="0" stop-color="#22d3ee" stop-opacity=".35"/><stop offset="1" stop-color="#22d3ee" stop-opacity="0"/></radialGradient>
     <linearGradient id="gsScanG" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#22d3ee" stop-opacity="0"/><stop offset=".5" stop-color="#67e8f9" stop-opacity=".55"/><stop offset="1" stop-color="#22d3ee" stop-opacity="0"/></linearGradient>
     <clipPath id="gsBodyClip"><path d="${BODY}"/></clipPath></defs>`;
    s+=`<g fill="none" stroke="rgba(148,163,255,.07)">${[58,104,150].map(r=>`<circle cx="180" cy="186" r="${r}"/>`).join('')}</g>`;
    s+=`<ellipse cx="180" cy="359" rx="58" ry="7" fill="url(#gsFloor)"/>`;
    s+=`<g transform="translate(180 ${FY}) scale(${FS}) translate(-180 -16)">`;
    s+=`<path d="${BODY}" fill="none" stroke="url(#gsBodyStroke)" stroke-width="5" opacity=".35" filter="url(#gsSoft)"/>`;
    s+=`<path d="${BODY}" fill="url(#gsBodyFill)"/>`;
    s+=`<g clip-path="url(#gsBodyClip)"><rect x="90" y="0" width="180" height="468" fill="url(#gsBodyShade)"/>
      <path d="M150 104 Q165 112 178 108 M210 104 Q195 112 182 108" stroke="rgba(186,230,253,.28)" stroke-width="1.2" fill="none" stroke-linecap="round"/>
      <path d="M180 112 V250" stroke="rgba(186,230,253,.14)" stroke-width="1"/>
      <path d="M158 212 Q180 220 202 212 M162 236 Q180 242 198 236" stroke="rgba(186,230,253,.08)" stroke-width="1" fill="none"/>
      ${rm?'':`<rect class="gs-scan" x="90" y="10" width="180" height="2" fill="url(#gsScanG)"/>`}</g>`;
    s+=`<path d="${BODY}" fill="none" stroke="url(#gsBodyStroke)" stroke-width="1.3" opacity=".9"/>`;
    s+=`<g class="gs-hit" data-g="lunge"><path d="M175 114 C166 110 154 116 150 134 C146 152 147 176 152 188 C158 196 170 194 174 186 L176 122 Z" fill="url(#gsLungG)" stroke="${lc}" stroke-opacity=".45" stroke-width=".8"/>
      <path d="M185 114 C194 110 206 116 210 134 C214 152 213 176 208 188 C202 196 192 194 188 186 C192 176 194 166 186 160 Z" fill="url(#gsLungG)" stroke="${lc}" stroke-opacity=".45" stroke-width=".8"/></g>`;
    s+=`<g class="gs-hit" data-g="herz" filter="url(#gsGlow2)"><g class="gs-beat" style="animation-duration:${beat}s"><path d="M191 162 C180 154 177 146 181 141 C184 137 189 138 191 142 C193 138 198 137 201 141 C205 146 202 154 191 162 Z" fill="url(#gsHeartG)"/></g></g></g>`;
    G.forEach((g,gi)=>{
      const c=COL[sc(g)],[px,py]=tf(g.p),ex=g.side==='L'?LX:RX,elx=g.side==='L'?ex+12:ex-12;
      s+=`<path class="gs-lead" d="M${px} ${py} L${elx} ${g.y} L${ex} ${g.y}" stroke="${c}"/><circle cx="${ex}" cy="${g.y}" r="2" fill="${c}"/>`;
      if(g.id!=='herz'){
        s+=`<circle class="gs-halo" cx="${px}" cy="${py}" r="5" fill="${c}" style="animation-delay:${(gi*.45).toFixed(2)}s"/>`;
        s+=`<g class="gs-hit" data-g="${g.id}"><circle cx="${px}" cy="${py}" r="14" fill="transparent"/><circle cx="${px}" cy="${py}" r="5.5" fill="${c}" stroke="#0b1020" stroke-width="2" filter="url(#gsGlow2)"/></g>`;
      }else s+=`<circle class="gs-halo" cx="${px}" cy="${py-2}" r="6" fill="${c}" style="animation-duration:${beat}s"/>`;
    });
    svg.innerHTML=s;
    const short={hrv:'HRV',ruhepuls:'Puls',atem:'Atem',spo2:'SpO₂',belastung:'Strain',schritte:'Schritte',schlaf:'',haut:''};
    G.forEach(g=>{
      const rs=g.k.map(k=>rate(g.day,k)),c=sc(g),b=document.createElement('button');
      b.className='gs-chip gs-'+c+(g.side==='L'?' gs-L':'');b.dataset.g=g.id;
      b.style.left=((g.side==='L'?LX:RX)/VW*100)+'%';b.style.top=(g.y/VH*100)+'%';
      b.innerHTML=`<div class="gs-cl"><i class="gs-dot"></i>${esc(g.t)}${g.tag?`<em>${esc(g.tag)}</em>`:''}</div>`+g.k.map((k,i)=>{const r=rs[i],small=k==='schritte';
        return `<div class="gs-cv gs-${r.c}"><b class="gs-num${small?' gs-s':''}">${esc(k==='schritte'?nf(r.v,0):valOnly(k,r.v))}</b><span>${esc(unitOf(k))}</span><em>${esc(short[k])}</em></div>`}).join('');
      b.onclick=()=>openSheet(g);fb.appendChild(b);
    });
    svg.addEventListener('click',e=>{const t=e.target.closest('.gs-hit');if(t)openSheet(G.find(g=>g.id===t.dataset.g))});
    $g('#gsFigsub').textContent='vs. deine letzten '+D.baseTage+' Tage';
  })();

  /* Detail-Sheet */
  function gauge(k,r,when){
    if(r.m==null)return'';
    const sd=r.sd||1e-9;let lo=r.m-3*sd,hi=r.m+3*sd;
    if(r.v<lo)lo=r.v-.4*sd;if(r.v>hi)hi=r.v+.4*sd;
    if(k==='erholung'){lo=Math.max(0,lo);hi=Math.min(100,hi)}
    const P=x=>Math.max(0,Math.min(100,(x-lo)/(hi-lo)*100)),a=COL.g,b=COL.y,c=COL.r;let bg;
    if(r.dir>0)bg=`linear-gradient(90deg,${a} 0%,${a} ${P(r.m+sd)}%,${b} ${P(r.m+sd)}%,${b} ${P(r.m+2*sd)}%,${c} ${P(r.m+2*sd)}%,${c} 100%)`;
    else if(r.dir<0)bg=`linear-gradient(90deg,${c} 0%,${c} ${P(r.m-2*sd)}%,${b} ${P(r.m-2*sd)}%,${b} ${P(r.m-sd)}%,${a} ${P(r.m-sd)}%,${a} 100%)`;
    else bg='linear-gradient(90deg,#475569,#94a3b8)';
    const fv=x=>k==='schlaf'?hm(x):k==='schritte'?nf(x,0):nf(x,M[k].d);
    return `<div class="gs-gauge gs-${r.c}"><div class="gs-tk" style="background:${bg}"></div><div class="gs-bd" style="left:${P(r.lo)}%;width:${P(r.hi)-P(r.lo)}%"></div>
      <div class="gs-mt gs-num" style="left:${P(r.v)}%">${when||'heute'}</div><div class="gs-mk" style="left:${P(r.v)}%"></div></div>
      <div class="gs-gl gs-num"><span style="left:${P(r.lo)}%">${fv(r.lo)}</span><span style="left:${P(r.hi)}%">${fv(r.hi)}</span></div>`;
  }
  function metHTML(day,k,when){
    const r=rate(day,k),m=M[k];let dev='',line='';
    if(r.m!=null){
      const dAbs=Math.abs(r.diff),sign=r.diff>=0?'+':'−';
      dev=(k==='schlaf'?sign+hm(dAbs):k==='schritte'?sign+nf(dAbs,0):sign+nf(dAbs,Math.max(m.d,1))+(m.u?' '+m.u:''))+' vs. Ø';
      const bad=r.dir===0?'':r.dir<0?'Niedrige Werte sind ungünstig.':'Hohe Werte sind ungünstig.';
      const vo=x=>k==='schritte'?nf(x,0):valOnly(k,x),un=unitOf(k)?' '+unitOf(k):'';
      line=`Normalbereich ${vo(r.lo)}–${vo(r.hi)}${un} · Ø ${vo(r.m)}${un} · ${nf(Math.abs(r.z),1)} SD ${r.diff>=0?'darüber':'darunter'}. ${bad}`;
    }else line=r.txt;
    return `<div class="gs-met gs-${r.c}"><div class="gs-mh"><b>${esc(m.lang||m.n)}</b><span class="gs-pill">${WORD[r.c]}</span></div>
      <div class="gs-mv"><strong class="gs-num">${esc(r.v==null?'–':(k==='schritte'?nf(r.v,0):valOnly(k,r.v)))}<small>${esc(unitOf(k))}</small></strong><span class="gs-num">${esc(dev)}</span></div>
      ${gauge(k,r,when)}<p class="gs-v">${esc(line)}</p><p>${esc(m.ex)}</p></div>`;
  }
  function openSheet(g){
    if(!g)return;
    const c=worst(g.k.map(k=>rate(g.day,k).c)),sh=$g('#gsSheet');
    sh.className='gs-sheet gs-'+c;$g('#gsShI').innerHTML=ico(g.ic);$g('#gsShT').textContent=g.st||g.t;
    let x=g.k.map(k=>metHTML(g.day,k,g.tag)).join('');
    if(g.id==='beine')x+=`<p class="gs-shn">Werte vom ${esc(dDE(g.day.d,{day:'numeric',month:'long'}))}, dem letzten vollständigen Tag. Der heutige Tag hat gerade erst angefangen.</p>`;
    if(g.id==='kopf'&&L.schlaf)x+=`<p class="gs-shn">Schlafbedarf heute laut Whoop: ${hm(L.schlaf.bedarf_heute_h)} · Schlafleistung ${nf(L.schlaf.leistung_prozent,0)} %.</p>`;
    if(g.id==='herz')x+=`<p class="gs-shn">Das Herz in der Figur schlägt in deinem echten Ruhepuls: ${nf(L.v.ruhepuls,0)} Schläge pro Minute.</p>`;
    $g('#gsShB').innerHTML=x;
    $$g('.gs-chip').forEach(e=>e.classList.toggle('gs-sel',e.dataset.g===g.id));
    sh.classList.add('gs-open');$g('#gsVeil').classList.add('gs-open');sh.scrollTop=0;
  }
  function closeSheet(){const sh=$g('#gsSheet');if(!sh)return;sh.classList.remove('gs-open');$g('#gsVeil').classList.remove('gs-open');$$g('.gs-chip').forEach(e=>e.classList.remove('gs-sel'))}
  $g('#gsShX').onclick=closeSheet;$g('#gsVeil').onclick=closeSheet;
  (()=>{let y0=null;const sh=$g('#gsSheet');sh.ontouchstart=e=>{if(sh.scrollTop<=0)y0=e.touches[0].clientY};
    sh.ontouchmove=e=>{if(y0!=null&&e.touches[0].clientY-y0>70){y0=null;closeSheet()}};sh.ontouchend=()=>y0=null})();

  /* Empfehlung */
  (()=>{
    const bc=b=>{b=(b||'').toLowerCase();return b.includes('gut')?'gs-b-gut':b.includes('erste')?'gs-b-erst':b.includes('daten')?'gs-b-daten':b.includes('erfahr')?'gs-b-erfahr':'gs-b-x'};
    const bi=b=>{b=(b||'').toLowerCase();return b.includes('gut')?'check':b.includes('erste')?'flask':b.includes('daten')?'chart':b.includes('erfahr')?'leaf':'spark'};
    const badge=b=>b?`<span class="gs-badge ${bc(b)}">${ico(bi(b),2.2)}${esc(b)}</span>`:'';
    const icFor=t=>{t=(t||'').toLowerCase();return /schlaf|bett|nickerchen|koffein/.test(t)?'moon':/atm/.test(t)?'wind':/intensiv|ausdauer|zone|training/.test(t)?'bolt':/spazier|leicht|yoga|mobil/.test(t)?'leaf':/trink|wasser|magnes|ernähr/.test(t)?'flask':'spark'};
    const z=zoneOf(L.v.erholung),weitere=(L.empfehlungen||[]).filter(e=>e&&e.text&&e.text!==L.empfehlung),auff=L.auffaellig||[];
    const el=$g('#gsEmp');el.classList.add('gs-'+z);
    el.innerHTML=`<div class="gs-ehead"><div class="gs-eico">${ico(icFor(L.empfehlung),2.1)}</div><div><div class="gs-ek">Tagesempfehlung</div><div class="gs-ew">von Chopper · nach festen Regeln aus der Forschung</div></div></div>
     <p class="gs-emain">${esc(L.empfehlung||'Heute keine Empfehlung.')}</p>${badge(L.belegstufe)}
     ${weitere.length?`<div class="gs-sect">Weitere Empfehlungen</div><ul class="gs-elist">${weitere.map(e=>`<li><div class="gs-ic">${ico(icFor(e.text))}</div><div>${badge(e.beleg||e.belegstufe)}<p>${esc(e.text)}</p></div></li>`).join('')}</ul>`:''}
     <div class="gs-sect">Auffällig</div><div class="gs-chips">${auff.length?auff.map(a=>`<span class="gs-pill gs-y">${esc(a)}</span>`).join(''):'<span class="gs-pill gs-g">Heute nichts auffällig</span>'}</div>
     <div class="gs-sect">Belegstufen</div><div class="gs-chips">${['gut belegt','erste Hinweise','aus deinen Daten','Erfahrungsheilkunde'].map(badge).join('')}</div>`;
  })();

  /* Schlaf */
  (()=>{
    const s=L.schlaf||{},need=s.bedarf_heute_h,base=s.bedarf_grund_h,dur=s.dauer_h!=null?s.dauer_h:L.v.schlaf;
    const pct=need&&dur!=null?Math.round(dur/need*100):null,q=rate(L,'schlaf');
    const ph=[['Tief','tief_h','#4f46e5','#818cf8'],['REM','rem_h','#7c3aed','#c084fc'],['Leicht','leicht_h','#0891b2','#67e8f9'],['Wach','wach_h','#d97706','#fcd34d']];
    const tot=ph.reduce((a,p)=>a+(s[p[1]]||0),0)||1,R=54,C=2*Math.PI*R,f=pct==null?0:Math.min(1,pct/100);
    const ring=(val,c1,c2,id)=>{const r=20,c=2*Math.PI*r,ff=val==null?0:Math.max(0,Math.min(1,val/100));return `<svg viewBox="0 0 52 52"><defs><linearGradient id="${id}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${c1}"/><stop offset="1" stop-color="${c2}"/></linearGradient></defs><circle cx="26" cy="26" r="${r}" fill="none" stroke="rgba(255,255,255,.08)" stroke-width="5"/><circle class="gs-sr" cx="26" cy="26" r="${r}" fill="none" stroke="url(#${id})" stroke-width="5" stroke-linecap="round" stroke-dasharray="${c.toFixed(1)}" stroke-dashoffset="${c.toFixed(1)}" data-off="${(c*(1-ff)).toFixed(1)}" transform="rotate(-90 26 26)"/><text x="26" y="30" text-anchor="middle" font-size="12.5" font-weight="700" fill="#f4f6fb" style="font-variant-numeric:tabular-nums">${nf(val,0)}</text></svg>`};
    const el=$g('#gsSleep');
    el.innerHTML=`<div class="gs-kick"><h2>Schlaf letzte Nacht</h2><span class="gs-pill gs-${q.c}">${q.c==='g'?'Normal':WORD[q.c]}</span></div>
     <div class="gs-srow"><div class="gs-sring"><svg viewBox="0 0 128 128"><defs><linearGradient id="gsSlG" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#c084fc"/><stop offset="1" stop-color="#6366f1"/></linearGradient></defs>
      <circle cx="64" cy="64" r="${R}" fill="none" stroke="rgba(255,255,255,.07)" stroke-width="11"/>
      <circle class="gs-sr" cx="64" cy="64" r="${R}" fill="none" stroke="url(#gsSlG)" stroke-width="11" stroke-linecap="round" stroke-dasharray="${C.toFixed(1)}" stroke-dashoffset="${C.toFixed(1)}" data-off="${(C*(1-f)).toFixed(1)}" transform="rotate(-90 64 64)" filter="url(#gsGlow2)"/></svg>
      <div class="gs-c"><b class="gs-num">${pct==null?'–':pct}<small>%</small></b><span>vom Bedarf</span></div></div>
      <div style="min-width:0"><div class="gs-sbig gs-num">${hmS(dur)}<small>h</small></div>
      <div class="gs-stimes gs-num"><span style="color:#c4b5fd;display:flex">${ico('moon')}</span>${esc(s.einschlafen||'–')}<i></i>${esc(s.aufwachen||'–')}<span style="color:#fcd34d;display:flex">${ico('sun')}</span></div>
      <div class="gs-sneed">Bedarf heute <b class="gs-num">${hm(need)}</b><br>Grundbedarf ${hm(base)}${s.nickerchen_h?` · Nickerchen ${hm(s.nickerchen_h)}`:''}</div></div></div>
     <div class="gs-phases">${ph.map(p=>`<i style="flex:${Math.max(.0001,(s[p[1]]||0)/tot)};background:linear-gradient(90deg,${p[2]},${p[3]});box-shadow:0 0 12px -2px ${p[3]}88;transform:scaleX(${rm?1:0})" title="${p[0]}"></i>`).join('')}</div>
     <div class="gs-pleg">${ph.map(p=>`<div><i style="background:linear-gradient(135deg,${p[3]},${p[2]})"></i>${p[0]}<b class="gs-num">${hm(s[p[1]])}</b><em class="gs-num">${Math.round((s[p[1]]||0)/tot*100)} %</em></div>`).join('')}</div>
     <div class="gs-mini"><div>${ring(s.leistung_prozent,'#c084fc','#6366f1','gsM1')}<span>Leistung</span></div><div>${ring(s.effizienz_prozent,'#67e8f9','#0891b2','gsM2')}<span>Effizienz</span></div><div>${ring(s.regelmaessigkeit_prozent,'#6ee7b7','#059669','gsM3')}<span>Regelmäßigkeit</span></div></div>`;
    el._anim=()=>{el.querySelectorAll('.gs-sr').forEach(c=>{c.style.transition=rm?'none':'stroke-dashoffset 1.6s cubic-bezier(.22,.8,.18,1)';c.style.strokeDashoffset=c.dataset.off});
      el.querySelectorAll('.gs-phases i').forEach((p,i)=>{p.style.transitionDelay=(i*.12)+'s';p.style.transform='scaleX(1)'})};
  })();

  /* Verläufe */
  const TR=[{k:'erholung',n:'Erholung',c:'#34d399'},{k:'hrv',n:'HRV',c:'#a78bfa'},{k:'ruhepuls',n:'Ruhepuls',c:'#fb7185'},{k:'schlaf',n:'Schlafdauer',c:'#60a5fa'}];
  let curN=30,trendsSeen=false;
  function smooth(p){const n=p.length;if(n<2)return'';const f=v=>v.toFixed(1);let d=`M${f(p[0][0])} ${f(p[0][1])}`;
    const dx=[],m=[];for(let i=0;i<n-1;i++){dx[i]=p[i+1][0]-p[i][0];m[i]=(p[i+1][1]-p[i][1])/(dx[i]||1e-9)}
    const t=[];t[0]=m[0];t[n-1]=m[n-2];
    for(let i=1;i<n-1;i++){if(m[i-1]*m[i]<=0)t[i]=0;else{const w1=2*dx[i]+dx[i-1],w2=dx[i]+2*dx[i-1];t[i]=(w1+w2)/(w1/m[i-1]+w2/m[i])}}
    for(let i=0;i<n-1;i++){const hh=dx[i]/3;d+=`C${f(p[i][0]+hh)} ${f(p[i][1]+t[i]*hh)} ${f(p[i+1][0]-hh)} ${f(p[i+1][1]-t[i+1]*hh)} ${f(p[i+1][0])} ${f(p[i+1][1])}`}
    return d}
  function chart(tr,n,W,H){
    const k=tr.k,col=tr.c,end=new Date(L.d+'T12:00:00'),start=new Date(end);start.setDate(start.getDate()-(n-1));
    const day=86400000,idx=t=>Math.round((new Date(t.d+'T12:00:00')-start)/day),pts=T.filter(t=>idx(t)>=0);
    const pl=4,pr=30,pt=10,pb=20,iw=W-pl-pr,ih=H-pt-pb,vals=[];
    pts.forEach(t=>{const v=t.v[k],b=band(D,t,k);if(v!=null)vals.push(v);if(b)vals.push(b.m-b.sd,b.m+b.sd)});
    if(!vals.length)return'';
    let lo=Math.min(...vals),hi=Math.max(...vals);const pad=(hi-lo)*.12||1;lo-=pad;hi+=pad;if(k==='erholung'){lo=0;hi=100}
    const X=i=>pl+(n===1?iw/2:i/(n-1)*iw),Yp=v=>pt+ih-(v-lo)/(hi-lo)*ih,id='gsA'+k+n;
    let s=`<svg viewBox="0 0 ${W} ${H}" width="${W}" height="${H}"><defs><linearGradient id="${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${col}" stop-opacity=".38"/><stop offset="1" stop-color="${col}" stop-opacity="0"/></linearGradient></defs>`;
    const raw=(hi-lo)/3.5,mag=Math.pow(10,Math.floor(Math.log10(raw))),st=[1,2,2.5,5,10].map(x=>x*mag).find(x=>x>=raw)||raw,ticks=[];
    if(k==='erholung')ticks.push(34,67);else for(let v=Math.ceil(lo/st)*st;v<=hi;v+=st)ticks.push(v);
    ticks.forEach(v=>{const y=Yp(v);if(y<pt+2||y>pt+ih-2)return;s+=`<line x1="${pl}" x2="${W-pr+4}" y1="${y.toFixed(1)}" y2="${y.toFixed(1)}" stroke="rgba(255,255,255,.06)"/><text x="${W-pr+8}" y="${(y+3.5).toFixed(1)}">${nf(v,Number.isInteger(+v.toFixed(6))?0:1)}</text>`});
    const bp=pts.filter(t=>band(D,t,k));
    if(bp.length>1){const up=bp.map(t=>{const b=band(D,t,k);return[X(idx(t)),Yp(b.m+b.sd)]}),dn=bp.map(t=>{const b=band(D,t,k);return[X(idx(t)),Yp(b.m-b.sd)]});
      const upD=smooth(up),dnR=smooth(dn.slice().reverse()).replace(/^M/,'L');
      s+=`<path d="${upD}${dnR}Z" fill="rgba(52,211,153,.13)" filter="url(#gsSoft)"/><path d="${upD}${dnR}Z" fill="rgba(52,211,153,.07)"/>`;
      s+=`<path d="${upD}" fill="none" stroke="rgba(52,211,153,.35)" stroke-width="1" stroke-dasharray="2 3"/><path d="${smooth(dn)}" fill="none" stroke="rgba(52,211,153,.35)" stroke-width="1" stroke-dasharray="2 3"/>`}
    const lab=d=>d.toLocaleDateString('de-DE',{day:'numeric',month:'numeric'});
    if(n<=7){for(let i=0;i<n;i++){const d=new Date(start.getTime()+i*day);s+=`<text x="${X(i).toFixed(1)}" y="${H-3}" text-anchor="${i===0?'start':i===n-1?'end':'middle'}">${d.toLocaleDateString('de-DE',{weekday:'short'}).replace('.','')}</text>`}}
    else{const mid=Math.floor((n-1)/2),md=new Date(start.getTime()+mid*day);s+=`<text x="${pl}" y="${H-3}">${lab(start)}</text><text x="${X(mid).toFixed(1)}" y="${H-3}" text-anchor="middle">${lab(md)}</text><text x="${X(n-1).toFixed(1)}" y="${H-3}" text-anchor="end">heute</text>`}
    let seg=[],segs=[],prev=null;
    pts.forEach(t=>{const v=t.v[k],i=idx(t);if(v==null||(prev!=null&&i-prev>1)){if(seg.length)segs.push(seg);seg=[]}if(v!=null){seg.push([X(i),Yp(v)]);prev=i}else prev=null});
    if(seg.length)segs.push(seg);
    segs.forEach(sg=>{if(sg.length===1){s+=`<circle class="gs-ep" cx="${sg[0][0]}" cy="${sg[0][1]}" r="2" fill="${col}"/>`;return}
      const d=smooth(sg);
      s+=`<path class="gs-ar" d="${d}L${sg[sg.length-1][0].toFixed(1)} ${pt+ih}L${sg[0][0].toFixed(1)} ${pt+ih}Z" fill="url(#${id})"/>`;
      s+=`<path class="gs-ln" pathLength="1" d="${d}" fill="none" stroke="${col}" stroke-width="5" stroke-opacity=".25" filter="url(#gsSoft)" stroke-linecap="round"/>`;
      s+=`<path class="gs-ln" pathLength="1" d="${d}" fill="none" stroke="${col}" stroke-width="${n>30?1.8:2.3}" stroke-linecap="round" stroke-linejoin="round"/>`});
    if(n<=7)pts.forEach(t=>{const v=t.v[k];if(v==null)return;const r=rate(t,k);s+=`<circle class="gs-ep" cx="${X(idx(t)).toFixed(1)}" cy="${Yp(v).toFixed(1)}" r="3.6" fill="#0b1020" stroke="${COL[r.c]}" stroke-width="2"/>`});
    else if(n<=30)pts.forEach(t=>{const v=t.v[k];if(v==null)return;const r=rate(t,k);if(r.c==='y'||r.c==='r')s+=`<circle class="gs-ep" cx="${X(idx(t)).toFixed(1)}" cy="${Yp(v).toFixed(1)}" r="3" fill="${COL[r.c]}" stroke="#0b1020" stroke-width="1.2"/>`});
    const lv=L.v[k];if(lv!=null){const r=rate(L,k),cx=X(n-1),cy=Yp(lv);s+=`<g class="gs-ep"><circle cx="${cx}" cy="${cy}" r="9" fill="${COL[r.c]}" opacity=".22"/><circle cx="${cx}" cy="${cy}" r="4.6" fill="#fff" stroke="${COL[r.c]}" stroke-width="2.6" filter="url(#gsGlow2)"/></g>`}
    return s+'</svg>';
  }
  function drawTrends(n,animate){
    const cb=$g('#gsCharts');if(!cb)return;curN=n;
    if(!cb.children.length)cb.innerHTML=TR.map(tr=>`<div class="gs-tr" data-k="${tr.k}"><div class="gs-trh"><div><div class="gs-tn"><i style="background:${tr.c};box-shadow:0 0 10px ${tr.c}"></i>${tr.n}</div><div class="gs-trv gs-num"></div></div><div class="gs-ta gs-num"></div></div><div class="gs-cw"></div></div>`).join('');
    TR.forEach(tr=>{const el=cb.querySelector(`[data-k="${tr.k}"]`),cw=el.querySelector('.gs-cw');
      const W=Math.max(200,Math.round(cw.clientWidth||330)),H=Math.round(cw.clientHeight||132);
      cw.classList.remove('gs-drawn');cw.innerHTML=chart(tr,n,W,H);
      const end=new Date(L.d+'T12:00:00'),start=new Date(end);start.setDate(start.getDate()-(n-1));
      const nums=T.filter(t=>new Date(t.d+'T12:00:00')>=start).map(t=>t.v[tr.k]).filter(v=>v!=null),avg=nums.length?nums.reduce((a,b)=>a+b,0)/nums.length:null;
      const r=rate(L,tr.k);
      el.querySelector('.gs-trv').innerHTML=`${esc(valOnly(tr.k,L.v[tr.k]))}<small>${esc(unitOf(tr.k))}</small>`;
      el.querySelector('.gs-ta').innerHTML=`<span class="gs-pill gs-${r.c}" style="font-size:11px;padding:2px 8px">${r.c==='g'?'Normal':WORD[r.c]}</span><br>Ø ${n} Tage <b>${esc(fmtV(tr.k,avg))}</b>`;
      if(animate&&!rm){cw.getBoundingClientRect();requestAnimationFrame(()=>requestAnimationFrame(()=>cw.classList.add('gs-drawn')))}else cw.classList.add('gs-drawn');
      if(!animate&&!rm&&!trendsSeen)cw.classList.remove('gs-drawn')});
    const i=[7,30,90].indexOf(n);$g('#gsRng i').style.transform=`translateX(${i*100}%)`;
    $$g('#gsRng button').forEach(b=>b.classList.toggle('gs-on',+b.dataset.n===n));
  }
  $g('#gsRng').onclick=e=>{const b=e.target.closest('button');if(b)drawTrends(+b.dataset.n,true)};
  $g('#gsTrsub').textContent='heute '+dDE(L.d,{day:'numeric',month:'short'});
  drawTrends(30,false);

  /* Fußzeile */
  const gaps=(D.luecken||[]).length?`Fehlende Tage: ${D.luecken.map(d=>dDE(d,{day:'numeric',month:'numeric',year:'2-digit'})).join(', ')}. `:'';
  $g('#gsFoot').innerHTML=`<b>Hinweise ersetzen keinen Arzt.</b> Bei Beschwerden, die länger als 2–3 Wochen anhalten, bitte zum Arzt.<br>
   Normalbereich = Mittelwert ± 1 Standardabweichung deiner ${D.baseTage} Tage vor dem jeweiligen Tag. ${esc(gaps)}Daten: Whoop, ${T.length} Tage seit ${esc(dDE(T[0].d,{day:'numeric',month:'long',year:'numeric'}))}.<br>Nur für dich sichtbar · Chopper aktualisiert die Daten jeden Morgen.`;

  /* Tagebuch einmalig aufbauen (bleibt beim Neuzeichnen erhalten) */
  if(!$g('#gsDiary'))diaryInit();

  /* Einblenden beim Scrollen */
  (()=>{
    const onIn=el=>{el.classList.add('gs-in');if(el.id==='gsSleep'&&el._anim)setTimeout(el._anim,rm?0:250);
      if(el.id==='gsTrends'&&!trendsSeen){trendsSeen=true;setTimeout(()=>$$g('#gsCharts .gs-cw').forEach(c=>c.classList.add('gs-drawn')),rm?0:250)}};
    const els=$$g('#gsRoot .gs-rv');
    if(rm||!('IntersectionObserver' in window)){els.forEach(onIn);return}
    const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){onIn(e.target);io.unobserve(e.target)}}),{threshold:.08,rootMargin:'0px 0px -6% 0px'});
    els.forEach(e=>io.observe(e));
  })();
  cur={redraw:()=>drawTrends(curN,false),close:closeSheet};
}

// ---------- Tagebuch ----------
let sel=new Set(),dayOff=0,flushing=false;
const queue=()=>{const q=jget(QK);return q&&q.uid===uid()?q.rows:[]};
const setQueue=rows=>rows.length?jset(QK,{uid:uid(),rows}):localStorage.removeItem(QK);
const tbRows=()=>{const t=jget(TK);return t&&t.uid===uid()?t.rows:[]};
const setTb=rows=>jset(TK,{uid:uid(),at:Date.now(),rows});
const newId=()=>crypto.randomUUID?crypto.randomUUID():'10000000-1000-4000-8000-100000000000'.replace(/[018]/g,c=>(c^crypto.getRandomValues(new Uint8Array(1))[0]&15>>c/4).toString(16));
function diaryInit(){
  const w=$g('#gsDiaryWrap');if(!w)return;
  w.innerHTML=`<section class="gs-card gs-rv" id="gsDiary">
   <div class="gs-kick"><h2>Tagebuch</h2><small>Chopper liest mit</small></div>
   <div class="gs-tb"><textarea id="gsTxt" rows="2" maxlength="2000" placeholder="Wie geht’s dir heute?" enterkeyhint="done" autocapitalize="sentences"></textarea>
    <button id="gsMic" type="button" aria-label="Diktieren">${ico('mic')}</button></div>
   <div class="gs-qts">${TAGS.map(t=>`<button type="button" class="gs-qt" data-t="${esc(t)}">${esc(t)}</button>`).join('')}</div>
   <div class="gs-tbrow"><div class="gs-seg2" id="gsDay"><button type="button" data-d="0" class="gs-on">Heute</button><button type="button" data-d="1">Gestern</button></div>
    <button type="button" id="gsSave" class="gs-btn">Speichern</button></div>
   <p class="gs-muted gs-tbhint" id="gsTbHint">Zum Diktieren auf der iPhone-Tastatur das Mikrofon antippen. Chopper bezieht deine Einträge in die Tagesempfehlung ein.</p>
   <div class="gs-tbmsg" id="gsTbMsg"></div>
   <div class="gs-sect">Letzte Einträge</div><div id="gsEnts"></div></section>`;
  sel=new Set();dayOff=0;
  const txt=$g('#gsTxt');
  $g('#gsMic').onclick=()=>{txt.focus();const h=$g('#gsTbHint');h.classList.remove('gs-flash');void h.offsetWidth;h.classList.add('gs-flash')};
  w.querySelectorAll('.gs-qt').forEach(b=>b.onclick=()=>{const t=b.dataset.t;sel.has(t)?sel.delete(t):sel.add(t);b.classList.toggle('gs-on',sel.has(t))});
  $g('#gsDay').onclick=e=>{const b=e.target.closest('button');if(!b)return;dayOff=+b.dataset.d;$$g('#gsDay button').forEach(x=>x.classList.toggle('gs-on',x===b))};
  $g('#gsSave').onclick=save;
  renderEnts();
}
const msg=(t,err)=>{const m=$g('#gsTbMsg');if(m){m.textContent=t||'';m.className='gs-tbmsg'+(err?' gs-err':'')}};
async function save(){
  const txt=$g('#gsTxt'),text=txt.value.trim(),tags=TAGS.filter(t=>sel.has(t));
  if(!text&&!tags.length){msg('Bitte etwas eintragen oder ein Stichwort antippen.',true);return}
  const d=new Date();d.setDate(d.getDate()-dayOff);
  setQueue([...queue(),{id:newId(),datum:isoLocal(d),text,stichworte:tags,erstellt:new Date().toISOString()}]);
  txt.value='';sel.clear();$$g('.gs-qt').forEach(b=>b.classList.remove('gs-on'));
  msg('');renderEnts();
  const r=await flush();
  msg(r==='ok'?'Gespeichert.':r==='offline'?'Offline gespeichert – wird übertragen, sobald du wieder Netz hast.':'Nicht gespeichert: '+r,r!=='ok'&&r!=='offline');
  renderEnts();
}
async function flush(){ // Warteschlange an Supabase senden -> 'ok' | 'offline' | Fehlertext
  if(flushing||!uid())return'offline';flushing=true;
  try{for(const e of queue()){
      try{const r=await Auth.api('/rest/v1/gesundheit_tagebuch',{method:'POST',headers:{Prefer:'return=representation'},body:{id:e.id,datum:e.datum,text:e.text,stichworte:e.stichworte}});
        const row=r&&r[0]||{...e};setTb([row,...tbRows().filter(x=>x.id!==row.id)])}
      catch(err){if(err.status!==409)return err.status?err.message:'offline'}
      setQueue(queue().filter(x=>x.id!==e.id))}
    return'ok'}
  finally{flushing=false}
}
async function diaryLoad(){
  await flush();
  try{const rows=await Auth.api('/rest/v1/gesundheit_tagebuch?select=id,datum,erstellt,text,stichworte&order=erstellt.desc&limit=30');setTb(rows||[])}catch(e){}
  renderEnts();
}
function renderEnts(){
  const el=$g('#gsEnts');if(!el)return;
  const q=queue().map(e=>({...e,pending:true})),rows=[...q.reverse(),...tbRows()];
  if(!rows.length){el.innerHTML='<p class="gs-muted">Noch keine Einträge.</p>';return}
  const today=isoLocal(new Date()),yd=(()=>{const d=new Date();d.setDate(d.getDate()-1);return isoLocal(d)})();
  el.innerHTML=rows.map(e=>{const t=e.erstellt?new Date(e.erstellt):null,day=e.datum===today?'Heute':e.datum===yd?'Gestern':dDE(e.datum,{weekday:'short',day:'numeric',month:'numeric'});
    return `<div class="gs-ent${e.pending?' gs-pend':''}"><div class="gs-entm"><div class="gs-enth"><b>${esc(day)}</b>${t&&!isNaN(t)?`<span class="gs-num">${t.toLocaleTimeString('de-DE',{hour:'2-digit',minute:'2-digit'})}</span>`:''}${e.pending?'<span class="gs-pill gs-y">wartet auf Netz</span>':''}</div>
      ${e.text?`<p>${esc(e.text)}</p>`:''}${(e.stichworte||[]).length?`<div class="gs-chips">${e.stichworte.map(s=>`<span class="gs-tag">${esc(s)}</span>`).join('')}</div>`:''}</div>
      <button type="button" class="gs-del" data-id="${esc(e.id)}" aria-label="Eintrag löschen">${ico('trash')}</button></div>`}).join('');
  el.querySelectorAll('.gs-del').forEach(b=>b.onclick=()=>del(b.dataset.id));
}
async function del(id){
  if(!confirm('Diesen Eintrag löschen?'))return;
  if(queue().some(e=>e.id===id)){setQueue(queue().filter(e=>e.id!==id));renderEnts();return}
  try{await Auth.api('/rest/v1/gesundheit_tagebuch?id=eq.'+encodeURIComponent(id),{method:'DELETE'});setTb(tbRows().filter(e=>e.id!==id));msg('Gelöscht.')}
  catch(e){msg(e.status?'Nicht gelöscht: '+e.message:'Löschen geht nur mit Verbindung.',true)}
  renderEnts();
}

// ---------- globale Ereignisse ----------
if(typeof window!=='undefined'){
  let rsT;addEventListener('resize',()=>{clearTimeout(rsT);rsT=setTimeout(()=>{if(cur&&$g('#gsCharts'))cur.redraw()},150)});
  addEventListener('keydown',e=>{if(e.key==='Escape'&&cur)cur.close()});
  addEventListener('online',()=>{if(uid()&&queue().length)flush().then(()=>{renderEnts();if($g('#gsTbMsg'))msg('')})});
}
return{view,clear,flush,info,pending:()=>queue().length,closeSheet:()=>cur&&cur.close()};
})();
