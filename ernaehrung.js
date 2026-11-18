/* Ernährung: Score, Mahlzeiten, manuelle Eingabe. Daten je Konto aus Supabase (RLS). */
window.Ernaehrung=(()=>{
  const EK='gs-app-ernaehrung';
  const MAHL=['frühstück','mittag','abend','snack','getränk'];
  const TITEL={frühstück:'Frühstück',mittag:'Mittag',abend:'Abend',snack:'Snack',getränk:'Getränk'};
  const BALLAST_ZIEL=30,BALLAST_MITTEL=20,GEMUESE_ZIEL=5,WASSER_ZIEL=1.5;
  let zeilen=[], selected=null, heute=heuteISO();
  const $g=(r,s)=>r.querySelector(s);
  const esc=s=>String(s==null?'':s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
  const uid=()=>Auth.user&&Auth.user.id;
  const jget=()=>{try{return JSON.parse(localStorage.getItem(EK)||'null')}catch(e){return null}};
  const jset=v=>{try{localStorage.setItem(EK,JSON.stringify(v))}catch(e){}};

  function heuteISO(){
    const p=new Intl.DateTimeFormat('en-CA',{timeZone:'Etc/GMT-1',year:'numeric',month:'2-digit',day:'2-digit'}).formatToParts(new Date());
    const g=t=>p.find(x=>x.type===t).value;return `${g('year')}-${g('month')}-${g('day')}`;
  }
  function parseZahl(v){if(v==null||v==='')return null;const n=Number(String(v).trim().replace(',','.'));return Number.isFinite(n)?n:null}
  function hatWerte(z){return ['kcal','protein_g','ballaststoffe_g','zucker_g','gemuese_obst_portionen','nova'].some(k=>parseZahl(z[k])!=null)}
  function normalizeMahlzeit(raw){const s=String(raw||'').toLowerCase();
    if(/frühstück|fruehstueck|breakfast/.test(s))return 'frühstück';
    if(/mittag/.test(s))return 'mittag';if(/abend/.test(s))return 'abend';
    if(/snack|zwisch/.test(s))return 'snack';if(/getränk|getraenk|drink/.test(s))return 'getränk';return s||'snack'}
  function parseVolumenLiter(menge){if(!menge)return 0;const s=String(menge).toLowerCase().replace(/,/g,'.');
    const ml=[...s.matchAll(/(\d+(?:\.\d+)?)\s*ml\b/g)];if(ml.length)return ml.reduce((a,m)=>a+parseFloat(m[1])/1000,0);
    return [...s.matchAll(/(\d+(?:\.\d+)?)\s*l(?:iter)?\b/g)].reduce((a,m)=>a+parseFloat(m[1]),0)}
  function istWasser(z){const t=`${z.was||''} ${z.menge_geschaetzt||''}`.toLowerCase();
    if(/saft|juice|smoothie|kaffee|coffee|kakao|milch|tee\b|tea\b|cola|limo|fanta|sprite|energy|softdrink/.test(t))return false;
    return /\bwasser\b|mineralwasser|leitungswasser|sprudel/.test(t)}
  function istSoftdrink(z){const t=`${z.was||''} ${z.menge_geschaetzt||''} ${z.notiz||''}`.toLowerCase();
    return /energy\s*drink|\benergy\b|red bull|monster energy|booster|softdrink|soft[- ]?drink|\bcola\b|\blimo\b|limonade|\bfanta\b|\bsprite\b|\bspezi\b|mezzo mix|eistee|ice(?:d)? tea/.test(t)}
  function addDays(iso,d){const [y,m,da]=iso.split('-').map(Number);const dt=new Date(Date.UTC(y,m-1,da));dt.setUTCDate(dt.getUTCDate()+d);return dt.toISOString().slice(0,10)}
  function formatDatum(iso,opts){const [y,m,d]=iso.split('-').map(Number);return new Intl.DateTimeFormat('de-DE',opts).format(new Date(Date.UTC(y,m-1,d,12)))}
  function formatZahl(n,maxFrac=1){if(n==null||!Number.isFinite(n))return '–';return new Intl.NumberFormat('de-DE',{maximumFractionDigits:maxFrac,minimumFractionDigits:0}).format(n)}
  function ca(n,einheit,maxFrac){if(n==null)return 'nicht geschätzt';return `ca. ${formatZahl(n,maxFrac)}${einheit?`\u00a0${einheit}`:''}`}
  function gewicht(){return window.Profil&&Profil.gewicht?Profil.gewicht():null}
  function proteinZiel(){const kg=gewicht();return kg&&kg>0?{gramm:(Profil.zielGramm(kg)),anzeige:Profil.zielAnzeige(kg),kg}:null}

  function berechneTag(datum){
    const list=zeilen.filter(z=>z.datum===datum).map(z=>({...z,mahlzeit:normalizeMahlzeit(z.mahlzeit)}));
    const ziel=proteinZiel();
    const tag={datum,zeilen:list,hatEintrag:list.length>0,hatWerte:list.some(hatWerte),kcal:0,protein:0,ballaststoffe:0,zucker:0,gemuese:0,wasserL:0,energyOderSoftdrink:false,nova4:0,frittierteMahlzeiten:0,score:null,teile:null,ziel};
    if(!tag.hatWerte)return tag;
    const fried=new Set();
    for(const z of list){if(!hatWerte(z))continue;
      tag.kcal+=parseZahl(z.kcal)||0;tag.protein+=parseZahl(z.protein_g)||0;tag.ballaststoffe+=parseZahl(z.ballaststoffe_g)||0;
      tag.zucker+=parseZahl(z.zucker_g)||0;tag.gemuese+=parseZahl(z.gemuese_obst_portionen)||0;
      if(parseZahl(z.nova)===4)tag.nova4+=1;
      if(String(z.frittiert||'').toLowerCase()==='ja')fried.add(`${z.mahlzeit}|${z.uhrzeit||''}`);
      if(z.mahlzeit==='getränk'){if(istWasser(z))tag.wasserL+=parseVolumenLiter(z.menge_geschaetzt);if(istSoftdrink(z))tag.energyOderSoftdrink=true}}
    tag.frittierteMahlzeiten=fried.size;
    const gemP=tag.gemuese>=5?3:tag.gemuese>=3?2:tag.gemuese>=1?1:0;
    const pAnt=ziel&&ziel.gramm?tag.protein/ziel.gramm:0;
    const protP=ziel? (pAnt>=1?2:pAnt>=0.7?1:0) : 0;
    const balP=tag.ballaststoffe>=BALLAST_ZIEL?2:tag.ballaststoffe>=BALLAST_MITTEL?1:0;
    let verP=2;verP-=tag.frittierteMahlzeiten;if(tag.nova4>=2)verP-=1;verP=Math.max(0,verP);
    const getP=tag.wasserL>=WASSER_ZIEL&&!tag.energyOderSoftdrink?1:0;
    tag.teile={
      protein:{name:'Protein',punkte:protP,max:2,wertText:ziel?`${ca(tag.protein,'g')} von ${ziel.anzeige}\u00a0g`:`${ca(tag.protein,'g')} – bitte Gewicht im Profil setzen`,note:ziel?`Ziel: 0,8\u00a0g × ${formatZahl(ziel.kg)}\u00a0kg.`:'Ohne Gewicht kein Protein-Punkt.',progress:ziel&&ziel.gramm?Math.min(1,tag.protein/ziel.gramm):0},
      gemuese:{name:'Gemüse & Obst',punkte:gemP,max:3,wertText:`${ca(tag.gemuese,'von')} ${formatZahl(GEMUESE_ZIEL)} Portionen`,note:tag.gemuese>=5?'Ziel von 5 Portionen erreicht.':'Ziel: 5 Portionen am Tag.',progress:Math.min(1,tag.gemuese/GEMUESE_ZIEL)},
      ballaststoffe:{name:'Ballaststoffe',punkte:balP,max:2,wertText:`${ca(tag.ballaststoffe,'g')} von ${formatZahl(BALLAST_ZIEL)}\u00a0g`,note:tag.ballaststoffe>=BALLAST_ZIEL?'Richtwert von 30\u00a0g erreicht.':'Richtwert: mindestens 30\u00a0g.',progress:Math.min(1,tag.ballaststoffe/BALLAST_ZIEL)},
      verarbeitung:{name:'Verarbeitung',punkte:verP,max:2,wertText:(tag.nova4?`${tag.nova4}\u00a0× NOVA 4`:'kein NOVA 4')+' · '+(tag.frittierteMahlzeiten?`${tag.frittierteMahlzeiten} frittiert`:'nichts Frittiertes'),note:'Start bei 2, minus 1 je frittierte Mahlzeit, minus 1 ab zwei stark verarbeiteten Zeilen (NOVA 4).',progress:verP/2},
      getraenke:{name:'Getränke',punkte:getP,max:1,wertText:`${ca(tag.wasserL,'l')} Wasser von ${formatZahl(WASSER_ZIEL,1)}\u00a0l`,note:tag.energyOderSoftdrink?'Der Punkt entfällt bei einem Energy Drink oder Softdrink.':(tag.wasserL>=WASSER_ZIEL?'Mindestens 1,5\u00a0l Wasser, ohne Softdrink.':(tag.wasserL===0?'Kein Wasser erfasst. Saft zählt nicht als Wasser.':'Noch unter 1,5\u00a0l Wasser.')),progress:Math.min(1,tag.wasserL/WASSER_ZIEL)}
    };
    tag.score=gemP+protP+balP+verP+getP;return tag;
  }
  function scoreFarbe(s){if(s==null)return '#8b9ea4';if(s>=8)return '#7ed3c5';if(s>=5)return '#d4c09a';return '#d08b76'}
  function insight(tag){
    if(!tag.hatEintrag)return{title:'Nichts eingetragen.',text:'Für diesen Tag gibt es noch keine Mahlzeiten.'};
    if(!tag.hatWerte)return{title:'Zu wenig Daten.',text:'Die Mahlzeiten sind notiert, Schätzungen zu Protein, Portionen und Verarbeitung fehlen aber noch.'};
    const s=tag.score,title=s>=9?'Starker Tag.':s>=7?'Guter Tag.':s>=5?'Solider Tag.':s>=3?'Geht so.':'Schwacher Tag.';
    const luecken=[];if(tag.teile.ballaststoffe.punkte===0)luecken.push('Ballaststoffe');if(tag.teile.getraenke.punkte===0)luecken.push('Wasser');
    if(tag.teile.gemuese.punkte<=1)luecken.push('Gemüse und Obst');if(tag.teile.protein.punkte===0)luecken.push('Protein');
    if(tag.teile.verarbeitung.punkte===0)luecken.push('weniger stark Verarbeitetes');
    let text=s>=9?'Die Bausteine sitzen – so kann’s weitergehen.':(luecken.length===0?'Ein ruhiger, ausgewogener Tag.':(luecken.length===1?`Mehr ${luecken[0]} würde den Score heben.`:`Mehr ${luecken[0]} und ${luecken[1]} würden den Score heben.`));
    return{title,text};
  }

  async function load(){
    const u=uid();if(!u){zeilen=[];return}
    const cached=jget();if(cached&&cached.uid===u)zeilen=cached.zeilen||[];
    try{
      const rows=await Auth.api('/rest/v1/gesundheit_ernaehrung?select=id,datum,uhrzeit,mahlzeit,was,menge_geschaetzt,notiz,kcal,protein_g,ballaststoffe_g,zucker_g,gemuese_obst_portionen,nova,frittiert,bewertung,quelle,erstellt&order=datum.desc,erstellt.asc&limit=2000');
      zeilen=rows||[];jset({uid:u,zeilen});
    }catch(e){if(!zeilen)zeilen=[]}
    heute=heuteISO();
    const mitW= [...new Set(zeilen.filter(hatWerte).map(z=>z.datum))].sort();
    const heuteZ=zeilen.filter(z=>z.datum===heute);
    selected=heuteZ.some(hatWerte)||heuteZ.length?heute:(mitW[mitW.length-1]||heute);
  }

  async function addManual(fields){
    const body={datum:fields.datum||heuteISO(),uhrzeit:fields.uhrzeit||'',mahlzeit:normalizeMahlzeit(fields.mahlzeit),was:fields.was,menge_geschaetzt:fields.menge_geschaetzt||'',notiz:fields.notiz||'',
      kcal:parseZahl(fields.kcal),protein_g:parseZahl(fields.protein_g),ballaststoffe_g:parseZahl(fields.ballaststoffe_g),zucker_g:parseZahl(fields.zucker_g),
      gemuese_obst_portionen:parseZahl(fields.gemuese_obst_portionen),nova:parseZahl(fields.nova),frittiert:fields.frittiert||null,bewertung:fields.bewertung||null,quelle:'manual'};
    const r=await Auth.api('/rest/v1/gesundheit_ernaehrung',{method:'POST',headers:{Prefer:'return=representation'},body});
    const row=r&&r[0];if(row){zeilen=[...zeilen,row];jset({uid:uid(),zeilen});selected=row.datum}return row;
  }
  async function delManual(id){
    await Auth.api('/rest/v1/gesundheit_ernaehrung?id=eq.'+encodeURIComponent(id),{method:'DELETE'});
    zeilen=zeilen.filter(z=>z.id!==id);jset({uid:uid(),zeilen});
  }

  function view(el){
    if(!el)return;
    el.innerHTML=`<div class="en-page" id="enRoot">
      <nav class="day-nav" aria-label="Tag wechseln">
        <button class="icon-btn" id="enPrev" type="button" aria-label="Vorheriger Tag">${chev(-1)}</button>
        <div class="day-nav-label"><div class="day-nav-kicker" id="enKicker"></div><div class="day-nav-date" id="enDate"></div></div>
        <button class="icon-btn" id="enNext" type="button" aria-label="Nächster Tag">${chev(1)}</button>
      </nav>
      <section class="hero" aria-labelledby="enCaption">
        <div class="score-wrap">
          <svg viewBox="0 0 280 160" aria-hidden="true"><path class="track" d="M36 138 A 104 104 0 0 1 244 138"></path>
            <path id="enArc" class="value" pathLength="10" d="M36 138 A 104 104 0 0 1 244 138"></path>
            <text class="tick-label" x="22" y="154">0</text><text class="tick-label" x="248" y="154">10</text></svg>
          <div class="score-center"><div class="score-number" id="enScore">–</div><div class="score-caption" id="enCaption">Ernährung</div></div>
        </div>
        <h2 class="insight" id="enTitle">–</h2>
        <p class="insight-text" id="enText"></p>
        <div class="kcal-pill" id="enKcal"></div>
      </section>
      <div class="en-body">
        <section><h3 class="section-title">Bausteine</h3><div class="cards" id="enCards"></div></section>
        <section><h3 class="section-title">Mahlzeiten</h3><div class="meals" id="enMeals"></div>
          <button class="btn-primary en-add" id="enAdd" type="button">Mahlzeit eintragen</button></section>
        <section class="trend"><h3 class="section-title">7-Tage-Verlauf</h3><div class="chart" id="enChart"></div></section>
        <p class="footnote">Alle Mengen und Nährwerte sind grobe Schätzungen – keine Messwerte. Kalorien nur zur Info, ohne Bewertung. Einträge von Sanji erscheinen nur in Eriks Konto.</p>
      </div>
    </div>
    <div class="overlay" id="enOverlay" hidden></div>
    <aside class="sheet" id="enSheet" hidden role="dialog" aria-labelledby="enSheetT" aria-modal="true"></aside>`;
    bind(el);render(el);
  }

  function chev(dir){return `<svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="${dir<0?'M12.5 4.5 7 10l5.5 5.5':'M7.5 4.5 13 10l-5.5 5.5'}" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/></svg>`}

  function range(){
    const tage=[...new Set(zeilen.map(z=>z.datum))].sort();
    const min=tage[0]||heute,max=heute>= (tage[tage.length-1]||heute)?heute:(tage[tage.length-1]);
    return {min,max};
  }

  function render(el){
    if(!selected)selected=heute;
    const tag=berechneTag(selected),{min,max}=range();
    const istHeute=tag.datum===heute;
    $g(el,'#enKicker').textContent=istHeute?'Heute':formatDatum(tag.datum,{weekday:'short'});
    $g(el,'#enDate').textContent=formatDatum(tag.datum,{weekday:'short',day:'numeric',month:'short'});
    $g(el,'#enPrev').disabled=selected<=min;$g(el,'#enNext').disabled=selected>=max;
    const num=$g(el,'#enScore'),arc=$g(el,'#enArc'),color=scoreFarbe(tag.score);
    el.querySelector('.score-wrap').style.setProperty('--score',color);
    if(tag.score==null){num.textContent='–';num.classList.add('is-empty');arc.style.strokeDasharray='0 10'}
    else{num.textContent=String(tag.score);num.classList.remove('is-empty');arc.style.strokeDasharray=`${tag.score} 10`}
    const w=insight(tag);$g(el,'#enTitle').textContent=w.title;$g(el,'#enText').textContent=w.text;
    $g(el,'#enKcal').innerHTML=!tag.hatWerte?(tag.hatEintrag?'<span>Kalorien nicht geschätzt</span>':'<span>Keine Einträge</span>'):`<span>${ca(tag.kcal,'kcal',0)}</span>${tag.zucker?` · ${ca(tag.zucker,'g')} Zucker`:''}`;
    renderCards(el,tag);renderMeals(el,tag);renderChart(el);
  }

  function renderCards(el,tag){
    const root=$g(el,'#enCards');root.innerHTML='';
    if(!tag.hatWerte){root.innerHTML=`<div class="no-data">${tag.hatEintrag?'Kein Score – zu wenig Daten. Die Wertspalten für diesen Tag sind leer.':'Für diesen Tag gibt es noch keine Bausteine.'}</div>`;return}
    if(!tag.ziel){const n=document.createElement('div');n.className='banner';n.textContent='Im Profil fehlt noch ein Gewicht. Ohne Gewicht gibt es keine Protein-Punkte.';root.appendChild(n)}
    for(const key of ['protein','gemuese','ballaststoffe','verarbeitung','getraenke']){
      const t=tag.teile[key],bar=t.punkte===0&&t.max>0?'var(--terracotta)':scoreFarbe((t.punkte/t.max)*10);
      const card=document.createElement('article');card.className='card';
      card.innerHTML=`<div class="card-top"><div class="card-name">${t.name}</div><div class="card-points"><strong>${t.punkte}</strong> von ${t.max}</div></div>
        <div class="card-value">${t.wertText}</div><div class="card-note">${t.note}</div>
        <div class="bar"><span style="--bar:${bar};width:${Math.round(t.progress*100)}%"></span></div>`;
      root.appendChild(card);
    }
  }

  function renderMeals(el,tag){
    const root=$g(el,'#enMeals');root.innerHTML='';
    if(!tag.hatEintrag){root.innerHTML='<div class="empty-meals">Keine Mahlzeiten für diesen Tag.</div>';return}
    const gruppen=new Map();
    for(const z of tag.zeilen){if(!gruppen.has(z.mahlzeit))gruppen.set(z.mahlzeit,[]);gruppen.get(z.mahlzeit).push(z)}
    const keys=[...MAHL.filter(k=>gruppen.has(k)),...[...gruppen.keys()].filter(k=>!MAHL.includes(k))];
    for(const key of keys){
      const group=document.createElement('div');group.className='meal-group';
      group.innerHTML=`<h3>${TITEL[key]||key}</h3>`;
      const items=gruppen.get(key).slice().sort((a,b)=>(a.uhrzeit||'99:99').localeCompare(b.uhrzeit||'99:99'));
      for(const z of items)group.appendChild(mealEl(z,el));
      root.appendChild(group);
    }
  }
  function mealEl(z,root){
    const node=document.createElement('article');node.className='meal';
    const werte=hatWerte(z),bits=[];if(z.uhrzeit)bits.push(z.uhrzeit);
    if(werte){const kcal=parseZahl(z.kcal),prot=parseZahl(z.protein_g);if(kcal!=null)bits.push(ca(kcal,'kcal',0));if(prot!=null)bits.push(ca(prot,'g Protein'))}
    else bits.push('nicht geschätzt');
    const bew=(z.bewertung||'').toLowerCase();
    const badge=werte&&bew?`<span class="badge badge-${esc(bew)}">${esc(bew)}</span>`:'';
    const quelle=z.quelle==='sanji'?'<span class="badge badge-quelle">Sanji</span>':'';
    const del=z.quelle!=='sanji'&&z.id?`<button type="button" class="meal-del" data-id="${esc(z.id)}" aria-label="Eintrag löschen">Löschen</button>`:'';
    node.innerHTML=`<div class="meal-title">${esc(z.was||'Ohne Bezeichnung')}</div>
      ${z.menge_geschaetzt?`<div class="meal-menge">${esc(z.menge_geschaetzt)}</div>`:''}
      <div class="meal-meta"><span>${bits.join(' · ')}</span>${badge}${quelle}${del}</div>
      ${z.notiz?`<div class="meal-note">${esc(z.notiz)}</div>`:''}`;
    const b=node.querySelector('.meal-del');
    if(b)b.onclick=async()=>{if(!confirm('Diesen Eintrag löschen?'))return;try{await delManual(b.dataset.id);render(root)}catch(e){alert('Konnte nicht löschen.')}};
    return node;
  }

  function renderChart(el){
    const root=$g(el,'#enChart');root.innerHTML='';
    for(let i=6;i>=0;i--){
      const datum=addDays(selected,-i),tag=berechneTag(datum);
      const btn=document.createElement('button');btn.type='button';
      btn.className='chart-day'+(datum===selected?' is-selected':'');
      const hoehe=tag.score==null?0:Math.max(8,Math.round((tag.score/10)*72)),color=scoreFarbe(tag.score);
      const bar=tag.score==null?'<div class="chart-dot"></div>':`<div class="chart-bar" style="--bar:${color};height:${hoehe}px"></div>`;
      btn.innerHTML=`<div class="chart-col">${bar}</div><div class="chart-score">${tag.score==null?'–':tag.score}</div><div class="chart-label">${formatDatum(datum,{weekday:'short'}).replace('.','')}</div>`;
      btn.onclick=()=>{selected=datum;render(el)};root.appendChild(btn);
    }
  }

  function openForm(el){
    const sheet=$g(el,'#enSheet'),ov=$g(el,'#enOverlay');
    sheet.hidden=false;ov.hidden=false;
    sheet.innerHTML=`<div class="sheet-handle"></div>
      <div class="sheet-head"><h2 id="enSheetT">Mahlzeit eintragen</h2>
        <button class="icon-btn" type="button" id="enSheetX" aria-label="Schließen">✕</button></div>
      <form class="en-form" id="enForm">
        <label class="fld"><span>Tag</span><div class="inp"><input name="datum" type="date" required value="${selected||heuteISO()}"></div></label>
        <label class="fld"><span>Mahlzeit</span><div class="inp"><select name="mahlzeit" required>
          ${MAHL.map(m=>`<option value="${m}" ${m==='mittag'?'selected':''}>${TITEL[m]}</option>`).join('')}</select></div></label>
        <label class="fld"><span>Was</span><div class="inp"><input name="was" required maxlength="300" placeholder="z. B. Linsensalat"></div></label>
        <label class="fld"><span>Menge (geschätzt)</span><div class="inp"><input name="menge_geschaetzt" maxlength="200" placeholder="z. B. 1 Teller"></div></label>
        <p class="en-note">Die folgenden Werte sind optional. Fehlen sie, gibt es für den Tag keinen Score – Anzeige „nicht geschätzt“.</p>
        <div class="en-grid">
          <label class="fld"><span>ca. kcal</span><input name="kcal" type="number" inputmode="decimal" min="0" step="1"></label>
          <label class="fld"><span>ca. Protein g</span><input name="protein_g" type="number" inputmode="decimal" min="0" step="0.1"></label>
          <label class="fld"><span>ca. Ballaststoffe g</span><input name="ballaststoffe_g" type="number" inputmode="decimal" min="0" step="0.1"></label>
          <label class="fld"><span>ca. Zucker g</span><input name="zucker_g" type="number" inputmode="decimal" min="0" step="0.1"></label>
          <label class="fld"><span>ca. Portionen Gemüse/Obst</span><input name="gemuese_obst_portionen" type="number" inputmode="decimal" min="0" step="0.5"></label>
          <label class="fld"><span>NOVA 1–4</span><input name="nova" type="number" inputmode="numeric" min="1" max="4" step="1"></label>
        </div>
        <label class="fld"><span>Frittiert</span><div class="inp"><select name="frittiert"><option value="">–</option><option value="nein">nein</option><option value="ja">ja</option></select></div></label>
        <label class="fld"><span>Bewertung</span><div class="inp"><select name="bewertung"><option value="">–</option><option value="gut">gut</option><option value="okay">okay</option><option value="ungünstig">ungünstig</option></select></div></label>
        <label class="fld"><span>Notiz</span><div class="inp"><input name="notiz" maxlength="500"></div></label>
        <p class="en-msg" id="enFormMsg" role="status"></p>
        <button class="btn-primary" type="submit">Speichern</button>
      </form>
      <div class="home-indicator" aria-hidden="true"></div>`;
    requestAnimationFrame(()=>{ov.classList.add('is-open');sheet.classList.add('is-open')});
    const close=()=>{ov.classList.remove('is-open');sheet.classList.remove('is-open');setTimeout(()=>{if(!sheet.classList.contains('is-open')){sheet.hidden=true;ov.hidden=true}},280)};
    $g(el,'#enSheetX').onclick=close;ov.onclick=close;
    $g(el,'#enForm').onsubmit=async ev=>{ev.preventDefault();const f=ev.target,msg=$g(el,'#enFormMsg');
      if(!f.was.value.trim()){msg.textContent='Bitte eintragen, was du gegessen hast.';return}
      try{await addManual(Object.fromEntries(new FormData(f)));close();render(el)}
      catch(e){msg.textContent=e.status?('Konnte nicht speichern.'):('Keine Verbindung.')}};
  }

  function bind(el){
    $g(el,'#enPrev').onclick=()=>{const {min}=range();if(selected>min){selected=addDays(selected,-1);render(el)}};
    $g(el,'#enNext').onclick=()=>{const {max}=range();if(selected<max){selected=addDays(selected,1);render(el)}};
    $g(el,'#enAdd').onclick=()=>openForm(el);
  }

  return{load,view,berechneTag,refresh:el=>{if(el)$g(el,'#enRoot')&&render(el)}};
})();
